import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Geofence } from '../models/Geofence.js';
import { Attendance } from '../models/Attendance.js';
import { Leave } from '../models/Leave.js';
import { Holiday } from '../models/Holiday.js';
import { AuditLog } from '../models/AuditLog.js';
import { Notification } from '../models/Notification.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const seedDatabase = async () => {
  try {
    console.log('🌱 [TrackZone Seeder] Starting database population...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Geofence.deleteMany({}),
      Attendance.deleteMany({}),
      Leave.deleteMany({}),
      Holiday.deleteMany({}),
      AuditLog.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('🧹 Existing collections cleaned.');

    // 1. Create Geofenced Office Location (Sri Eshwar College of Engineering Boys Hostel ONLY)
    const offices = await Geofence.create([
      {
        officeName: 'Sri Eshwar College of Engineering Boys Hostel',
        code: 'SECE-HOSTEL',
        address: 'Sri Eshwar College of Engineering, Kondampatti Post, Vadasithur',
        city: 'Coimbatore',
        country: 'India',
        latitude: 10.826844,
        longitude: 77.058983,
        radius: 150, // 150 meters
        isActive: true,
        timezone: 'Asia/Kolkata',
        wifiSSID: 'SECE_Hostel_WiFi',
      },
    ]);

    console.log(`📍 Created ${offices.length} geofenced office location (SECE-HOSTEL).`);

    const hostelOffice = offices[0];

    // 2. Create Admin and Employees
    // Note: Passwords will be automatically hashed by UserSchema pre('save') hook
    const adminUser = new User({
      employeeId: 'TZ-1001',
      name: 'Alexander Pierce (Admin)',
      email: 'admin@trackzone.com',
      password: 'Admin@123',
      phone: '+1 (555) 019-2834',
      department: 'Executive Management',
      designation: 'VP of Engineering & Security',
      role: 'admin',
      officeId: hostelOffice._id,
      shiftSchedule: '09:00 - 18:00',
      isActive: true,
      biometricRegistered: true,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });
    await adminUser.save();

    const employee1 = new User({
      employeeId: 'TZ-1002',
      name: 'Sarah Chen',
      email: 'sarah.chen@trackzone.com',
      password: 'Employee@123',
      phone: '+91 98765 43210',
      department: 'Engineering',
      designation: 'Senior Full Stack Lead',
      role: 'employee',
      officeId: hostelOffice._id,
      shiftSchedule: '09:00 - 18:00',
      isActive: true,
      biometricRegistered: true,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    });
    await employee1.save();

    const employee2 = new User({
      employeeId: 'TZ-1003',
      name: 'David Kumar',
      email: 'david.kumar@trackzone.com',
      password: 'Employee@123',
      phone: '+91 91234 56780',
      department: 'Infrastructure & DevOps',
      designation: 'Cloud Solutions Architect',
      role: 'employee',
      officeId: hostelOffice._id,
      shiftSchedule: '09:00 - 18:00',
      isActive: true,
      biometricRegistered: true,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });
    await employee2.save();

    const employee3 = new User({
      employeeId: 'TZ-1004',
      name: 'Emma Watson',
      email: 'emma.watson@trackzone.com',
      password: 'Employee@123',
      phone: '+1 (415) 555-0143',
      department: 'Human Resources',
      designation: 'Head of People & Culture',
      role: 'employee',
      officeId: hostelOffice._id,
      shiftSchedule: '09:00 - 18:00',
      isActive: true,
      biometricRegistered: true,
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    });
    await employee3.save();

    const employee4 = new User({
      employeeId: 'TZ-1005',
      name: 'Rachel Green',
      email: 'rachel.green@trackzone.com',
      password: 'Employee@123',
      phone: '+1 (212) 555-0199',
      department: 'Product & Design',
      designation: 'Principal UI/UX Architect',
      role: 'employee',
      officeId: hostelOffice._id,
      shiftSchedule: '09:30 - 18:30',
      isActive: true,
      biometricRegistered: true,
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    });
    await employee4.save();

    const employee5 = new User({
      employeeId: 'TZ-1006',
      name: 'Marcus Vance',
      email: 'marcus.vance@trackzone.com',
      password: 'Employee@123',
      phone: '+91 97654 32109',
      department: 'Marketing & Sales',
      designation: 'Growth Marketing Director',
      role: 'employee',
      officeId: hostelOffice._id,
      shiftSchedule: '09:00 - 18:00',
      isActive: true,
      biometricRegistered: true,
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    });
    await employee5.save();

    const allUsers = [adminUser, employee1, employee2, employee3, employee4, employee5];
    console.log(`👤 Created ${allUsers.length} system users (1 Admin + 5 Employees).`);

    // 3. Generate 30 Days of Historical Attendance for employees
    const attendanceRecords = [];
    const today = new Date();

    for (const emp of [employee1, employee2, employee3, employee4, employee5]) {
      const office = hostelOffice;

      for (let i = 28; i >= 0; i--) {
        const recordDate = new Date();
        recordDate.setDate(today.getDate() - i);

        // Skip weekends
        const dayOfWeek = recordDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        const dateStr = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}-${String(recordDate.getDate()).padStart(2, '0')}`;

        // Determine status pattern
        let status = 'Present';
        let checkInHour = 9;
        let checkInMinute = Math.floor(Math.random() * 15); // 9:00 to 9:15
        let checkOutHour = 18;
        let checkOutMinute = Math.floor(Math.random() * 45); // 18:00 to 18:45
        let workingHours = 8.5 + (Math.floor(Math.random() * 8) / 10);

        if (i % 7 === 1) {
          // Late day
          status = 'Late';
          checkInHour = 9;
          checkInMinute = 40 + Math.floor(Math.random() * 15);
          workingHours = 8.0;
        } else if (i % 13 === 0) {
          // Half-day
          status = 'Half-day';
          checkOutHour = 13;
          checkOutMinute = 30;
          workingHours = 4.2;
        }

        const checkInTime = new Date(recordDate);
        checkInTime.setHours(checkInHour, checkInMinute, 0, 0);

        const checkOutTime = new Date(recordDate);
        checkOutTime.setHours(checkOutHour, checkOutMinute, 0, 0);

        // Calculate slight GPS offset within geofence radius (e.g. 20-60 meters)
        const latOffset = (Math.random() - 0.5) * 0.0008;
        const lonOffset = (Math.random() - 0.5) * 0.0008;

        attendanceRecords.push({
          employee: emp._id,
          employeeId: emp.employeeId,
          date: dateStr,
          checkIn: {
            time: checkInTime,
            location: {
              latitude: office.latitude + latOffset,
              longitude: office.longitude + lonOffset,
              accuracy: 8,
              address: `${office.officeName}, ${office.city}`,
              distanceFromGeofence: Math.floor(Math.random() * 40) + 15,
              verifiedWithinGeofence: true,
            },
            biometricVerified: true,
            authMethod: 'biometric',
            deviceInfo: 'Chrome on MacOS (WebAuthn TouchID)',
          },
          checkOut: i === 0 ? undefined : {
            time: checkOutTime,
            location: {
              latitude: office.latitude + latOffset,
              longitude: office.longitude + lonOffset,
              accuracy: 8,
              address: `${office.officeName}, ${office.city}`,
              distanceFromGeofence: Math.floor(Math.random() * 40) + 15,
              verifiedWithinGeofence: true,
            },
            biometricVerified: true,
            authMethod: 'biometric',
            deviceInfo: 'Chrome on MacOS (WebAuthn TouchID)',
          },
          workingHours: i === 0 ? 0 : workingHours,
          status,
          officeLocation: office._id,
          approvalStatus: 'Approved',
        });
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`📅 Generated ${attendanceRecords.length} historical attendance records.`);

    // 4. Create Sample Leave Applications
    await Leave.create([
      {
        employee: employee1._id,
        employeeId: employee1.employeeId,
        leaveType: 'Paid Leave',
        startDate: '2026-09-10',
        endDate: '2026-09-12',
        totalDays: 3,
        reason: 'Annual family vacation and rest period.',
        status: 'Approved',
        approvedBy: adminUser._id,
      },
      {
        employee: employee2._id,
        employeeId: employee2.employeeId,
        leaveType: 'Sick Leave',
        startDate: '2026-08-28',
        endDate: '2026-08-29',
        totalDays: 2,
        reason: 'Severe viral fever and physician advised bed rest.',
        status: 'Pending',
      },
      {
        employee: employee4._id,
        employeeId: employee4.employeeId,
        leaveType: 'Casual Leave',
        startDate: '2026-09-01',
        endDate: '2026-09-01',
        totalDays: 1,
        reason: 'Personal relocation and home setup formalities.',
        status: 'Approved',
        approvedBy: adminUser._id,
      },
      {
        employee: employee5._id,
        employeeId: employee5.employeeId,
        leaveType: 'Emergency Leave',
        startDate: '2026-08-20',
        endDate: '2026-08-21',
        totalDays: 2,
        reason: 'Urgent family emergency.',
        status: 'Approved',
        approvedBy: adminUser._id,
      },
    ]);
    console.log('🌴 Created sample leave applications.');

    // 5. Create Official Holidays
    await Holiday.create([
      { name: "New Year's Day", date: '2026-01-01', dayOfWeek: 'Thursday', description: 'Global celebration of the new year', isOptional: false, year: 2026 },
      { name: 'Republic Day', date: '2026-01-26', dayOfWeek: 'Monday', description: 'National holiday marking Constitution Day', isOptional: false, year: 2026 },
      { name: 'Good Friday', date: '2026-04-03', dayOfWeek: 'Friday', description: 'Spring holiday celebration', isOptional: false, year: 2026 },
      { name: 'International Labor Day', date: '2026-05-01', dayOfWeek: 'Friday', description: 'Workers Day', isOptional: false, year: 2026 },
      { name: 'Independence Day', date: '2026-08-15', dayOfWeek: 'Saturday', description: 'National Independence commemoration', isOptional: false, year: 2026 },
      { name: 'Gandhi Jayanti', date: '2026-10-02', dayOfWeek: 'Friday', description: 'Celebration of Mahatma Gandhi birthday', isOptional: false, year: 2026 },
      { name: 'Diwali (Festival of Lights)', date: '2026-11-08', dayOfWeek: 'Sunday', description: 'Major festival holiday', isOptional: false, year: 2026 },
      { name: 'Christmas Day', date: '2026-12-25', dayOfWeek: 'Friday', description: 'Christmas celebration holiday', isOptional: false, year: 2026 },
    ]);
    console.log('🎉 Seeded 2026 company holiday calendar.');

    // 6. Create Initial Notifications
    await Notification.create([
      {
        user: employee1._id,
        title: 'Welcome to TrackZone Enterprise',
        message: 'Your geofence & biometric attendance profile has been activated successfully.',
        type: 'system',
        read: false,
      },
      {
        user: employee1._id,
        title: 'Leave Approved',
        message: 'Your Paid Leave request for Sept 10-12 has been approved by Alexander Pierce.',
        type: 'leave',
        read: true,
      },
      {
        user: adminUser._id,
        title: 'New Leave Request',
        message: 'David Kumar submitted a Sick Leave request for Aug 28-29 awaiting your review.',
        type: 'leave',
        read: false,
      },
    ]);

    // 7. Seed Audit Logs
    await AuditLog.create([
      {
        userName: 'Alexander Pierce (Admin)',
        userRole: 'admin',
        action: 'SYSTEM_INITIALIZATION',
        category: 'SYSTEM',
        details: 'TrackZone Attendance Cluster initialized with Sri Eshwar College of Engineering Boys Hostel geofence (SECE-HOSTEL).',
        ipAddress: '192.168.1.1',
        userAgent: 'TrackZone Engine v1.0',
        timestamp: new Date(Date.now() - 3600000 * 24 * 30),
      },
      {
        userName: 'Alexander Pierce (Admin)',
        userRole: 'admin',
        action: 'GEOFENCE_CREATED',
        category: 'GEOFENCE',
        details: 'Configured Sri Eshwar College of Engineering Boys Hostel (Radius 150m at [10.826844, 77.058983])',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 Chrome/128.0',
        timestamp: new Date(Date.now() - 3600000 * 24 * 25),
      },
      {
        userName: 'Sarah Chen',
        userRole: 'employee',
        action: 'BIOMETRIC_ENROLLED',
        category: 'AUTH',
        details: 'WebAuthn hardware biometric authenticator registered.',
        ipAddress: '192.168.1.45',
        userAgent: 'Mozilla/5.0 Safari/605.1.15',
        timestamp: new Date(Date.now() - 3600000 * 24 * 20),
      },
    ]);

    console.log('✅ [TrackZone Seeder] Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('❌ [TrackZone Seeder] Seeding error:', error.message);
    throw error;
  }
};

// Standalone CLI execution
if (process.argv[1] && process.argv[1].includes('seedData')) {
  connectDB().then(async () => {
    await seedDatabase();
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
