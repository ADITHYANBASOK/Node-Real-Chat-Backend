import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  try {
    const { room } = req.params;
    console.log("hello",req.user.email)
    const query = {
      $or: [
        { room: room }, // Match as `room`
        { sender: room } // Match as `sender`
      ],
    };
    const messages = await Message.find( query )
      .populate('sender', 'name avatar')
      .populate('readBy.user', 'name avatar')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { chatId, content, replyTo } = req.body;
    const sender = req.user._id; // Assumes `req.user` is populated via authentication middleware.
    const room = chatId;

    // Create a new message
    const message = new Message({
      sender,
      room,
      content,
      replyTo,
    });

    console.log("New Message:", message);

    // Save the message to the database
    await message.save();

    // Populate sender and replyTo for the response
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar') // Populate sender's name and avatar
      .populate('replyTo'); // Populate the message being replied to, if any

    // Respond with the populated message
    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const readStatus = {
      user: userId,
      readAt: new Date()
    };

    if (!message.readBy.some(read => read.user.toString() === userId.toString())) {
      message.readBy.push(readStatus);
      await message.save();
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { type } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const existingReaction = message.reactions.findIndex(
      reaction => reaction.user.toString() === userId.toString()
    );

    if (existingReaction > -1) {
      message.reactions[existingReaction].type = type;
    } else {
      message.reactions.push({ user: userId, type });
    }

    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};