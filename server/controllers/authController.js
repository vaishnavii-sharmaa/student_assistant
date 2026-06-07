import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      github: user.github,
      linkedin: user.linkedin,
      academicDetails: user.academicDetails,
      theme: user.theme,
      notificationPreferences: user.notificationPreferences,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      github: user.github,
      linkedin: user.linkedin,
      academicDetails: user.academicDetails,
      theme: user.theme,
      notificationPreferences: user.notificationPreferences,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    address: req.user.address,
    github: req.user.github,
    linkedin: req.user.linkedin,
    academicDetails: req.user.academicDetails,
    theme: req.user.theme,
    notificationPreferences: req.user.notificationPreferences,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      name,
      email,
      address,
      github,
      linkedin,
      academicDetails,
      theme,
      notificationPreferences,
      currentPassword,
      newPassword,
    } = req.body;

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (address !== undefined) user.address = address;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (academicDetails !== undefined) user.academicDetails = academicDetails;
    if (theme !== undefined) user.theme = theme;
    if (notificationPreferences !== undefined) user.notificationPreferences = notificationPreferences;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }
      user.password = newPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      github: updatedUser.github,
      linkedin: updatedUser.linkedin,
      academicDetails: updatedUser.academicDetails,
      theme: updatedUser.theme,
      notificationPreferences: updatedUser.notificationPreferences,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
