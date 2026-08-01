import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await mongoose.connection.db.collection('settings').dropIndex('userId_1');
  console.log('Index supprimé');
  await mongoose.connection.db.collection('settings').deleteMany({ userId: null });
  console.log('Documents fantômes supprimés');
  await mongoose.disconnect();
}

run();