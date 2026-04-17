export type WeatherIconType =
    | 'clear'
    | 'partly-cloudy'
    | 'cloudy'
    | 'fog'
    | 'drizzle'
    | 'rain'
    | 'snow'
    | 'thunder'

export interface CurrentWeather {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    wind_speed_10m: number
    wind_direction_10m: number
    precipitation: number
    weather_code: number
}

export interface DailyWeather {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
    precipitation_probability_max: number[]
    weather_code: number[]
    wind_speed_10m_max: number[]
}

export interface WeatherApiData {
    current: CurrentWeather
    current_units: Record<string, string>
    daily: DailyWeather
    daily_units: Record<string, string>
    timezone: string
}

export interface WeatherLocation {
    city: string
    state: string
    country: string
    latitude: number
    longitude: number
}

export interface WeatherResponse {
    weather: WeatherApiData
    location: WeatherLocation
}

export interface CityResult {
    name: string
    state: string
    country: string
    latitude: number
    longitude: number
}

export interface CurrentWeather {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    wind_speed_10m: number
    wind_direction_10m: number
    precipitation: number
    weather_code: number
    uv_index: number
    surface_pressure: number
    cloud_cover: number
    visibility: number
}