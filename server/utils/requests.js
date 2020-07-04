const axios = require('axios');
require('dotenv').config()


const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
const geoUrl = 'https://api.ipgeolocation.io/astronomy'
const geoApiKey = process.env.IPGEOLOKATION_API_KEY
const weatherApiKey = process.env.OPENWEATHER_API_KEY

const get = async (url) => {
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.log(error.response.body);
    }
}
module.exports = {
    get: async (url) => {
        return get(url)
    },
    getGeoByIp: async (ip) => {
        // return get(`${geoUrl}?apiKey=${geoApiKey}&ip=${ip}`)
        mockGeo.sun_altitude += 1
        return mockGeo
    },
    getGeoByLatLon: async (lat, lon) => {
        // return get(`${geoUrl}?apiKey=${geoApiKey}&lat=${lat}&long=${lon}`)
        mockGeo.sun_altitude += 1
        return mockGeo
    },
    getWeatherByLatLon: async (lat, lon) => {
        // return get(`${weatherUrl}?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`)
        return mockWeather

    }
}

const mockWeather = {
    coord: { lon: 16.33, lat: 56.69 },
    weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
    base: 'stations',
    main: {
        temp: 289.07,
        feels_like: 287.39,
        temp_min: 288.71,
        temp_max: 289.26,
        pressure: 1005,
        humidity: 93
    },
    visibility: 10000,
    wind: { speed: 4.6, deg: 210 },
    rain: { '1h': 0.46 },
    clouds: { all: 50 },
    dt: 1593890526,
    sys: {
        type: 1,
        id: 1757,
        country: 'SE',
        sunrise: 1593828650,
        sunset: 1593892026
    },
    timezone: 7200,
    id: 2716296,
    name: 'Elverslösa',
    cod: 200
}

const mockGeo = {
    location: { latitude: 56.690318, longitude: 16.333079 },
    date: '2020-07-04',
    sunrise: '04:12',
    sunset: '21:47',
    solar_noon: '13:00',
    day_length: '17:35',
    sun_altitude: 1.8728928364145727,
    sun_distance: 152097998.47128382,
    sun_azimuth: 310.9602130382215,
    moonrise: '21:31',
    moonset: '04:01',
    moon_altitude: -0.8798375502971025,
    moon_distance: 379853.97121171356,
    moon_azimuth: 135.8828523780242,
    moon_parallactic_angle: -13.630387728884392
}