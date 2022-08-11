import { server } from '@/app'
import { Server } from 'socket.io'
import { useSocketServer } from 'socket-controllers'
import { MessageController } from '@/controllers/message.controller'
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3002',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

useSocketServer(io, {
  controllers: [MessageController]
})
