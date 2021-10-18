const users = []

const addUser = ({ id, username, room }) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data 
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    //Check exist user
    const existedUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if(existedUser)
        return {
            error: 'Username is in use!'
        }

    //Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex( user => user.id === id)

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    const index = users.findIndex( user => user.id === id)
    if(index !== -1){
        return { user: users[index] }
    }
    return  {
        error: 'User undefined!'
    }
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const index = users.filter( user => user.room === room.toString())
    if(index.length > 0){
        return {users: index}
    }
    return  {
        error: 'Room empty!'
    }
}


module.exports = {
    addUser,
    removeUser,
    getUsersInRoom,
    getUser,
}