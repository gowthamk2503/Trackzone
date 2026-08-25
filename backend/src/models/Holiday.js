import mongoose from 'mongoose';

const { Schema } = mongoose;

const HolidaySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      unique: true,
    },
    dayOfWeek: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    isOptional: {
      type: Boolean,
      default: false,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Holiday = mongoose.model('Holiday', HolidaySchema);
