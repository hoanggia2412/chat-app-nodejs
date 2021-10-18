const request = require('request');
const geocoding =  (lat,long,callback) => {
    const token = process.env.API_KEY
    request(`https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${token}`,  (error, response, body)=>{
        const res = JSON.parse(body);
        if(error)
            callback('Unable to connect location service!', undefined) 
        else if(res.features.length === 0)
            callback('Unable to find location. Try another!', undefined)
        else {
            const res = JSON.parse(body);
            callback(undefined, res.features[0].place_name)
        }
    })
}

module.exports = geocoding