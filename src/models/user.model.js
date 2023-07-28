import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: String,
    nick: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false // No pasar nunca este campo a menos que se indique
    },
    role: {
      type: String,
      default: "role_user",
      select: false
    },
    image: {
        type: String,
        default: "default.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
  }
);

const UserModel = mongoose.model('User', UserSchema, 'users');

export default UserModel;