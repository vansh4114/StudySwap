# StudySwap — Student-to-Student Academic Resource Sharing Platform

StudySwap is a full-stack MERN application built for college students to share, discover, rate, bookmark, and moderate academic study resources (lecture notes, question papers, syllabus guides, and reference material).

---

## 🚀 Key Features

### 🎓 Student Features
- **Authentication & Profiles**: Secure JWT authentication with BCrypt password hashing, college/course profile management, and gamified contribution points.
- **Resource Repository**: Upload PDF and document study materials stored securely on Cloudinary.
- **Search & Filtering**: Search resources by title, subject, semester, course, university, or tags.
- **Interactions**: Rate resources (1-5 stars), bookmark items for quick access, and track download/view counts.
- **Content Reporting**: Submit abuse or quality flag reports to platform administrators.

### 🛡️ Admin & Moderation Panel (`/admin`)
- **CLI Admin Promotion**: Promote users to `ADMIN` role via secure command line script `node server/scripts/makeAdmin.js <user-email>`. (No public promote endpoint).
- **Dashboard Overview**: Track total users, total resources, pending resource approvals, and pending user reports.
- **Resource Moderation Queue**: Approve, reject, or set pending status for study materials.
- **User Reports Queue**: Review reported content, resolve reports, or dismiss reports.
- **Admin Resource Deletion**: Permanently remove resources with Cloudinary file deletion and cascading MongoDB cleanup (ratings, bookmarks, reports).
- **User Directory**: View student information, role, and contribution points.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, Vite, React Router v7, Tailwind CSS v4, Lucide React Icons.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose v9).
- **Storage**: Cloudinary API (with Multer memory storage).
- **Security**: Helmet headers, Express Rate Limiter, CORS, JWT Authorization, BCryptJS, Zod request validation.

---

## 💻 Setup & Installation Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB server running locally (`mongodb://localhost:27017/studyswap`) or a MongoDB Atlas URI.
- Cloudinary account credentials.

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside `server/`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/studyswap
   JWT_SECRET=your_jwt_secret_key_here

   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start Vite development server:
   ```bash
   npm run dev
   ```

---

## 🔐 Admin CLI Usage

To promote an existing registered user to an `ADMIN` role, execute the following CLI command from the `server` directory:

```bash
node scripts/makeAdmin.js student@example.com
```

> **Note**: This CLI script directly updates the user's role in the database. There is no public HTTP endpoint to elevate user roles.

---

## 📡 API Overview

### Auth Endpoints (`/api/auth`)
- `POST /api/auth/register` — Register a new student account (+20 contribution points)
- `POST /api/auth/login` — Authenticate student and retrieve JWT token
- `GET /api/auth/me` — Get current user profile (Protected)

### Resource Endpoints (`/api/resources`)
- `GET /api/resources` — List & search resources (Public)
- `GET /api/resources/:id` — Get single resource details & increment view count (Public)
- `POST /api/resources` — Upload a study resource file to Cloudinary (+10 contribution points, Protected)
- `GET /api/resources/:id/download` — Get download URL & increment download count (Public)
- `POST /api/resources/:id/rating` — Add or update rating (Protected)
- `DELETE /api/resources/:id/rating` — Delete user rating (Protected)
- `POST /api/resources/:id/bookmark` — Save resource to user bookmarks (Protected)
- `DELETE /api/resources/:id/bookmark` — Remove resource from bookmarks (Protected)
- `POST /api/resources/:id/report` — Flag resource for moderation (Protected)
- `DELETE /api/resources/:id` — Delete resource (Owner or Admin only)

### User Endpoints (`/api/users`)
- `GET /api/users/profile` — Get authenticated user profile & uploaded resources (Protected)
- `PUT /api/users/profile` — Update user profile details (Protected)
- `GET /api/users/bookmarks` — List bookmarked resources (Protected)

### Admin Endpoints (`/api/admin`) — *Requires `ADMIN` role*
- `GET /api/admin/stats` — Platform metrics & pending counts
- `GET /api/admin/resources` — List resources with pagination and status filters (`APPROVED`, `PENDING`, `REJECTED`)
- `PATCH /api/admin/resources/:id/status` — Moderate resource approval status
- `DELETE /api/admin/resources/:id` — Admin permanent resource deletion & cascade cleanup
- `GET /api/admin/reports` — List user content reports with status filters
- `PATCH /api/admin/reports/:id/status` — Update report status (`RESOLVED`, `DISMISSED`, `PENDING`)
- `GET /api/admin/users` — List student directory & contribution points

---

## 🧪 Testing & Verification

### Running Backend & Security Tests
Run the automated test suite covering authentication, role authorization, resource/report moderation, cascade cleanup, and ObjectId validation:

```bash
cd server
node scripts/testAdmin.js
```

### Production Build Verification
Test the client application production bundle:

```bash
cd client
npm run build
```

---

## 🔒 Security Measures

- **Authentication Boundary**: Server routes enforce `protect` (JWT verification) and `authorize('ADMIN')` middlewares. Frontend route protection (`AdminRoute.jsx`) serves as UI boundary only.
- **Input Validation**: All IDs checked with `mongoose.Types.ObjectId.isValid()`. Payloads validated via Zod schemas and strict type checks.
- **File Safety**: File uploads filtered by MIME type and size prior to Cloudinary upload.
- **HTTP Security**: `helmet` security headers enabled, strict CORS configuration, and IP rate limiting on `/api` routes.
