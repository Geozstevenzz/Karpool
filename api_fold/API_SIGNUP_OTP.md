# API Specification

## **1. Authentication APIs**
### **1.1 Signup (Email & Password)**
**Endpoint:** `POST /api/signup`  
**Description:** Registers a new user using email and password.  

#### **Request Body**
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

#### **Response**  
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

### **1.2 Signup with Google**
**Endpoint:** `POST /api/signup/google`  
**Description:** Registers a user via Google OAuth.  

#### **Request Body**
```json
{
  "id_token": "google_id_token_here"
}
```

#### **Response**  
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

---

### **1.3 OTP Verification**
**Endpoint:** `POST /api/verify-otp`  
**Description:** Verifies the OTP sent to the user's phone or email and completes the signup process.  

#### **Request Body**
```json
{
  "email": "john@example.com",
  "phone": "+1234567890",
  "otp_code": "123456"
}
```

#### **Response**  
✅ **Success (200 OK)**
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
  "message": "OTP verified successfully. User registration complete."
}
```

❌ **Error Responses**  
- **400 Bad Request** – Invalid OTP or expired OTP  
- **404 Not Found** – User not found  
- **500 Internal Server Error** – Server/database error  

After successful OTP verification, the user is directed to the page where they choose whether they are a driver or passenger.

