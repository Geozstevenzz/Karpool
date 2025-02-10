# API Specification

## **3. Mode Switching API**
### **3.1 Switch User Mode**
**Endpoint:** `POST /api/switch-mode`  
**Description:** Allows a user to switch between Passenger and Driver mode. If switching to Driver mode for the first time, the user must complete vehicle registration.  

#### **Request Body**
```json
{
  "user_id": 1,
  "new_mode": "driver"
}
```

#### **Response**  
✅ **Success (200 OK) - Seamless Switch**
```json
{
  "message": "User mode switched successfully.",
  "current_mode": "driver"
}
```

✅ **Success (302 Found) - Requires Vehicle Registration**
```json
{
  "message": "User mode switched successfully. Please register vehicle details.",
  "redirect_to": "/register-vehicle"
}
```

❌ **Error Responses**  
- **400 Bad Request** – Invalid mode switch request  
- **404 Not Found** – User not found  
- **500 Internal Server Error** – Database/server error  

---

### **3.2 Driver Vehicle Registration (If Required)**
**Endpoint:** `POST /api/driver/register-vehicle`  
**Description:** Allows a newly switched driver to register their vehicle details.  

#### **Request Body**
```json
{
  "user_id": 1,
  "vehicle_name": "Honda Civic",
  "color": "Black",
  "model": "2021",
  "number_plate": "ABC-5678",
  "mileage": 12000
}
```

#### **Response**  
✅ **Success (201 Created)**
```json
{
  "vehicle": {
    "id": 102,
    "user_id": 1,
    "vehicle_name": "Honda Civic",
    "color": "Black",
    "model": "2021",
    "number_plate": "ABC-5678",
    "mileage": 12000
  },
  "message": "Vehicle registered successfully."
}
```

❌ **Error Responses**  
- **400 Bad Request** – Invalid vehicle details  
- **404 Not Found** – User not found  
- **500 Internal Server Error** – Database/server error  

---

After switching modes, if the user switches to Driver mode for the first time by pressing on the top-right icon, they must register their vehicle before proceeding.

