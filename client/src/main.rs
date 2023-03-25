mod activity_watch;
mod last_fm;

use std::{error::Error, path::PathBuf, env};

use reqwest::header::AUTHORIZATION;
use serde_derive::Deserialize;
use serde_json::json;

fn default_resource() -> String {
    "http://localhost:5600/api/0/buckets/".to_string()
}

#[derive(Deserialize, Debug)]
pub struct Env {
    #[serde(default="default_resource")]
    aw_base: String,
    aw_event_bucket: String,
    aw_session_bucket: String,
    lastfm_user: String,
    lastfm_key: String,
    pw: String
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let client = reqwest::Client::new();

    let config_path = PathBuf::from(dirs::home_dir().unwrap()).join(".config/erest");

    println!("{}", config_path.clone().into_os_string().into_string().unwrap());

    dotenvy::from_path(config_path)?;
    let env = envy::from_env::<Env>()?;

    println!("Fetching session data");

    let activity = activity_watch::get(&client, &env).await?;

    println!("Fetching music");

    let music = last_fm::get(&client, &env).await?;

    println!("Getting device statistics");

    let battr = battery::Manager::new()?.batteries()?.next().unwrap()?;

    let battery = if battr.state() == battery::State::Discharging {
        Some((battr.energy().value / battr.energy_full().value * 100.0) as i8)
    } else {
        None
    };

    println!("Wrapping Up");

    let completed = json!({
        "sessionLength": activity.session_length,
        "device":  {
           "open": activity.open,
           "battery": battery,
           "os": env::consts::OS,
           "arch": env::consts::ARCH
        },
        "music": music,
    });

    println!("{}", completed);

    let endpoint = if cfg!(debug_assertions) {
        "http://localhost:3000/api/heartbeat"
    } else {
        "https://evan.rest/api/heartbeat"
    };

    let final_r = client
        .post(endpoint)
        .json(&completed)
        .header(AUTHORIZATION, &env.pw)
        .send()
        .await?
        .status();

    println!("Done with a {}", final_r.as_u16());

    Ok(())
}
