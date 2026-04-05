# Finance Dashboard API

This is the backend REST API for a Role-Based Finance Dashboard system. It is built natively using **Node.js, Express, and MongoDB**, providing full capabilities for managing users, robust authentication, and maintaining financial records.

## Features

- **JWT Authentication**: Secure user registration and login workflows.
- **Role-Based Access Control (RBAC)**: Users can have `Viewer`, `Analyst`, or `Admin` privileges, each restricting visibility and modifying capabilities on specific routes.
- **Financial Records CRUD**: Manage income and expense entries with categorisation and date-tracking.
- **Pagination & Filtering**: Efficiently load records by specifying page counts, limit sizes, dates, and query parameters.
- **Aggregated Analytics**: Sophisticated dashboard endpoints using MongoDB Aggregation streams to supply metrics on net balance, running trends, and category distribution.
- **Swagger Documentation**: Self-hosted and beautifully presented API testing interface.

---


## 📂 Project Structure

```text
Backend/
├── controllers/          # Business logic handlers
│   ├── authController.js       # Handles Registration and Login
│   ├── dashboardController.js  # Aggregates analytical insights
│   ├── recordController.js     # Manages Financial CRUD ops
│   └── userController.js       # Manages Admin-level user adjustments
├── middleware/           # Interceptors for routes
│   ├── auth.js                 # Verifies inbound Bearer JWT headers
│   └── roleGuard.js            # Enforces Admin/Analyst/Viewer hierarchies
├── models/               # Mongoose DB Schemas
│   ├── Record.js
│   └── User.js
├── routes/               # Express endpoint routing
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── recordRoutes.js
│   └── userRoutes.js
├── index.js              # Application Entry Point
├── package.json          # Node config & dependencies
└── swagger.json          # OpenAPI specifications
```

---

## 🛣️ API Routes Walkthrough

You can explore and test all APIs interactively by visiting the **Swagger UI Dashboard** at `http://localhost:5000/api-docs` when the server is running. 

> **Important Auth Note**: With the exception of `/register` and `/login`, all routes require a JWT token in the `Authorization` header (`Bearer <token>`).

### Authentication (`/api/auth`)
- `POST /register`: Create a new user. Pass `role: "Admin"` for total privileges.
- `POST /login`: Receives an `email` and `password`, returns a JWT.

### User Management (`/api/users`) — _Admin Only_
- `GET /`: Retrieve a list of all registered users.
- `PUT /:id/role`: Change a user's role (Viewer/Analyst/Admin).
- `PUT /:id/status`: Deactivate or reactivate user accounts.

### Financial Records (`/api/records`)
- `GET /`: Get all records. Supports paginations (`?page=1&limit=10`) and filtering (`?type=income&startDate=...`). *(Role: All Authenticated)*
- `GET /:id`: View a specific record. *(Role: All Authenticated)*
- `POST /`: Create a new financial log. *(Role: Admin)*
- `PUT /:id`: Update fields on a previous entry. *(Role: Admin)*
- `DELETE /:id`: Delete a financial record. *(Role: Admin)*

### Dashboard Summaries (`/api/dashboard`)
- `GET /summary`: Get a high-level statistical overview, returning total incomes, net balance matrices, category pie-chart data, and a 6-month timeline graph aggregation. *(Role: All Authenticated)*
