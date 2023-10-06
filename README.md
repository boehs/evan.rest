```
    +       *      .         z    Z    _
        .      *           z   z      | |
  _____   ____ _ _ __    _ __ ___  ___| |_
 / _ \ \ / / _` | '_ \  | '__/ _ \/ __| __|
|  __/\ V / (_| | | | |_| | |  __/\__ \ |_
 \___| \_/ \__,_|_| |_(_)_|  \___||___/\__|
```

He sought out cold waterfalls, small thick forests, and thought about nothing at all.

## Docs

### 3rd parties

You can't opt out of any. This code was written for me. This is documented here for me, as there is no reason you'd want to use my code.

| Name | Info|
|-|-|
Last.fm | Last.fm powers Hack.fm, so it's Spotify -> Last.fm -> Hack.fm. Hack.fm pulls the last last.fm entry. Both spotify and last.fm have APIs, but spotify's requires a huge painful OAuth flow, and last.fm's just sucks. Last.fm needs `LASTFM_USER` and `LASTFM_KEY` to be set. I forgot to document the incredibly terrible flow I did by hand, so you're on your own here. Good luck!
|ActivityWatch|ActivityWatch runs locally on your computer. This script requires a window watcher and afk bucket. .env is `AW_EVENT_BUCKET` and `AW_SESSION_BUCKET` for the respective bucket names
|weather.gov|What, you thought I *actually* made my own weather provider? weather.gov requires a user agent (hardcoded to `evan.rest`), and currently the `WEATHER_STATION` .env variable needs to be set. To get the closest station, you want to do `api.weather.gov/points/lat,long`, take `gridId`, `gridX` and `gridY`, then do `/gridpoints/{gridId}/{gridX},{gridY}/stations`, find your favourite (based on name), take the `stationIdentifier`, and put it in the env.
