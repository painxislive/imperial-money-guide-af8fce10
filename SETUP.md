# ImperialPedia Setup Guide

## Database Setup Complete ✅

The following database tables have been created with proper RLS policies:

### Tables Created:
- **profiles**: User profile information (auto-created on signup)
- **saved_scenarios**: Saved calculator results for each user
- **bookmarks**: User bookmarked articles/content

### RLS Policies:
- Users can only access their own data
- Profile data is viewable by all users but editable only by owner
- Scenarios and bookmarks are completely private to each user

## Authentication Features ✅

- **Email/Password authentication** via Supabase
- **Google OAuth** support (requires configuration)
- **Auto profile creation** on user signup
- **Protected routes** (Dashboard requires login)
- **Session persistence** across browser refreshes

## Dashboard Features ✅

- **Saved Scenarios**: View, load, and delete saved calculator results
- **Bookmarks**: Manage bookmarked articles (placeholder for content system)
- **Statistics**: User activity overview
- **PDF Export**: Placeholder functionality for scenario reports

## Calculator Integration ✅

- **Save Scenario**: Added to RepoCalculator (example implementation)
- **Authentication Required**: Users must sign in to save scenarios
- **Input/Output Storage**: Complete calculation state preserved

## Next Steps

### 1. Configure Google OAuth (Optional)
To enable Google sign-in:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add your domain to authorized origins
4. Add the credentials in Supabase Auth settings

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

### 3. Add Market Data APIs (Optional)
For live market data in calculators:
- Alpha Vantage API key for stock/forex data
- FRED API key for economic indicators

### 4. Content Management
To add articles and content:
- Create a `content` table in Supabase
- Implement article CRUD operations
- Connect bookmarks to actual content

### 5. PDF Export Implementation
The PDF export is currently a placeholder. To implement:
- Use libraries like jsPDF or PDFKit
- Create a serverless function for PDF generation
- Store generated PDFs in Supabase Storage

## Testing the Implementation

1. **Sign up** for a new account at `/signup`
2. **Use calculators** and save scenarios
3. **View saved scenarios** in the dashboard at `/dashboard`
4. **Test authentication** flows (login/logout)

## Available Routes

- `/` - Homepage
- `/login` - Sign in page
- `/signup` - Registration page
- `/dashboard` - User dashboard (protected)
- `/articles` - Articles listing
- `/tools` - Calculator tools
- `/hidden-tools` - Advanced financial tools

## Security Notes

- All user data is protected by Row Level Security (RLS)
- Authentication tokens are managed by Supabase
- No sensitive data is exposed to unauthorized users
- Environment variables should be properly configured in production

## Support

For issues or questions about the authentication and dashboard implementation, check:
- Supabase dashboard for database logs
- Browser console for client-side errors
- Network tab for API request failures