import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { Slang } from '../models/Slang';
import { Shortform } from '../models/Shortform';
import { FriendRequest } from '../models/FriendRequest';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';

// Configure dotenv to find the .env file in the root of the backend directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDatabase = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('MONGO_URI is not defined. Please check your .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await FriendRequest.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    await Slang.deleteMany({});
    await Shortform.deleteMany({});
    console.log('Data cleared.');

    // Seed Users
    const usersPath = path.join(__dirname, '../../data/users.json');
    const usersData = await fs.readFile(usersPath, 'utf-8');
    let users = JSON.parse(usersData);

    const salt = await bcrypt.genSalt(10);
    const usersToCreate = await Promise.all(users.map(async (user: any) => ({
      ...user,
      password: await bcrypt.hash(user.password, salt)
    })));

    await User.insertMany(usersToCreate);
    console.log('Users seeded.');

    // Seed Slang
    const slangPath = path.join(__dirname, '../../data/slang.json');
    const slangData = await fs.readFile(slangPath, 'utf-8');
    const slang = JSON.parse(slangData);
    await Slang.insertMany(slang);
    console.log('Slang seeded.');

    // Seed Shortforms
    const shortformsPath = path.join(__dirname, '../../data/shortforms.json');
    const shortformsData = await fs.readFile(shortformsPath, 'utf-8');
    const shortforms = JSON.parse(shortformsData);
    await Shortform.insertMany(shortforms);
    console.log('Shortforms seeded.');

    console.log('Database seeding completed successfully!');

  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedDatabase();
