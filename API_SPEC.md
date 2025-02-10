# API Specification

## **1. Signup with Email & Password**
**Endpoint:** `POST /api/signup`  
**Description:** Registers a new user using email and password.  

### **Request Body**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "address": "123 Main St, New York, NY",
  "password": "securepassword",
  "confirm_password": "securepassword"
}
```

### **Response**  
✅ **Success (201 Created)**
```json
{
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, New York, NY"
  },
  "message": "User registered successfully. Proceed to OTP verification."
}
```

❌ **Error Responses**  
- **400 Bad Request** – Validation error (e.g., passwords don’t match, invalid phone/email)  
- **409 Conflict** – Email or phone number already exists  
- **500 Internal Server Error** – Database/server error  

---

## **2. Signup with Google**
**Endpoint:** `POST /api/signup/google`  
**Description:** Registers a user via Google OAuth.  

### **Request Body**
```json
{
  "id_token": "google_id_token_here"
}
```

### **Response**  
✅ **Success (201 Created)**
```json
{
  "user": {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "phone": null,
    "address": null
  },
  "message": "User registered via Google successfully."
}
```

❌ **Error Responses**  
- **401 Unauthorized** – Invalid Google token  
- **409 Conflict** – Google account already linked to an existing email  
- **500 Internal Server Error** – OAuth verification failure  

