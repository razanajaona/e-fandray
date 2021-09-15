import express, { Express, Request, Response } from 'express'
import * as http from 'http'
import * as socketio from 'socket.io'
import cors from 'cors'

import { User, Message, Session } from './types'
import { getUniqueUsersOnlineByUsername } from './utilities'
import { PORT, CLIENT_HOST } from './config'

const app: Express = express()

//Configurer le serveur http et le serveur de socket
const server: http.Server = http.createServer(app)
const io: socketio.Server = new socketio.Server(server, {
  cors: {
    origin: CLIENT_HOST,
    credentials: true,
  },
})

app.use(cors())

let messages: Message[] = []
let users: User[] = []
let activeUserSessions: Session[] = []


app.get('/api/messages', (request: Request, response: Response) => {
  response.send({ messages })
})

app.get('/api/users', (request: Request, response: Response) => {
  response.send({ users })
})

io.on('connection', (socket) => {
  const { id } = socket.client
  console.log(`new client session: ${id}`)

  socket.on('new login', (user: User) => {
    console.log(`user connected: ${user.username}`)

    if (!users.some((existingUser) => existingUser.username === user.username)) {
      users = [...users, user]
      io.emit('new user added', user)
    }

    socket.sessionUsername = user.username
    activeUserSessions.push({
      session: id,
      username: user.username,
    })

    io.emit('users online', getUniqueUsersOnlineByUsername(activeUserSessions))
  })

  socket.on('send message', (message: Message) => {
    console.log(`message: ${message.author}: ${message.content}`)

    messages.push(message)

    io.emit('receive message', message)
  })

  socket.on('typing...', (username: string) => {
    console.log(`User Typing...: ${username}`)


    io.emit('user starts typing...', username)
  })

  socket.on('stopped typing...', (username: string) => {
    console.log(`User Stopped Typing...: ${username}`)


    io.emit('user stopped typing...', username)
  })

  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.sessionUsername}`)
    activeUserSessions = activeUserSessions.filter(
      (user) => !(user.username === socket.sessionUsername && user.session === id)
    )

    io.emit('users online', getUniqueUsersOnlineByUsername(activeUserSessions))
  })
})

app.set('port', PORT)

server.listen(PORT, () => {
  console.log('listening on *:5000')
})
