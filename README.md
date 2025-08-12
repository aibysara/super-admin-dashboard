# Super Admin Dashboard with User Access Control

## Overview

This project is a web application built with **React** (frontend) and **Django REST Framework** (backend). It provides a Super Admin Dashboard to manage users, assign page-level permissions, and control access dynamically.

---

## Features

### Authentication
- JWT-based authentication with access and refresh tokens.
- Separate login for Super Admin and Regular Users.
- Password recovery with OTP verification.

### User Management
- Super Admin can create users with email and auto-generated strong passwords.
- CRUD operations on users and their page-specific permissions.


### Access Control & Permissions
- Super Admin assigns View, Edit, Create, Delete permissions on 10 predefined pages.
- Dynamic display of user-role table showing user permissions.
- Right-side panel to add new users and edit user permissions.

### Content Management (Comments)
- Comments on each page with CRUD operations based on permissions.
- View and edit comment history for Super Admin.

---

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Bootstrap (or CSS framework you used)
- **Backend:** Django REST Framework, JWT Authentication, SQLite (or your DB)
- **Tools:** Vite (frontend build), Postman (API testing)

---

## Setup Instructions

### Backend

1. Create and activate a Python virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # Linux/Mac
   env\Scripts\activate     # Windows
2. Install backend dependencies:

pip install -r requirements.txt
3. Run migrations:

 python manage.py migrate
4. Run the Django development server:


python manage.py runserver
### Frontend
1. Navigate to the frontend folder:


cd frontend
2. Install dependencies:


npm install
3. Run the React development server:

npm run dev
4. Open your browser and go to http://localhost:5173

### Features Breakdown
Visit the Home page and select either Super Admin Login or User Login

Super admin can create new users with email and auto-generated password via the right-side panel

Edit and delete user permissions dynamically from the dashboard

Users have restricted access based on their assigned permissions (View/Edit/Create/Delete on specific pages)


### Challenges Faced & Solutions
Handling complex permissions structure: Implemented a UserPagePermission model with unique constraints per user and page.

Checkbox states for multiple permissions: Carefully managed state updates for nested permissions in React.

Password auto-generation and secure hashing: Used Django's make_password for secure password storage.

### Users and Passwords

### SuperAdmin

username : Aiby
password : aiby1234

### User

username : Aibyblesson
password : bles1234