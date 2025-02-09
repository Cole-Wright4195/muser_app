import mongoose, { Document, Schema } from 'mongoose';

export interface IPosition {
  position: string;
  filledBy?: mongoose.Types.ObjectId;
}

export interface IBandMember {
  _id: mongoose.Types.ObjectId; // User ID reference
  firstName: string;
  lastName: string;
  availability?: 'green' | 'yellow' | 'red'; // Status Light (YES/NO Default Yellow)
}

export interface IBand extends Document {
  bandName: string;
  bandCode: string;
  manager: mongoose.Types.ObjectId;
  mandatoryPositions: IPosition[];
  members: IBandMember[]; // Store members as objects with availability
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
      _id: { type: Schema.Types.ObjectId, ref: 'User' },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      availability: { type: String, enum: ['green', 'yellow', 'red'], default: 'yellow' }, // Default yellow
    },
  ],
}, { timestamps: true });

const Band = mongoose.models.Band || mongoose.model<IBand>('Band', bandSchema);
export default Band;
