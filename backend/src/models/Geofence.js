import mongoose from 'mongoose';

const { Schema } = mongoose;

const GeofenceSchema = new Schema(
  {
    officeName: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      default: 'India',
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    radius: {
      type: Number,
      required: true,
      default: 150, // 150 meters
      min: 10,
      max: 5000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    wifiSSID: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Geofence = mongoose.model('Geofence', GeofenceSchema);
