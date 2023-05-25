use crate::Env;
use reqwest::Client;
use serde_derive::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
struct Res {
    properties: Properties,
}

#[derive(Deserialize, Debug)]
struct Properties {
    #[serde(rename = "textDescription")]
    text_description: String,
    icon: Option<String>,
    temperature: Tempature,
    #[serde(rename = "windSpeed")]
    wind_speed: Wind,
}

#[derive(Deserialize, Debug)]
struct Tempature {
    value: f64,
}

// Why is this null sometimes (via api not my fault but why)
#[derive(Deserialize, Debug)]
struct Wind {
    value: Option<f64>,
}

#[derive(Serialize, Debug)]
pub struct ToSend {
    temp: f64,
    wind: Option<f64>,
    icon: Option<String>,
    desc: String
}

pub async fn get(client: &Client, env: &Env) -> Result<ToSend, reqwest::Error> {
    let r = client
        .get(format!("https://api.weather.gov/stations/{}/observations/latest",env.weather_station))
        .header("User-Agent", "evan.rest")
        .send().await?;
    let w_res = r
        .json::<Res>()
        .await?.properties;
    Ok(ToSend { temp: w_res.temperature.value, wind: w_res.wind_speed.value, icon: w_res.icon, desc: w_res.text_description })
}
