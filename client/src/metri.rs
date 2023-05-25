use reqwest::Client;
use serde_derive::{Serialize, Deserialize};
use crate::Env;
use time::OffsetDateTime;


#[derive(Deserialize, Debug)]
struct Provider {
    movement: Movement
}

#[derive(Deserialize, Debug)]
struct Movement {
    floors_count: Option<u16>,
    steps_count: Option<u32>
}

#[derive(Serialize, Debug)]
pub struct MetriReturn {
    floors: Option<u16>,
    steps: Option<u32>
}

pub async fn get(client: &Client, env: &Env) -> Result<MetriReturn, reqwest::Error> {
    let now = OffsetDateTime::now_utc().date().to_string();
    let activity = client
        .get("https://api.sandbox.metriport.com/activity")
        .header("x-api-key", &env.metri_secret)
        .query(&[
            ("userId", &env.metri_user),
            ("date",&now)
        ]).send().await?.json::<Vec<Provider>>().await?;
    Ok(MetriReturn { floors: activity[0].movement.floors_count, steps: activity[0].movement.steps_count })
}
