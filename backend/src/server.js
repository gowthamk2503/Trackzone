import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Geofence } from './models/Geofence.js';
import { seedDatabase } from './seed/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;

// Guarantee SECE-HOSTEL is the single active geofence and legacy offices are migrated
const syncHostelGeofence = async () => {
  try {
    let hostelOffice = await Geofence.findOne({ code: 'SECE-HOSTEL' });
    const legacyOffice = await Geofence.findOne({ code: 'BLR-HQ' });

    if (!hostelOffice && legacyOffice) {
      legacyOffice.officeName = 'Sri Eshwar College of Engineering Boys Hostel';
      legacyOffice.code = 'SECE-HOSTEL';
      legacyOffice.address = 'Sri Eshwar College of Engineering, Kondampatti Post, Vadasithur';
      legacyOffice.city = 'Coimbatore';
      legacyOffice.country = 'India';
      legacyOffice.latitude = 10.826844;
      legacyOffice.longitude = 77.058983;
      legacyOffice.radius = 150;
      legacyOffice.timezone = 'Asia/Kolkata';
      legacyOffice.wifiSSID = 'SECE_Hostel_WiFi';
      legacyOffice.isActive = true;
      await legacyOffice.save();
      hostelOffice = legacyOffice;
      console.log('📍 [TrackZone] Migrated legacy BLR-HQ to SECE-HOSTEL.');
    } else if (!hostelOffice) {
      hostelOffice = await Geofence.create({
        officeName: 'Sri Eshwar College of Engineering Boys Hostel',
        code: 'SECE-HOSTEL',
        address: 'Sri Eshwar College of Engineering, Kondampatti Post, Vadasithur',
        city: 'Coimbatore',
        country: 'India',
        latitude: 10.826844,
        longitude: 77.058983,
        radius: 150,
        timezone: 'Asia/Kolkata',
        isActive: true,
        wifiSSID: 'SECE_Hostel_WiFi',
      });
      console.log('📍 [TrackZone] Initialized SECE-HOSTEL geofence.');
    }

    // Ensure no old offices exist — SECE-HOSTEL is the ONLY geofence
    await Geofence.deleteMany({ code: { $ne: 'SECE-HOSTEL' } });

    // Link all existing users to the SECE-HOSTEL geofence and ensure active status
    if (hostelOffice) {
      await User.updateMany({}, { officeId: hostelOffice._id, isActive: true });
    } else {
      await User.updateMany({}, { isActive: true });
    }
  } catch (err) {
    console.error('Error syncing SECE-HOSTEL geofence:', err);
  }
};

const startServer = async () => {
  try {
    const isConnected = await connectDB();

    if (isConnected) {
      // Check if DB is uninitialized; auto-seed if no users exist
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('⚡ [TrackZone] No users found. Auto-seeding default enterprise dataset...');
        await seedDatabase();
      } else {
        // Ensure active geofence is strictly SECE-HOSTEL
        await syncHostelGeofence();
      }
    }

    const app = createApp();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
=====================================================
🚀  TRACKZONE ENTERPRISE ATTENDANCE ENGINE ONLINE  🚀
=====================================================
📡  Server Port:      http://localhost:${PORT}
🔒  Geofencing:       Haversine Radius Validator Enabled
👆  Biometrics:       WebAuthn Fingerprint Service Enabled
🌐  Environment:      ${process.env.NODE_ENV || 'development'}
=====================================================
      `);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
