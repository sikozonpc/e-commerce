
import mongoose from 'mongoose';

export const connect = async (url: string) => mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});