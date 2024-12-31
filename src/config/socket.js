import { Server } from 'socket.io';

const configureSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  // io.on('connection', (socket) => {
  //   console.log(`User connected: ${socket.id}`);

  //   // Joining a room
  //   socket.on('join_room', (roomId) => {
  //     socket.join(roomId);
  //     console.log(`User ${socket.id} joined room ${roomId}`);
  //   });

  //   // Sending a message
  //   socket.on('send_message', (data) => {
  //     const { room, content, sender } = data;
  //     io.to(room).emit('receive_message', { room, content, sender });
  //     console.log('Message Received:', data);
      
  //   });

  //   // Typing indicator
  //   socket.on('typing', ({ room, user }) => {
  //     socket.to(room).emit('user_typing', { room, user });
  //     console.log('typing Received:', data);

  //   });

  //   // Disconnection
  //   socket.on('disconnect', () => {
  //     console.log(`User disconnected: ${socket.id}`);
  //   });
  // });
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
  
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
  
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      const chat = newMessageRecieved.chat;
      console.log(newMessageRecieved.chat)
  
      if (!chat?.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id === newMessageRecieved.sender._id) return;
        socket.in(user._id).emit("message received", newMessageRecieved);
      });
    });
  
    socket.on("disconnect", () => {
      console.log("USER DISCONNECTED");
    });
  });
  

  return io;
};

export default configureSocket;
