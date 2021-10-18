const path = require('path')
const express = require('express')
const app = express()
const port = process.env.port
const publicDirectoryPath = path.join(__dirname,'../public')
const Filter =  require('bad-words')
const { generateMessages, generateLocationMessages } = require('./utils/messages')
const { 
  addUser,
  removeUser,
  getUsersInRoom,
  getUser
} = require('./utils/users')

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const geocoding = require('./utils/geocoding')

io.on('connection', (socket) => {
    console.log('New user connected')
    
    socket.on('join',(options, callback) => {
      

      const {error, user} = addUser({ id: socket.id, ...options})

      if( error ){
        return callback(error)
      }
      
      socket.join(user.room)
      socket.emit('message',generateMessages('ADMIN','Welcome!'))
      socket.broadcast.to(user.room).emit('message',generateMessages('ADMIN', `${user.username} has joined !!`))
      
      io.to(user.room).emit('roomData',{
        room: user.room,
        users: getUsersInRoom(user.room).users
      })

      callback()
    })

    socket.on('message',(msg,callback) => {
      const filter = new Filter()

      if(filter.isProfane(msg))
        return callback('Profanity is not allowed!')

      const {error,user} = getUser(socket.id)
      if(error){
        return callback(error)
      }
      io.to(user.room).emit('message',generateMessages(user.username, msg))
      callback()
    })

    socket.on('location', ({latitude,longitude},callback) => {
      geocoding(latitude,longitude,(error, address) => {
          if(error)
            return io.emit('message',error)
          
          const {user,err} = getUser(socket.id)
          if(err)
            callback(err)
          
          io.to(user.room).emit('locationMessage',generateLocationMessages(user.username,address,longitude,latitude))
          callback('Your location has shared to everyone!')
      })    
    })
    
    socket.on('disconnect', () => {
      const user = removeUser(socket.id)

      if(user) {
        io.to(user.room).emit('message', generateMessages('ADMIN',`${user.username} has left!`))
        
        io.to(user.room).emit('roomData', {
          room: user.room,
          users: getUsersInRoom(user.room).users
        })
      }

    })
})



// app.use(express.static(publicDirectoryPath))
app.use(express.static(publicDirectoryPath))
app.get('/', (req, res) => {
    res.send('Hello World!')
  })


server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })