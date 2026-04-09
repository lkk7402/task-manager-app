# Personal Task Manager

A full-stack web application for managing daily tasks with user authentication.


## Features
- User Registration and Login
- Create, Read, Delete tasks
- Set task priority and deadline
- Responsive design
- Session-based authentication

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoDB Atlas)
- **Frontend**: EJS, CSS
- **Authentication**: Express Session + bcrypt
- **Other**: Method-Override, Dotenv

## How to Run Locally

```bash
# Clone the repository
git clone https://github.com/lkk7402/task-manager-app.git
cd task-manager-app

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Run the application
npm run dev
