# Image Gallery Website

A modern, responsive image gallery website built with Next.js, featuring a public gallery view and password-protected admin interface for managing images.

## Features

- **Public Gallery**: Browse images in a responsive grid layout
- **Image Detail Pages**: View full-size images with metadata and related images
- **Admin Dashboard**: Full CRUD operations for managing images
- **Image Upload**: Upload images with automatic thumbnail generation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Password Protected**: Secure admin access with NextAuth.js

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Image Processing**: Sharp

## Prerequisites

- Node.js 18+ (Note: Next.js 16 requires Node 20+, but will run with warnings on Node 18)
- MySQL database

## Setup Instructions

### 1. Database Setup

1. Create a MySQL database (or use existing one)
2. Import the schema if you have existing data, or let Prisma create the tables

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="mysql://username:password@localhost:3306/your_database_name"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Admin Credentials
ADMIN_PASSWORD="your-admin-password"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Database Migration (if starting fresh)

```bash
npx prisma db push
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Public Gallery

- Visit the home page to browse all visible images
- Click on any image to view details, dimensions, and related images

### Admin Access

1. Navigate to `/admin/login`
2. Enter the admin password (set in `.env.local`)
3. Access the admin dashboard at `/admin`

### Admin Features

- **View All Images**: See all images including hidden ones
- **Add New Image**: Upload images with metadata
- **Edit Images**: Update titles, descriptions, dimensions, etc.
- **Delete Images**: Remove images from the gallery
- **Associate Images**: Link related images using the parent field
- **Visibility Controls**: Toggle hidden, featured, and availability flags

## Project Structure

```
image-gallery/
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin pages
│   ├── image/[id]/       # Image detail pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── admin/            # Admin components
│   ├── ImageGrid.tsx     # Gallery grid
│   ├── ImageDetail.tsx   # Detail view
│   └── Navigation.tsx    # Global nav
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Auth config
│   └── auth-utils.ts     # Auth helpers
├── prisma/
│   └── schema.prisma     # Database schema
└── public/
    └── gallery/          # Image storage
```

## Database Schema

The `work` table includes:

- `workId`: Unique identifier
- `workName`: Title of the artwork
- `file`: Path to the full-size image
- `thumbFile`: Path to the thumbnail
- `dateCreated`: Creation date
- `medium`: Medium (e.g., "Ink on Paper")
- `dimensions`: Size (e.g., "40 x 60")
- `comments`: Description
- `parent`: ID of parent image (for related images)
- `isHidden`: Hide from public gallery
- `isAvailable`: Available for purchase
- `isADefault`: Featured image
- `inTheHandsOf`: Current owner/location

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deployment Checklist

1. Update `NEXTAUTH_URL` in production environment
2. Generate a secure `NEXTAUTH_SECRET`
3. Ensure MySQL database is accessible
4. Set up file storage for `/public/gallery/`
5. Configure image optimization settings

## Responsive Design

The website is fully responsive with:

- Mobile-first approach
- Responsive grid layouts (1-4 columns based on screen size)
- Mobile navigation menu
- Touch-friendly interface
- Optimized images for all screen sizes

## License

Private project - All rights reserved
