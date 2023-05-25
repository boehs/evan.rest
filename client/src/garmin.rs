use reqwest::Client;
use serde_derive::{Deserialize, Serialize};
use time::OffsetDateTime;

use crate::Env;
// A subset of the data returned
#[allow(dead_code)]
#[derive(Deserialize)]
struct MyData {
    #[serde(rename = "totalSteps")]
    total_steps: Option<u32>,
    #[serde(rename = "totalDistanceMeters")]
    total_distance_meters: Option<i32>,
    #[serde(rename = "highlyActiveSeconds")]
    highly_active: Option<i64>,
    #[serde(rename = "activeSeconds")]
    active: Option<i64>,
    #[serde(rename = "sedentarySeconds")]
    sedentary: Option<i64>,
    #[serde(rename = "sleepingSeconds")]
    sleeping: Option<i64>,
    #[serde(rename = "moderateIntensityMinutes")]
    moderate_intensity: Option<i64>,
    #[serde(rename = "vigorousIntensityMinutes")]
    vigorous_intensity: Option<i64>,
    #[serde(rename = "floorsAscendedInMeters")]
    floors_ascended_in_meters: Option<f64>,
    #[serde(rename = "floorsDescendedInMeters")]
    floors_descended_in_meters: Option<f64>,
    #[serde(rename = "floorsAscended")]
    floors_ascended: Option<f64>,
    #[serde(rename = "floorsDescended")]
    floors_descended: Option<f64>,
    #[serde(rename = "minHeartRate")]
    min_heart_rate: Option<i32>,
    #[serde(rename = "maxHeartRate")]
    max_heart_rate: Option<i32>,
    #[serde(rename = "restingHeartRate")]
    resting_heart_rate: Option<i32>,
    #[serde(rename = "measurableAwakeDuration")]
    measurable_awake: Option<i64>,
    #[serde(rename = "measurableAsleepDuration")]
    measurable_asleep: Option<i64>,
}

#[derive(Serialize, Debug)]
pub struct GarminReturn {
    floors: Option<f64>,
    steps: Option<u32>
}

pub async fn get(client: &Client, env: &Env) -> Result<GarminReturn, reqwest::Error> {
    let url = format!(
        "https://connect.garmin.com/modern/proxy/usersummary-service/usersummary/daily/{}",
        env.garmin_user
    );
    let now = OffsetDateTime::now_utc().date().to_string();
    let res = client
        .get(url)
        .header("User-Agent", "evan.rest")
        .header("NK", "NT")
        .header("Cookie", format!("SESSIONID={};__cflb={}", env.garmin_token, env.garmin_lb))
        .query(&[("calendarDate",&now)])
        .send().await?;

    let t = res.json::<MyData>().await?;

    let ret = GarminReturn {
        steps: t.total_steps,
        floors: t.floors_ascended.zip(t.floors_descended).map(|(a, b)| a + b)
    };

    Ok(ret)
}
