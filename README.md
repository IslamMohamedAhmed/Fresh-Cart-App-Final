# 🛒 Fresh Cart API

Fresh Cart is a **scalable E-Commerce RESTful API** built with **Node.js and modern backend architecture**.
The system handles authentication, product management, carts, orders, reviews, and payments while integrating external services for storage and email notifications.

---

# 🧱 System Architecture

```mermaid
flowchart TD

Client[Client / Frontend Applications] -->|HTTP Requests| API[Backend API Server]

API --> Auth[JWT Authentication]
API --> Validation[Validation Pipes / Middleware]

API --> UsersModule[Users Module]
API --> AuthModule[Authentication Module]
API --> ProductsModule[Products Module]
API --> CategoriesModule[Categories Module]
API --> CartModule[Cart Module]
API --> WishlistModule[Wishlist Module]
API --> OrdersModule[Orders Module]
API --> ReviewsModule[Reviews Module]
API --> CouponsModule[Coupons Module]

UsersModule --> UserService[User Service]
ProductsModule --> ProductService[Product Service]
CategoriesModule --> CategoryService[Category Service]
CartModule --> CartService[Cart Service]
OrdersModule --> OrderService[Order Service]

UserService --> DB[(MongoDB Database)]
ProductService --> DB
CategoryService --> DB
CartService --> DB
OrderService --> DB

API --> Cloudinary[(Cloudinary Storage)]
API --> MailService[Email Service - Nodemailer]
```

This diagram explains the **core backend architecture**, showing how requests flow from the **client to modules, services, and database**.

---

# 🔄 API Request Flow

```mermaid
sequenceDiagram

participant Client
participant API
participant Auth
participant Controller
participant Service
participant Database

Client->>API: HTTP Request
API->>Auth: Validate JWT Token
Auth-->>API: Authorized

API->>Controller: Route Request
Controller->>Service: Execute Business Logic
Service->>Database: Query / Save Data
Database-->>Service: Result

Service-->>Controller: Response Data
Controller-->>API: JSON Response
API-->>Client: Final Response
```

This flow describes how the system processes **incoming requests and responses**.

---

# 🛍️ E-Commerce User Flow

```mermaid
graph LR

User --> Register
User --> Login
User --> BrowseProducts
BrowseProducts --> ViewProduct

ViewProduct --> AddToCart
AddToCart --> UpdateCart
UpdateCart --> Checkout

Checkout --> CreateOrder
CreateOrder --> Payment
Payment --> OrderCompleted

User --> AddToWishlist
User --> LeaveReview
```

This diagram shows the **typical user journey** in the system.

---

# 📦 Project Structure

```mermaid
graph TD

Root --> src

src --> modules
modules --> auth
modules --> users
modules --> products
modules --> categories
modules --> cart
modules --> wishlist
modules --> orders
modules --> reviews
modules --> coupons

src --> config
src --> middleware
src --> database
src --> utils
src --> services
```

The project follows a **modular backend architecture** for scalability and maintainability.

---

# ⚙️ Tech Stack

### Backend

* Node.js
* Express.js / NestJS
* TypeScript

### Database

* MongoDB
* Mongoose ORM

### Authentication & Security

* JWT Authentication
* Bcrypt Password Hashing
* Authorization Guards

### File Handling

* Multer
* Cloudinary

### Email System

* Nodemailer

### Validation

* Class Validator
* Validation Pipes

---

# 🔐 Security Features

* Password hashing using **bcrypt**
* Secure authentication with **JWT**
* Role-based authorization
* Request validation
* Protected routes using guards and middleware

---

# 📡 API Documentation

Full API documentation is available via Postman:

https://documenter.getpostman.com/view/42697493/2sB3WsMywv

---

# 🚀 Key Features

* User Authentication & Authorization
* Product & Category Management
* Shopping Cart System
* Wishlist System
* Orders & Checkout
* Reviews & Ratings
* Coupons & Discounts
* Image Uploads (Cloudinary)
* Email Notifications

---

# 🎯 Purpose of the Project

This project demonstrates **real-world backend architecture for scalable E-commerce systems**, including:

* Modular system design
* REST API best practices
* Secure authentication
* Database relationships
* External service integrations

---

# 📬 Contact

If you have any questions or suggestions, feel free to reach out.
