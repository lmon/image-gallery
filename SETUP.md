# Quick Setup Guide

## Initial Setup

1. **Configure Environment Variables**
   
   Edit `.env.local` and update with your database credentials:
   ```
   DATABASE_URL="mysql://your_user:your_password@localhost:3306/owurkamu_simpleImages"
   NEXTAUTH_SECRET="generate-a-random-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ADMIN_PASSWORD="your-secure-admin-password"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Database**
   
   If you already have the database with data:
   ```bash
   npx prisma generate
   ```
   
   If starting fresh:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Public Gallery: http://localhost:3000
   - Admin Login: http://localhost:3000/admin/login
   - Use the password from `.env.local` to login

## Adding Your First Image

1. Go to http://localhost:3000/admin/login
2. Enter your admin password
3. Click "Add New Image"
4. Fill in the details:
   - Upload an image file
   - Enter title and description
   - Set dimensions and medium
   - Configure visibility options
5. Click "Create"

## Responsive Design Features

✅ Mobile-first design with Tailwind CSS
✅ Responsive grid: 1 column (mobile) → 4 columns (desktop)
✅ Mobile navigation with hamburger menu
✅ Touch-friendly admin interface
✅ Optimized images for all screen sizes
✅ Responsive forms and tables
✅ Smooth transitions and hover effects

## Admin Features

- **CRUD Operations**: Create, Read, Update, Delete images
- **Image Upload**: Automatic thumbnail generation
- **Image Association**: Link related images using parent field
- **Visibility Controls**:
  - Hidden: Hide from public gallery
  - Featured: Mark as featured/default
  - Available: Toggle availability status
- **Metadata Management**: Title, dates, dimensions, medium, description
- **Owner Tracking**: Track current location or owner

## File Structure

```
/public/gallery/art/     # Uploaded images stored here
/app/                    # Next.js App Router pages
/components/             # React components
/lib/                    # Utilities and configs
/prisma/                 # Database schema
```

## Database Schema

The `work` table matches your existing schema with fields for:
- Image metadata (title, dates, dimensions, medium)
- File paths (main image and thumbnail)
- Relationships (parent field for related images)
- Visibility flags (hidden, featured, available)
- Ownership tracking

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

3. Update environment variables for production:
   - Set `NEXTAUTH_URL` to your production domain
   - Use a secure `NEXTAUTH_SECRET`
   - Ensure database is accessible from production

## Troubleshooting

**Database Connection Error**
- Verify DATABASE_URL in `.env.local`
- Ensure MySQL is running
- Check database credentials

**Image Upload Not Working**
- Check `/public/gallery/art/` directory exists
- Verify write permissions
- Ensure Sharp is installed correctly

**Admin Login Not Working**
- Verify ADMIN_PASSWORD in `.env.local`
- Clear browser cookies
- Check NextAuth configuration

## Tech Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

