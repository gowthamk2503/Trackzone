import mongoose from 'mongoose';

const { Schema } = mongoose;

const LocationPointSchema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number, default: 10 },
    address: { type: String, default: '' },
    distanceFromGeofence: { type: Number, default: 0 },
    verifiedWithinGeofence: { type: Boolean, default: false },
  },
  { _id: false }
);

const AttendanceSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true, // format: YYYY-MM-DD
      index: true,
    },
    checkIn: {
      time: { type: Date },
      location: LocationPointSchema,
      biometricVerified: { type: Boolean, default: true },
      authMethod: {
        type: String,
        enum: ['biometric', 'webauthn', 'geofence', 'qr', 'manual'],
        default: 'biometric',
      },
      deviceInfo: { type: String, default: 'Desktop/Mobile Browser' },
    },
    checkOut: {
      time: { type: Date },
      location: LocationPointSchema,
      biometricVerified: { type: Boolean, default: true },
      authMethod: {
        type: String,
        enum: ['biometric', 'webauthn', 'geofence', 'qr', 'manual'],
        default: 'biometric',
      },
      deviceInfo: { type: String, default: 'Desktop/Mobile Browser' },
    },
    workingHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Present', 'Late', 'Half-day', 'Absent', 'Pending Approval', 'On Leave'],
      default: 'Present',
    },
    officeLocation: {
      type: Schema.Types.ObjectId,
      ref: 'Geofence',
    },
    approvalStatus: {
      type: String,
      enum: ['Approved', 'Pending', 'Rejected'],
      default: 'Approved',
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    remarks: {
      type: String,
      default: '',
    },
    regularizationRequested: {
      type: Boolean,
      default: false,
    },
    regularizationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure 1 attendance record per employee per day
AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', AttendanceSchema);
