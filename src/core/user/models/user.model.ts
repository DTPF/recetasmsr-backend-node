const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  auth0Id: { type: String, required: true, unique: true },
  name: { type: String },
  lastname: String,
  nickname: String,
  email: { type: String, required: true, unique: true },
  language: String,
  avatar: String,
  role: String,
  isVerified: Boolean,
}, {
  timestamps: true
})

const UserModel = model('User', UserSchema);

export default UserModel;