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
        return get(`${geoUrl}?apiKey=${geoApiKey}&ip=${ip}`)
    },
    getGeoByLatLon: async (lat, lon) => {
        return get(`${geoUrl}?apiKey=${geoApiKey}&lat=${lat}&long=${lon}`)
    },
    getWeatherByLatLon: async (lat, lon) => {
        return get(`${weatherUrl}?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`)
    }
}