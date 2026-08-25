# 🚀 TrackZone Production Deployment Guide

This guide outlines step-by-step production deployment for **TrackZone**:
- **Frontend** → Vercel
- **Backend** → Render / Railway
- **Database** → MongoDB Atlas

---

## 1. Database Setup: MongoDB Atlas

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (e.g. M0 Free Tier or Dedicated Cluster).
3. Under **Database Access**, create a database user:
   - Username: `trackzone_admin`
   - Password: `<SECURE_PASSWORD>`
   - Role: `Read and write to any database`
4. Under **Network Access**, add IP Access:
   - Allow access from anywhere (`0.0.0.0/0`) or specify Render IP ranges.
5. Click **Connect** → **Connect your application** → Copy the Connection String:
   ```
   mongodb+srv://trackzone_admin:<SECURE_PASSWORD>@cluster0.abcde.mongodb.net/trackzone?retryWrites=true&w=majority
   ```

---

## 2. Backend Deployment: Render

1. Log in to [Render](https://render.com) and click **New Web Service**.
2. Connect your GitHub repository and configure the service:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
3. Add the following **Environment Variables** in Render Dashboard:

| Variable Name | Example Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | `mongodb+srv://trackzone_admin:...@cluster.mongodb.net/trackzone` |
| `JWT_SECRET` | `<GENERATE_RANDOM_64_CHAR_HEX_STRING>` |
| `JWT_REFRESH_SECRET` | `<GENERATE_RANDOM_64_CHAR_HEX_STRING>` |
| `JWT_EXPIRES_IN` | `1d` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | `https://trackzone-app.vercel.app` |
| `DEFAULT_GEOFENCE_RADIUS` | `150` |

4. Deploy the service. Your backend API will be available at: `https://trackzone-backend.onrender.com`.

---

## 3. Frontend Deployment: Vercel

1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your TrackZone GitHub repository.
3. In the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Configure **Environment Variables** in Vercel:

| Variable Name | Value |
|---|---|
| `VITE_API_URL` | `https://trackzone-backend.onrender.com/api` |

5. Click **Deploy**. Vercel will build and publish your high-performance enterprise dashboard.

---

## 4. Post-Deployment Verification Checklist

- [ ] Verify health endpoint: `GET https://trackzone-backend.onrender.com/api/health` returns `{"status": "healthy"}`.
- [ ] Log in with default seed administrator account (`admin@trackzone.com` / `Admin@123`).
- [ ] Test real GPS location capture and ensure Leaflet maps render with HTTPS tile providers.
- [ ] Test WebAuthn fingerprint verification and complete a full check-in and check-out cycle.
- [ ] Export a test monthly timesheet report to PDF and Excel.
