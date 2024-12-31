import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: String, // Can store either `groupId` or `receiverId`
      // required: true,
    },
    isGroupMessage: {
      type: Boolean, // true for group messages, false for individual messages
      default: false,
    },
    content: {
      type: String,
      required: true,
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        readAt: {
          type: Date,
          default: Date.now, // Defaults to when the message was marked as read
        },
      },
    ],
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        type: {
          type: String,
          enum: ['like', 'dislike', 'love', 'laugh', 'angry'], // Optional: reaction types
        },
      },
    ],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message', // Reference to another message
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

export default mongoose.model('Message', messageSchema);