# Mock Mode Guide

The website is currently running in **Mock Mode** with sample data and no database connection required!

## 🚀 Quick Start

```bash
cd /Users/lmonaco/Development/image-gallery
npm run dev
```

Then visit:
- **Home Page**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin (authentication disabled in mock mode)

## ✨ What Works in Mock Mode

✅ Browse gallery with 8 sample images (using Unsplash photos)
✅ View image detail pages with metadata
✅ See related images functionality
✅ Navigate the full site (mobile and desktop)
✅ Access admin dashboard (no login required)
✅ View all admin tables and UI
✅ Preview the complete design and layout

## ⚠️ What Doesn't Work in Mock Mode

❌ Creating new images (shows alert)
❌ Updating existing images (shows alert)
❌ Deleting images (shows alert)
❌ Image upload functionality
❌ Authentication/login
❌ Data persistence

## 🔄 Switching to Database Mode

When you're ready to connect to your MySQL database:

### 1. Update Environment Variables

Edit both `.env` and `.env.local` files with your MySQL credentials:

```bash
DATABASE_URL="mysql://your_user:your_password@localhost:3306/owurkamu_simpleImages"
```

### 2. Setup Database

```bash
npx prisma db push
npx prisma generate
```

### 3. Uncomment Database Code

You need to uncomment the database code in these files:

**app/page.tsx** (lines 11-36):
- Comment out the mock data line
- Uncomment the Prisma query

**app/image/[id]/page.tsx** (lines 25-75):
- Comment out the mock data lines
- Uncomment the Prisma queries

**app/admin/layout.tsx** (lines 11-12):
- Uncomment `await requireAuth()` to enable authentication
- Remove the mock mode warning banner

**app/admin/page.tsx**:
- In `fetchImages()` (lines 18-34): Comment out mock data, uncomment API call
- In `handleCreate()` (lines 43-59): Comment out mock alert, uncomment API call
- In `handleUpdate()` (lines 68-84): Comment out mock alert, uncomment API call
- In `handleDelete()` (lines 94-107): Comment out mock alert, uncomment API call

### 4. Restart the Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## 📝 Mock Data Details

The mock data includes:
- 8 artwork images with full metadata
- Various mediums: Ink, Gouache, Acrylic, Pencil
- Different dimensions and styles
- One parent-child relationship (Valley Approach → Detail)
- Mix of available and sold pieces
- Featured artwork examples

All images are from Unsplash (royalty-free for preview purposes).

## 🎨 Customizing Mock Data

To add or modify mock images, edit:
```
lib/mock-data.ts
```

Add new objects to the `mockImages` array with these fields:
- `workId`: Unique number
- `workName`: Title
- `file`: Full image URL
- `thumbFile`: Thumbnail URL
- `dateCreated`: Date object
- `medium`: Art medium
- `dimensions`: Size string
- `comments`: Description
- `parent`: Parent image ID (0 for none)
- `isHidden`: 0 or 1
- `isAvailable`: true or false

## 🔍 Testing Features

### Public Gallery
1. View responsive grid on different screen sizes
2. Click any image to see detail page
3. Check related images (Image #2 has a related detail)
4. Browse "More from Gallery" thumbnails

### Admin Dashboard
1. Go to `/admin` (no login required in mock mode)
2. View table of all images
3. Click "Edit" to see the form
4. Click "Add New Image" to see create form
5. Try the checkboxes for visibility options

### Mobile Responsiveness
1. Resize browser to mobile width
2. Test hamburger menu
3. Check image grid adapts (1 → 4 columns)
4. Verify admin table is scrollable

## 💡 Tips

- Mock mode is perfect for design reviews and demos
- Show stakeholders the UI before database setup
- Test responsive design without data concerns
- Develop frontend features independently
- Great for development environments

## 🆘 Troubleshooting

**Port already in use?**
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Changes not showing?**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear Next.js cache: `rm -rf .next`

**Images not loading?**
- Mock mode uses Unsplash URLs - requires internet connection
- Check browser console for errors


