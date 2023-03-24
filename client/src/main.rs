mod activity_watch;
mod last_fm;

use std::{error::Error, fs, path::PathBuf};

use reqwest::header::AUTHORIZATION;
use serde_derive::Deserialize;
use serde_json::json;

#[derive(Deserialize, Debug)]
pub struct Env {
    aw_base: String,
    aw_event_bucket: String,
    aw_session_bucket: String,
    lastfm_user: String,
    lastfm_key: String,
    pw: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let client = reqwest::Client::new();

    dotenvy::from_path(PathBuf::from(dirs::config_local_dir().unwrap()).join("erest"))?;
    let env = envy::from_env::<Env>()?;

    println!("Fetching session data");

    let activity = activity_watch::get(&client, &env).await?;

    println!("Fetching music");

    let music = last_fm::get(&client, &env).await?;

    println!("Getting device statistics");

    let battery_charging = fs::read_to_string("/sys/class/power_supply/BAT0/status")?
        .trim()
        .to_owned();

    let battery = if battery_charging.as_str() == "Discharging" {
        Some(
            fs::read_to_string("/sys/class/power_supply/BAT0/capacity")?
                .trim()
                .parse::<i8>()?,
        )
    } else {
        None
    };

    println!("Wrapping Up");

    let completed = json!({
        "sessionLength": activity.session_length,
        "device":  {
           "open": activity.open,
           "battery": battery,
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
