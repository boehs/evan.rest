use std::fs;

use reqwest;
use serde_derive::{Deserialize, Serialize};
use serde_json::json;

#[derive(Deserialize, Debug)]
struct AWEvent<T> {
    //id: i64,
    //timestamp: String,
    duration: f64,
    data: T,
}

#[derive(Deserialize, Debug)]
struct AWAppData {
    app: String,
}

#[derive(Deserialize, Debug)]
struct AWAFKData {
    //status: String,
}

#[derive(Deserialize, Debug)]
pub struct Env {
    aw_base: String,
    aw_event_bucket: String,
    aw_session_bucket: String,
    lastfm_user: String,
    lastfm_key: String,
}

#[derive(Deserialize, Debug)]
struct LfmRes {
    recenttracks: LfmResTracks,
}

#[derive(Deserialize, Debug)]
struct LfmResTracks {
    track: Vec<LfmTrack>,
}

#[derive(Deserialize, Debug)]
struct LfmTrack {
    artist: LfmArtist,
    name: String,
    url: String,
    #[serde(rename = "@attr")]
    attr: Option<LfmAttr>,
}

#[derive(Deserialize, Debug)]
struct LfmArtist {
    #[serde(rename = "#text")]
    text: String,
}

#[derive(Deserialize, Debug)]
struct LfmAttr {
    //nowplaying: String,
}

#[derive(Serialize, Debug)]
struct Device {
    open: String,
    battery: Option<i8>,
}

#[derive(Serialize, Debug)]
struct LastFm {
    artist: String,
    track: String,
    url: String,
}

#[derive(Serialize, Debug)]
struct Res {
    sessionLength: i16,
    device: Device,
    music: Option<LastFm>,
}

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let client = reqwest::Client::new();

    let env = envy::from_env::<Env>().unwrap();

    println!("Fetching session data");

    let last_event = client
        .get(format!(
            "{}buckets/{}/events",
            env.aw_base, env.aw_event_bucket
        ))
        .query(&[("limit", "1")])
        .send()
        .await?
        .json::<Vec<AWEvent<AWAppData>>>()
        .await?;
    let last_event = last_event[0].data.app.clone();

    let session_length = client
        .get(format!(
            "{}buckets/{}/events",
            env.aw_base, env.aw_session_bucket
        ))
        .query(&[("limit", "1")])
        .send()
        .await?
        .json::<Vec<AWEvent<AWAFKData>>>()
        .await?[0]
        .duration;

    println!("Fetching music");

    let last_fm_track = client
        .get("http://ws.audioscrobbler.com/2.0/")
        .query(&[
            ("limit", "1"),
            ("method", "user.getrecenttracks"),
            ("user", env.lastfm_user.as_str()),
            ("api_key", env.lastfm_key.as_str()),
            ("format", "json"),
        ])
        .send()
        .await?
        .json::<LfmRes>()
        .await?;
    
    let last_fm_track = &last_fm_track.recenttracks.track[0];

    let music = match &last_fm_track.attr {
        Some(_) => Some(LastFm {
            artist: last_fm_track.artist.text.to_owned(),
            track: last_fm_track.name.to_owned(),
            url: last_fm_track.url.to_owned(),
        }),
        None => None,
    };

    println!("Getting device statistics");

    let battery_charging = fs::read_to_string("/sys/class/power_supply/BAT0/status")
        .unwrap()
        .trim()
        .to_owned();

    let battery = match battery_charging.as_str() {
        "Discharging" => Some(
            fs::read_to_string("/sys/class/power_supply/BAT0/capacity")
                .unwrap()
                .trim()
                .parse::<i8>()
                .unwrap(),
        ),
        _ => None,
    };

    println!("Wrapping Up");

    let completed = json!({
        "sessionLength": session_length,
        "device":  {
           "open": last_event,
           "battery": battery,
        },
        "music": music,
    });

    println!("{}", completed);

    client
        .post("https://evan.rest/heartbeat")
        .json(&completed)
        .send()
        .await?;

    Ok(())
}
