const socket = io()

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('#input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#location') 
const $message = document.querySelector('#messages')

//option
const {username,room}  = Qs.parse(location.search, {ignoreQueryPrefix: true})


//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const autoScroll = () => {
    //New message element
    const $newMessage = $message.lastElementChild

    // Heigh of the  new mess
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $message.offsetHeight

    //Height of messages container
    const containerHeight = $message.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $message.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $message.scrollTop = $message.scrollHeight
    }
}

socket.on('locationMessage',(url) => {
    const { username, location, link, createdAt } = url
    const html = Mustache.render(locationMessageTemplate,{
        username, location, link, createdAt: moment(createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('message', (message) =>{
    const html = Mustache.render(messageTemplate,{
        message: message.text,
        username: message.username,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('roomData', ({room,users}) =>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    console.log(users);
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit',(e) => {
    const input = e.target.elements.message
    const value = input.value
    if (value) {
        socket.emit('message',value, error =>{
            if(error){
                return console.log(error);
            }
            console.log('Message delivered!!');
        })
        input.value =''
    }
    e.preventDefault()
})
$sendLocationButton.addEventListener('click',(e) => {
    const checked = e.target.checked
    if(checked){
       if(!navigator.geolocation){
            alert('Your browser is not supported geolocation')
       }
       navigator.geolocation.getCurrentPosition ( position => {
        const {coords} =  position
        socket.emit('location',{
            latitude: coords.latitude,
            longitude: coords.longitude
        }, (msg) => {
            console.log(msg); 
        })
       })
    }
    else
        console.log('off location');

})

socket.emit('join',{ username , room }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})

// document.querySelector('#increment').addEventListener('click',(e) => {
//     console.log('Clicked');
//     socket.emit('increment')
//     e.preventDefault() 
// })
