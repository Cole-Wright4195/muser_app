import mongoose, { Document, Schema } from 'mongoose';

import User from "@/app/models/user";

export interface IAttendance {
  user: mongoose.Types.ObjectId; // Reference to a User document
  response: 'Yes' | 'No' | 'Pending';
}

export interface IEvent extends Document {
  band: mongoose.Types.ObjectId; // Reference to the Band document
  eventname: string;
  date: Date;
  location: string;
  attendance: IAttendance[];
  status: 'Scheduled' | 'Canceled';
}

const eventSchema = new Schema<IEvent>({
  band: {
    type: Schema.Types.ObjectId,
    ref: 'Band',
    required: true,
  },
  eventname: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  attendance: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
      },
      response: {
        type: String,
        enum: ['Yes', 'No', 'Pending'],
        default: 'Pending',
      },
    },
  ],
  status: {
    type: String,
    enum: ['Scheduled', 'Canceled'],
    default: 'Scheduled',
  },
}, { timestamps: true });

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
export default Event;
