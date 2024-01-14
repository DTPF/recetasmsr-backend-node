const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
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

const UserModel = model('Model', UserSchema);

export default UserModel;
