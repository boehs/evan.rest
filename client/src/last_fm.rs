use reqwest::Client;
use serde_derive::{Deserialize, Serialize};

use crate::Env;

#[derive(Deserialize, Debug)]
struct Response {
    recenttracks: Tracks,
}

#[derive(Deserialize, Debug)]
struct Tracks {
    track: Vec<Track>,
}

#[derive(Deserialize, Debug)]
struct Track {
    artist: Artist,
    name: String,
    url: String,
    #[serde(rename = "@attr")]
    attr: Option<Attr>,
}

#[derive(Deserialize, Debug)]
struct Artist {
    #[serde(rename = "#text")]
    text: String,
}

#[derive(Deserialize, Debug)]
struct Attr {
    //nowplaying: String,
}

#[derive(Serialize, Debug)]
pub struct Music {
    artist: String,
    track: String,
    url: String,
}

pub async fn get(client: &Client, env: &Env) -> Result<Option<Music>, reqwest::Error> {
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
        .json::<Response>()
        .await?;

    let last_fm_track = &last_fm_track.recenttracks.track[0];

    Ok(match &last_fm_track.attr {
        Some(_) => Some(Music {
            artist: last_fm_track.artist.text.to_owned(),
            track: last_fm_track.name.to_owned(),
            url: last_fm_track.url.to_owned(),
        }),
        None => None,
    })
}
