# Notes App Backend

This is the backend for a simple notes application. It provides user authentication and CRUD (Create, Read, Update, Delete) operations for notes.

## Project Structure

```
notes-app-backend/
├── controllers/
│   ├── authController.js   # Handles user registration and login
│   └── notesController.js  # Handles CRUD operations for notes
├── middleware/
│   └── authMiddleware.js   # Protects routes that require authentication
├── models/
│   ├── db.js               # Database connection setup
│   ├── noteModel.js        # Defines the note schema
│   └── userModel.js        # Defines the user schema
├── routes/
│   ├── authRoutes.js       # Defines authentication endpoints
│   └── noteRoutes.js       # Defines note-related endpoints
├── .env.example            # Example environment variables
├── server.js               # Main server file
└── package.json            # Project dependencies and scripts
```

## Prerequisites

- Node.js
- A running MySQL database instance

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd notes-app-backend
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the root of the project and add the following environment variables. Replace the values with your database credentials.
    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=notes_app
    JWT_SECRET=your_jwt_secret
    PORT=5000
    ```
5.  Start the server:
    ```bash
    npm start
    ```
    Or for development with auto-reloading:
    ```bash
    npm run dev
    ```

## API Endpoints

### Authentication

-   **`POST /auth/register`**
    -   Registers a new user.
    -   **Request Body:** `{ "username": "testuser", "password": "password123" }`
    -   **Response:** `{ "message": "User registered successfully" }`

-   **`POST /auth/login`**
    -   Logs in an existing user.
    -   **Request Body:** `{ "username": "testuser", "password": "password123" }`
    -   **Response:** `{ "token": "your_jwt_token" }`

### Notes (Requires Authentication)

All notes endpoints require a valid JWT in the `Authorization` header: `Authorization: Bearer <token>`

-   **`GET /notes`**
    -   Fetches all notes for the authenticated user.

-   **`POST /notes`**
    -   Creates a new note.
    -   **Request Body:** `{ "title": "New Note", "content": "This is a new note." }`

-   **`PUT /notes/:id`**
    -   Updates an existing note by its ID.
    -   **Request Body:** `{ "title": "Updated Title", "content": "Updated content." }`

-   **`DELETE /notes/:id`**
    -   Deletes a note by its ID.

## Database Schema

### users table

-   `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
-   `username` (VARCHAR, UNIQUE, NOT NULL)
-   `password` (VARCHAR, NOT NULL)

### notes table

-   `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
-   `user_id` (INT, FOREIGN KEY REFERENCES users(id))
-   `title` (VARCHAR, NOT NULL)
-   `content` (TEXT, NOT NULL)
-   `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP) 