# Scavenger Hunt Website

A modern web application for creating password-protected scavenger hunts with support for images and videos.

## Features

- Password-protected clues
- Support for both images (.png) and videos (.mp4)
- Modern yellow and black theme
- Responsive design
- Secure navigation (users can only access clues with correct passwords)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your clue media files:
   - Place your image files (.png) in the `public/clues` directory
   - Place your video files (.mp4) in the `public/clues` directory
   - Name your files according to the pattern: `clue1.png`, `clue2.mp4`, etc.

3. Configure passwords:
   - Open `src/components/Home.tsx`
   - Modify the `validPasswords` object to set your desired passwords
   - Example:
     ```typescript
     const validPasswords = {
       'your-password-1': '1',
       'your-password-2': '2',
       'your-password-3': '3',
     }
     ```

4. Configure clues:
   - Open `src/components/CluePage.tsx`
   - Modify the `clues` object to match your media files
   - Update titles and descriptions for each clue

5. Start the development server:
```bash
npm run dev
```

## Usage

1. Users enter passwords on the home page
2. Correct passwords unlock corresponding clues
3. Clues can be images or videos
4. Users can navigate back to the password entry page

## Security Notes

- This is a frontend-only implementation for demonstration purposes
- In a production environment, you should:
  - Store passwords securely on a backend server
  - Implement proper authentication
  - Use environment variables for sensitive data
  - Add rate limiting for password attempts
