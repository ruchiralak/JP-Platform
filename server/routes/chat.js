const socketIo = require('socket.io');
const Message = require('../models/message'); // Make sure this path is correct

// Function to initialize Socket.IO
const setupSocketIO = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Event listener for sending messages
    socket.on('sendMessage', async ({ sender, receiver, message }) => {
      try {
        const newMessage = new Message({ sender, receiver, message });
        await newMessage.save();
        io.emit('message', { sender, receiver, message });
      } catch (error) {
        console.error('Error saving message:', error.message);
      }
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = setupSocketIO;
