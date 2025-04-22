import mongoose, { Schema, Document } from 'mongoose'

export interface Message extends Document {
  content: string
  createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export interface User extends Document {
  username: string
  email: string
  password?: string
  verifyCode?: string
  verifyCodeExpiry?: Date
  provider: string
  isVerified: boolean
  isAcceptingMessage: boolean
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: function () {
      return this.provider !== 'google'
    },
    default: null,
  },
  provider: {
    type: String,
    default: 'credentials',
  },
  verifyCode: {
    type: String,
    required: function () {
      return this.provider !== 'google'
    },
    default: null,
  },
  verifyCodeExpiry: {
    type: Date,
    required: function () {
      return this.provider !== 'google'
    },
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema)

export default UserModel
