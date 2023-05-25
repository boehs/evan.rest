/**
 * parsed from {@link https://api.weather.gov/icons/}
 */
export const descTypes = {
    skc: "Fair/clear",
    few: "A few clouds",
    sct: "Partly cloudy",
    bkn: "Mostly cloudy",
    ovc: "Overcast",
    wind_skc: "Fair/clear and windy",
    wind_few: "A few clouds and windy",
    wind_sct: "Partly cloudy and windy",
    wind_bkn: "Mostly cloudy and windy",
    wind_ovc: "Overcast and windy",
    snow: "Snow",
    rain_snow: "Rain/snow",
    rain_sleet: "Rain/sleet",
    snow_sleet: "Snow/sleet",
    fzra: "Freezing rain",
    rain_fzra: "Rain/freezing rain",
    snow_fzra: "Freezing rain/snow",
    sleet: "Sleet",
    rain: "Rain",
    rain_showers: "Rain showers",
    rain_showers_hi: "Rain showers",
    tsra: "Thunderstorm",
    tsra_sct: "Thunderstorm",
    tsra_hi: "Thunderstorm",
    tornado: "Tornado",
    hurricane: "Hurricane",
    tropical_storm: "Tropical storm",
    dust: "Dust",
    smoke: "Smoke",
    haze: "Haze",
    hot: "Hot",
    cold: "Cold",
    blizzard: "Blizzard",
    fog: "Fog/mist"
} as const

type descTypeOutput = typeof descTypes[keyof typeof descTypes]

export enum normalizeStatus {
    Remapped,
    Original,
    BadInput
}

/**
 *
 * @param imp the string input from the icon field, because of {@link https://github.com/weather-gov/api/discussions/547#discussioncomment-5982402}
 * @returns the remapped description, if status is remapped. If the parsing went correctly, but there was no remap, it is the parsed string. If parsing failed, it is undefined.
 */
export const normalizeDesc = (imp: string): [descTypeOutput, string] | [string, normalizeStatus.Original] | [undefined, normalizeStatus.BadInput] => {
    let m = imp.match(/.*\/(.*)\?/)
    if (m && m[1] != undefined) {
        let p: descTypeOutput | undefined = descTypes[m[1] as keyof typeof descTypes]
        if (p != undefined) return [p, m[1]]
        else return [m[1], normalizeStatus.Original]
    }
    return [undefined, normalizeStatus.BadInput]
}

export function getWeatherDesc(imp: ReturnType<typeof normalizeDesc>, temp: number, windSpeed: number) {
    if (imp[1] == normalizeStatus.BadInput) return undefined
    if (imp[1] == normalizeStatus.Original) return imp[0]

    let desc = imp[0]

    if (['Tornado', 'Hurricane'].includes(desc)) return 'twirlblast'

    if (desc == 'Dust') return 'drouth'

    if ((desc == 'Fair/clear' || desc == 'Hot') && temp >= 32) return 'hellish'
    if (["Fair/clear", "Fair/clear and windy"].includes(desc) && temp < 0) return 'foxy'
    if (temp >= 23 && temp <= 30 && ['skc', 'few'].includes(imp[1])) return 'balmy'
    if (['skc', 'few', 'sct', 'bkn', 'ovc'].includes(imp[1])) {
        if (temp >= 20 && temp < 23) return 'clement'
        if (temp < -5) return 'snell'
    }

    // a sudden violent gust of wind or a localized storm, especially one bringing rain, snow, or sleet.
    if ((desc == 'Rain showers' && windSpeed > 25) || desc == 'Blizzard') return 'squall'
    if (desc == 'Rain showers') return 'mizzle'

    if (desc == 'Fog/mist' || desc == 'Haze') return 'brume'

    // (of the weather) unpleasantly cold or wet.
    // TODO: Better
    if (desc == 'Tropical storm') return 'inclement'
    if (desc == 'Thunderstorm') return 'swullocking'

    if (['Sleet', 'Snow', 'Snow/sleet', 'Freezing rain/snow', 'Rain/snow'].includes(desc)) return 'blenky'

    // “Gleamy” is more optimistic, noting occasional intervals of sunshine amid the gloom.
    if (desc == 'Mostly cloudy' || desc == 'Partly cloudy') return 'gleamy'

    if (desc == 'Overcast') return 'leaden'

    // characterized by strong winds.
    if (["wind_skc", "wind_few", "wind_sct", "wind_bkn", "wind_ovc"].includes(imp[1]) && windSpeed > 25) return 'blustery'

    if (desc == 'Rain') return 'Deluge'

    return imp[1]
}

export function run(imp: Heartbeat) {
    const w = imp.data.weather
    const parsed = normalizeDesc(w.icon!) || [w.desc, normalizeStatus.Original]
    const word = getWeatherDesc(parsed, w.temp, w.speed)
    return {
        word: word,
        temp: w.temp,
        desc: parsed[0]
    }
}
