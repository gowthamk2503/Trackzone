import mongoose from 'mongoose';

const { Schema } = mongoose;

const AuditLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
      default: 'System',
    },
    userRole: {
      type: String,
      default: 'system',
    },
    action: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['AUTH', 'ATTENDANCE', 'GEOFENCE', 'EMPLOYEE', 'LEAVE', 'SYSTEM'],
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    userAgent: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
