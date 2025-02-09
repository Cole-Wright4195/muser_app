import mongoose, { Document, Schema } from 'mongoose';

import User from "@/app/models/user";

export interface IPosition {
  position: string;
  filledBy?: mongoose.Types.ObjectId;
}

export interface IBand extends Document {
  bandName: string;
  bandCode: string;
  manager: mongoose.Types.ObjectId;
  mandatoryPositions: IPosition[];
  members: mongoose.Types.ObjectId[]; 
}

const bandSchema = new Schema<IBand>({
  bandName: {
    type: String,
    required: true,
  },
  bandCode: {
    type: String,
    required: true,
    unique: true,
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mandatoryPositions: [
    {
      position: {
        type: String,
        required: true,
      },
      filledBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    },
  ],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  ],
}, { timestamps: true });

const Band = mongoose.models.Band || mongoose.model<IBand>('Band', bandSchema);
export default Band;
