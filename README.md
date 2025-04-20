# FileShare - Secure File Upload Platform

A modern file upload platform with robust user authentication and sharing features, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**

  - Email/password registration and login
  - Google authentication integration
  - Secure password validation using Zod

- **File Management**

  - Upload files with drag and drop support
  - View uploaded files in a responsive layout
  - Delete files when no longer needed

- **File Sharing**

  - Share files with other registered users
  - Set permissions (view, edit) for shared files
  - Manage shared file access

- **Modern User Interface**
  - Smooth animations with Framer Motion
  - Responsive design for all devices
  - Professional UI components

## Technology Stack

- **Frontend**

  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS 4
  - Framer Motion
  - React Hook Form with Zod validation

- **Authentication**
  - NextAuth.js for authentication
  - Google OAuth integration

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app` - Application pages and routes
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and validation schemas

## License

This project is licensed under the MIT License.
