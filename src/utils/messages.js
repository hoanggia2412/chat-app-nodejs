const generateMessages = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime
    }
}
const generateLocationMessages = (username, address, longitude, latitude) => {
    return {
        location:  address,
        link: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: new Date().getTime(),
        username
    }
}
module.exports = { generateMessages, generateLocationMessages}