# **Book Management System API**

## **Index**

1. [Project Overview](#project-overview)
   - [Key Features](#key-features)
   
2. [Technologies Used](#technologies-used)
   
3. [Installation Instructions](#installation-instructions)
   - [Prerequisites](#prerequisites)
   - [Steps to Install](#steps-to-install)
   
4. [API Endpoints](#api-endpoints)
   - [User Endpoints](#user-endpoints)
     - [POST `/api/users/register`](#post-apiusersregister)
     - [POST `/api/users/login`](#post-apiuserslogin)
   - [Book Endpoints](#book-endpoints)
     - [POST `/api/books/register`](#post-apibooksregister)
     - [PATCH `/api/books/:bookId`](#patch-apibooksbookid)
     - [GET `/api/books`](#get-apibooks)
     - [GET `/api/books/:bookId`](#get-apibooksbookid)
     - [DELETE `/api/books/:bookId`](#delete-apibooksbookid)
   
5. [Authentication](#authentication)
   - [JWT Token Authentication](#jwt-token-authentication)
   
6. [Error Handling](#error-handling)
   - [Common Errors](#common-errors)
   
7. [File Storage (Cloudinary)](#file-storage-cloudinary)
   
8. [Testing](#testing)
   - [Example Test Workflow](#example-test-workflow)
   
9. [Contributing](#contributing)
   
10. [Acknowledgments](#acknowledgments)
   
11. [Future Plans](#future-plans)


## **Project Overview**

The **Book Management System API** is a backend service built using **Node.js** and **Express.js** designed to manage books within a digital library. It provides essential functionality for user registration, authentication, and CRUD (Create, Read, Update, Delete) operations on books. Additionally, the system integrates with **Cloudinary** for efficient file management, allowing users to upload and manage book covers and book files (e.g., PDFs or ePubs).

### **Key Features**
- **User Authentication**: Secure user registration and login with **JWT tokens** for session management.
- **Book CRUD Operations**: Allows users to add, update, view, and delete books in the digital library.
- **Cloudinary Integration**: Supports file uploads (book covers and book files) using **Cloudinary**.
- **File Storage**: Book files (e.g., PDFs, ePubs) and cover images are securely stored and retrieved from Cloudinary.
- **JWT Token Authentication**: Protects sensitive routes by requiring users to authenticate via JWT tokens.
- **CORS Support**: Configured to allow API requests from a specified frontend domain for easier cross-origin requests.

---

## **Technologies Used**
- **Node.js**: A backend runtime environment to handle API requests efficiently.
- **Express.js**: A minimal web framework for building RESTful APIs in Node.js.
- **MongoDB**: A NoSQL database used to store user and book data.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB, providing a schema-based solution to model application data.
- **Cloudinary**: A cloud-based service for uploading and managing images and media files, integrated for storing book covers and files.
- **JWT (JSON Web Tokens)**: Secure token-based user authentication and session management.
- **Bcrypt.js**: A library for securely hashing passwords, ensuring password security during registration and login.
- **dotenv**: A library that loads environment variables from a `.env` file, allowing easy configuration of sensitive data.

---

## **Installation Instructions**

Follow these steps to set up and run the project locally.

### **Prerequisites**
Ensure that the following tools are installed before setting up the project:
- **Node.js** (v14.x or later)
- **MongoDB** (either locally or use a cloud-based service like MongoDB Atlas)
- **Cloudinary Account** (recommended for managing files and images)
- **Postman** or another API testing tool for testing API endpoints.

### **Steps to Install**

1. **Clone the Repository**

   Start by cloning the repository to your local machine:

   ```bash
   git clone https://github.com/ayush08032003/Elib-Backend-NodeJS.git
   cd Elib-Backend-NodeJS
   ```

2. **Install Dependencies**

   Install all required npm packages by running the following command:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root of the project and populate it with the following variables. Replace the placeholder values with your actual credentials (e.g., MongoDB connection details, Cloudinary credentials).

   ```env
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/book-management
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   FRONTEND_DOMAIN=http://localhost:3000
   ```

   - **PORT**: The port on which the server will run (default is `3000`).
   - **DATABASE_URL**: MongoDB connection string (e.g., `mongodb://localhost:27017/book-management` for local MongoDB or MongoDB Atlas URL for cloud).
   - **JWT_SECRET**: A secret string used for signing and verifying JWT tokens (keep this secure and complex).
   - **Cloudinary Credentials**: Your Cloudinary account details for uploading and managing media files.
   - **FRONTEND_DOMAIN**: The frontend domain that will interact with the API (use the correct URL for production or development).

4. **Start the Application**

   Once you've set up your environment variables, start the server with:

   ```bash
   npm run dev
   ```

   The API should now be running at `http://localhost:3000`.

---

## **API Endpoints**

### **User Endpoints**

#### **POST** `/api/users/register`
- **Description**: Register a new user by providing the user's name, email, and password. A JWT token is returned on successful registration.

- **Request Body**: 
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword"
  }
  ```

- **Response**: On success, returns a confirmation message and the JWT access token.

---

#### **POST** `/api/users/login`
- **Description**: Allows an existing user to log in by providing their email and password. Upon successful authentication, a JWT token is issued for session management.

- **Request Body**: 
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword"
  }
  ```

- **Response**: Returns a success message and the JWT access token.

---

### **Book Endpoints**

#### **POST** `/api/books/register`
- **Description**: Allows authenticated users to add a new book. Requires title, author, genre, description, book file, and cover image (uploaded to Cloudinary).

- **Request Body**: Multipart form data containing the following:
  - `coverImage` (image file)
  - `file` (book file)
  - `title` (string)
  - `genre` (string)
  - `description` (string)

- **Response**: Returns a confirmation message and details of the newly created book, including Cloudinary URLs for the cover image and file.

---

#### **PATCH** `/api/books/:bookId`
- **Description**: Allows authenticated users to update the details of an existing book by its ID. Users can update the title, author, genre, description, cover image, or file.

- **Request Body**: Multipart form data for optional updates to the book's properties.

- **Response**: Returns a confirmation message and the updated book information.

---

#### **GET** `/api/books`
- **Description**: Retrieves a list of all books in the system.

- **Response**: Returns an array of books with details like title, author, genre, and file URLs.

---

#### **GET** `/api/books/:bookId`
- **Description**: Retrieves detailed information about a specific book by its ID.

- **Response**: Returns detailed information about the specified book.

---

#### **DELETE** `/api/books/:bookId`
- **Description**: Deletes a book by its ID. Only authenticated users can delete books.

- **Response**: Returns a message confirming the deletion of the book.

---

## **Authentication**

The API uses **JWT tokens** for user authentication. After registering or logging in, you'll receive an `accessToken` in the response. To access protected routes (e.g., adding or editing books), include this token in the `Authorization` header of your requests like so:

```bash
Authorization: Bearer your_jwt_token
```

### Example with `curl`:
```bash
curl -X GET http://localhost:3000/api/books -H "Authorization: Bearer your_jwt_token"
```

---

## **Error Handling**

The application uses a global error handler to catch and respond to any errors during API requests. Errors are returned with an appropriate HTTP status code, and in the development environment, the stack trace is included for debugging.

### Common Errors:
- **401 Unauthorized**: Missing or invalid JWT token.
- **404 Not Found**: When a resource (user or book) cannot be found.
- **400 Bad Request**: Missing required fields in the request body or invalid data.

---

## **File Storage (Cloudinary)**

This API integrates with **Cloudinary** to store book cover images and book files securely. Cloudinary provides URLs for each uploaded file, which can be used for serving files or managing them.

You’ll need a **Cloudinary** account to enable this feature. Be sure to replace the `CLOUDINARY_*` environment variables in your `.env` file with your actual Cloudinary credentials.

---

## **Testing**

The project doesn't include automated tests by default. However, you can manually test the API using tools like **Postman** or **Insomnia**.

### Example Test Workflow:
1. **Register User**: Send a `POST` request to `/api/users/register` with user details.
2. **Login User**: After registration, send a `POST` request to `/api/users/login` to obtain the JWT token.
3. **Add Book**: Use the obtained JWT token to send a `POST` request to `/api/books/register` to add a book.

---

## **Contributing**

We welcome contributions to this project! To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to your forked repository (`git push origin feature-branch`).
5. Create a pull request with a detailed explanation of your changes.

Please ensure that your code adheres to the existing coding style.

---

## **Acknowledgments**

- **Cloudinary** for their robust file upload and management service.
- **Express.js** for being a lightweight framework for building REST APIs.
- **MongoDB** and **Mongoose** for flexible and efficient data modeling.

---

## **Future Plans**

- Implementing search functionality to allow users to search for books by title, author, or genre.
- Adding book recommendations based on user preferences or reading history.
- Introducing user roles for administrative privileges (e.g., book management).