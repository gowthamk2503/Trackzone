# 📡 TrackZone REST API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require the HTTP Header:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

---

## 1. Authentication Endpoints

### `POST /auth/register`
Registers a new employee or administrator.

**Request Body:**
```json
{
  "name": "Sarah Chen",
  "email": "sarah.chen@trackzone.com",
  "password": "Employee@123",
  "phone": "+91 98765 43210",
  "department": "Engineering",
  "designation": "Senior Full Stack Lead",
  "role": "employee",
  "officeId": "66c9f1a0e1b2c3d4e5f6a7b8"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Account successfully registered",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "user": {
    "_id": "66c9f1a0e1b2c3d4e5f6a7b9",
    "employeeId": "TZ-1002",
    "name": "Sarah Chen",
    "email": "sarah.chen@trackzone.com",
    "role": "employee",
    "department": "Engineering",
    "designation": "Senior Full Stack Lead"
  }
}
```

---

### `POST /auth/login`
Authenticates a user and issues JWT Access and Refresh tokens.

**Request Body:**
```json
{
  "email": "sarah.chen@trackzone.com",
  "password": "Employee@123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "user": { ... }
}
```

---

### `POST /auth/refresh`
Exchanges a valid refresh token for a new access token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5c..."
}
```

---

## 2. Attendance & Geofencing Endpoints

### `POST /attendance/checkin`
Marks daily check-in with GPS Geofencing and Biometric verification.

**Request Body:**
```json
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "officeId": "66c9f1a0e1b2c3d4e5f6a7b8",
  "biometricVerified": true,
  "authMethod": "biometric",
  "deviceInfo": "Chrome MacOS (WebAuthn TouchID)"
}
```

**Response (200 OK — Inside Geofence):**
```json
{
  "success": true,
  "message": "Checked in successfully as Present!",
  "attendance": {
    "_id": "66c9f220e1b2c3d4e5f6a7c0",
    "employeeId": "TZ-1002",
    "date": "2026-08-25",
    "status": "Present",
    "checkIn": {
      "time": "2026-08-25T09:12:00.000Z",
      "location": {
        "latitude": 12.9716,
        "longitude": 77.5946,
        "distanceFromGeofence": 24,
        "verifiedWithinGeofence": true
      },
      "biometricVerified": true
    }
  },
  "geofence": {
    "officeName": "TrackZone Tech Hub (Bangalore HQ)",
    "distanceMeters": 24,
    "radiusMeters": 150
  }
}
```

**Response (403 Forbidden — Outside Geofence):**
```json
{
  "success": false,
  "code": "OUTSIDE_GEOFENCE",
  "message": "Attendance rejected: You are 1.85 km away from TrackZone Tech Hub (Bangalore HQ). You must be within 150m of the office premises.",
  "geofenceDetails": {
    "officeName": "TrackZone Tech Hub (Bangalore HQ)",
    "distanceMeters": 1850,
    "radiusMeters": 150,
    "differenceMeters": 1700
  }
}
```

---

### `POST /attendance/checkout`
Records check-out timestamp and computes total daily working hours.

**Request Body:**
```json
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "biometricVerified": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Checked out successfully! Logged 8.75 working hours.",
  "attendance": {
    "_id": "66c9f220e1b2c3d4e5f6a7c0",
    "workingHours": 8.75,
    "status": "Present"
  }
}
```

---

### `GET /attendance/today`
Returns the current day's punch status and active session info.

---

### `GET /attendance/history`
Returns paginated attendance records with optional date range query parameters (`startDate`, `endDate`, `status`, `page`, `limit`).

---

### `GET /attendance/monthly`
Returns monthly calendar records and aggregated totals (Total Present, Late, Half-day, Total Hours).

---

## 3. Geofence Management Endpoints

### `GET /geofence/active`
Public/Employee accessible list of all active geofenced facilities.

### `GET /geofence`
Admin list of all facilities with assigned staff count.

### `POST /geofence` (Admin)
Creates a new geofenced office zone.
```json
{
  "officeName": "TrackZone Austin Innovation Campus",
  "code": "ATX-03",
  "address": "200 Congress Ave, Downtown",
  "city": "Austin",
  "country": "USA",
  "latitude": 30.2672,
  "longitude": -97.7431,
  "radius": 150,
  "timezone": "America/Chicago"
}
```

### `PUT /geofence/:id` (Admin)
Updates facility coordinates, radius in meters, or address.

### `DELETE /geofence/:id` (Admin)
Deactivates or deletes a facility.

---

## 4. Admin Management & Analytics Endpoints

### `GET /admin/dashboard`
Returns live KPIs, 7-day attendance trend, department-wise stats, and today's check-in stream.

### `GET /admin/employees`
Paginated search and filtering of all staff directory records.

### `POST /admin/employees`
Admin provisions a new employee profile.

### `PUT /admin/attendance/:id/approve`
Overrides an attendance record or approves regularization with auditor remarks.

### `GET /admin/reports`
Aggregated monthly timesheet report for billing and HR payroll.

### `GET /admin/audit-logs`
Immutable system audit logs with categories (`AUTH`, `ATTENDANCE`, `GEOFENCE`, `EMPLOYEE`, `LEAVE`).

---

## 5. Leave Management Endpoints

### `POST /leaves/apply`
Employee submits time-off request with `leaveType`, `startDate`, `endDate`, `reason`.

### `GET /leaves/my`
Returns employee's leave balance and past applications.

### `GET /leaves/all` (Admin)
Returns all workforce leave applications.

### `PUT /leaves/:id/status` (Admin)
Approve or reject a leave application with comments.
```json
{
  "status": "Approved",
  "rejectionReason": ""
}
```
