import mongoose, { Document, Schema } from 'mongoose';

export interface IPosition {
  position: string;
  filledBy?: mongoose.Types.ObjectId; // Reference to a User document (if filled)
}

export interface IBand extends Document {
  bandName: string;
  bandCode: string;
  manager: mongoose.Types.ObjectId; // Reference to the User who is the manager
  mandatoryPositions: IPosition[];
  members: mongoose.Types.ObjectId[]; // Array of User references
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
    },
  ],
}, { timestamps: true });

const Band = mongoose.models.Band || mongoose.model<IBand>('Band', bandSchema);
export default Band;
