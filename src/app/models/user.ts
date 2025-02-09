import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  primaryInstrument: string;
  backupInstrument?: string;
  isManager: boolean;
  band?: mongoose.Types.ObjectId; 
  password: string;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  primaryInstrument: {
    type: String,
    required: true,
  },
  backupInstrument: {
    type: String,
  },
  isManager: {
    type: Boolean,
    default: false,
  },
  band: {
    type: Schema.Types.ObjectId,
    ref: 'Band',
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
