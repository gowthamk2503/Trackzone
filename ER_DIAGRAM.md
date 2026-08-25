# 📊 TrackZone Database Schema & Architecture

## Overview
TrackZone utilizes MongoDB Document collections managed through Mongoose schemas, featuring indexes, compound unique constraints, and referential integrity.

---

## 1. Complete Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ ATTENDANCES : "records daily"
    USERS ||--o{ LEAVES : "submits"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ AUDIT_LOGS : "generates"
    GEOFENCES ||--o{ USERS : "assigned location"
    GEOFENCES ||--o{ ATTENDANCES : "validated perimeter"

    USERS {
        ObjectId _id PK
        String employeeId UK "Unique formatted TZ-XXXX"
        String name "Full Legal Name"
        String email UK "Corporate email (lowercase)"
        String phone "Contact number"
        String password "Hashed via bcrypt (10 rounds)"
        String department "Engineering, HR, Marketing..."
        String designation "Role Title"
        String role "admin | employee"
        String shiftSchedule "09:00 - 18:00"
        ObjectId officeId FK "References GEOFENCES"
        Boolean isActive "Default: true"
        Boolean biometricRegistered "Default: true"
        Date createdAt
        Date updatedAt
    }

    ATTENDANCES {
        ObjectId _id PK
        ObjectId employee FK "References USERS"
        String employeeId "Cached employee ID"
        String date "YYYY-MM-DD (Indexed)"
        Object checkIn "Timestamp, Coords, Distance, Biometric"
        Object checkOut "Timestamp, Coords, Hours, Biometric"
        Number workingHours "Calculated decimal hours"
        String status "Present | Late | Half-day | Absent | On Leave"
        ObjectId officeLocation FK "References GEOFENCES"
        String approvalStatus "Approved | Pending | Rejected"
        ObjectId approvedBy FK "References USERS"
        String remarks "Auditor or Regularize notes"
        Boolean regularizationRequested
        Date createdAt
        Date updatedAt
    }

    GEOFENCES {
        ObjectId _id PK
        String officeName "Official facility name"
        String code UK "Unique code e.g., BLR-HQ"
        String address "Physical Street Address"
        String city "City"
        String country "Country"
        Number latitude "Latitude decimal coordinate"
        Number longitude "Longitude decimal coordinate"
        Number radius "Allowed radius in meters"
        Boolean isActive "Default: true"
        String timezone "IANA Timezone string"
        String wifiSSID "Optional WiFi BSSID filter"
        Date createdAt
        Date updatedAt
    }

    LEAVES {
        ObjectId _id PK
        ObjectId employee FK "References USERS"
        String employeeId "Cached employee ID"
        String leaveType "Paid Leave | Sick Leave | Casual | Emergency"
        String startDate "YYYY-MM-DD"
        String endDate "YYYY-MM-DD"
        Number totalDays "Calculated calendar days"
        String reason "Explanation"
        String status "Pending | Approved | Rejected"
        ObjectId approvedBy FK "References USERS"
        String rejectionReason "Admin rejection rationale"
        Date appliedDate
        Date createdAt
        Date updatedAt
    }

    NOTIFICATIONS {
        ObjectId _id PK
        ObjectId user FK "References USERS (Indexed)"
        String title "Notification subject"
        String message "Detailed text"
        String type "attendance | leave | geofence | system | security"
        Boolean read "Default: false"
        Date createdAt
        Date updatedAt
    }

    AUDIT_LOGS {
        ObjectId _id PK
        ObjectId user FK "References USERS"
        String userName "Cached user name"
        String userRole "Cached user role"
        String action "Action verb e.g., CHECKIN_SUCCESS"
        String category "AUTH | ATTENDANCE | GEOFENCE | EMPLOYEE | LEAVE"
        String details "Full human-readable context"
        String ipAddress "Client IP address"
        String userAgent "Browser user agent"
        Date timestamp "Indexed timestamp"
    }

    HOLIDAYS {
        ObjectId _id PK
        String name "Holiday name"
        String date UK "YYYY-MM-DD"
        String dayOfWeek "Monday, Tuesday..."
        String description "Observance info"
        Boolean isOptional "Statutory vs Optional"
        Number year "2026"
    }
```
