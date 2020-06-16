const axios = require('axios');

module.exports = {
    get: async (url) => {
        try {
            const response = await axios.get(url)
            return response.data
        } catch (error) {
            console.log(error.response.body);
        }
    }
}