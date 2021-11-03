import mongoose from 'mongoose';
import { PasswordService } from '../services/password';

interface UserAttributes {
  username: string;
  password: string;
}

export interface UserDocument extends mongoose.Document, UserAttributes { }

interface UserModel extends mongoose.Model<UserDocument> {
  build: (attrs: UserAttributes) => UserDocument;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

userSchema.statics.build = (attrs: UserAttributes) => new User(attrs);

userSchema.pre('save', async function (done) {
  if (!this.isModified('password')) return;

  const hashedPassword = await PasswordService.toHash(this.get('password'));
  this.set('password', hashedPassword);

  done();
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);
export { User };

