import Group from '../models/Group.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';


export const createGroup = async (req, res) => {
  try {
    const { name, members, token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = decoded.userId;


    // Validate required fields
    if (!name || !members || !admin) {
      return res.status(400).json({ message: 'Group name, members, and admin are required.' });
    }

    // Ensure members array includes the admin ID if not already present
    const uniqueMembers = [...new Set([...members, admin])];

    // Check if all user IDs in the members array exist in the database
    const users = await User.find({ _id: { $in: uniqueMembers } });
    if (users.length !== uniqueMembers.length) {
      return res.status(404).json({ message: 'One or more users not found.' });
    }

    // Create the group
    const group = new Group({
      name,
      members: uniqueMembers,
      admin
    });

    // Save group to the database
    await group.save();

    res.status(201).json({ message: 'Group created successfully!', group });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Server error. Could not create group.' });
  }
};
