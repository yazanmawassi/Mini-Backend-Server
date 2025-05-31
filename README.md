# Simple User Authentication API

This is a basic Node.js and Express-based server for managing user signup, login via OTP (one-time password), and verification, using a JSON file as data storage.

##  Features

- User registration (`/signup`)
- Login with OTP code (`/login`)
- OTP verification (`/verify`)
- User blocking after 3 failed login attempts
- User listing (`/users`)
- All data is saved in `users.json`

##  Setup

1. Clone the repository or copy the files.
2. Make sure Node.js is installed.
3. Install dependencies:

   ```bash
   npm install express
