use crate::Env;
use reqwest::Client;
use serde_derive::Deserialize;

#[derive(Deserialize, Debug)]
struct Event<T> {
    //id: i64,
    //timestamp: String,
    duration: f64,
    data: T,
}

#[derive(Deserialize, Debug)]
struct App {
    app: String,
}

#[derive(Deserialize, Debug)]
struct Afk {
    //status: String,
}

pub struct Activity {
    pub session_length: f64,
    pub open: String,
}

pub async fn get(client: &Client, env: &Env) -> Result<Activity, reqwest::Error> {
    let last_event = client
        .get(format!(
            "{}{}/events",
            env.aw_base, env.aw_event_bucket
        ))
        .query(&[("limit", "1")])
        .send()
        .await?
        .json::<Vec<Event<App>>>()
        .await?;
    let last_event = last_event[0].data.app.clone();

    let session_length = client
        .get(format!(
            "{}{}/events",
            env.aw_base, env.aw_session_bucket
        ))
        .query(&[("limit", "1")])
        .send()
        .await?
        .json::<Vec<Event<Afk>>>()
        .await?[0]
        .duration;

    Ok(Activity {
        session_length: session_length,
        open: last_event,
    })
}
