### SCREENSHOT 
<img width="1889" height="898" alt="image" src="https://github.com/user-attachments/assets/81388198-5bed-439d-9ad9-971a7461dddc" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/18b4403b-8b34-41cd-8136-b4f3d16d676e" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/0d57a6cd-4608-453f-955d-f6d1686e2de4" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/cfc9232e-0695-46f6-b9f5-18ff3102bb0e" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/577eeba9-d489-4fdd-ab70-22ea7a8d225e" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/65390023-5dca-4304-b749-c7698641bea7" />


# Notes Application Features

## User Features

A standard user has access to a personal dashboard to manage their own notes.

### 1. Authentication
- **Register:** New users can create an account.
- **Login:** Securely log in to access their personal dashboard.
- **Logout:** End their session and log out from the application.

### 2. Note Management (CRUD)
- **Create Notes:** Users can create new notes, providing a title, content, and category.
- **Read Notes:** View a list of all their created notes on the dashboard.
- **Update Notes:** Edit the title, content, and category of their existing notes.
- **Delete Notes:** Permanently remove notes they no longer need.

### 3. Productivity
- **Search:** Find specific notes by searching through titles and content.
- **Filter:** Filter their notes by category to easily organize and find what they're looking for.

## Admin Features

An administrator has elevated privileges to oversee the entire application and all its users.

### 1. Authentication
- **Login:** Log in using special admin credentials.
- **Logout:** Securely log out from the admin panel.

### 2. Global Oversight
- **View All Users:** Access a list of all registered users in the system.
- **View All Notes:** View all notes created by every user in the application.
- **(Implied) User Management:** Admins have the capability to manage users, which could include viewing details or removing users.

### 3. Analytics Dashboard
- **View Statistics:** Access a dashboard with key statistics, such as the total number of registered users and the total number of notes created across the platform.

### 4. Profile Management
- **Admin Profile:** View and manage their own admin profile information.


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
    git clone https://github.com/rohan-gouda27/Notes-Application.git
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


