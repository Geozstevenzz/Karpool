# API Specification

## **Driver Vehicle Registration**
**Endpoint:** `POST /api/driver/register-vehicle`  
**Description:** Allows a driver to register their vehicle details.  

#### **Request Body**
```json
{
  "user_id": 1,
  "vehicle_name": "Toyota Corolla",
  "color": "White",
  "model": "2022",
  "number_plate": "XYZ-1234",
  "mileage": 15000
}
```

#### **Response**  
✅ **Success (201 Created)**
```json
{
  "vehicle": {
    "id": 101,
    "user_id": 1,
    "vehicle_name": "Toyota Corolla",
    "color": "White",
    "model": "2022",
    "number_plate": "XYZ-1234",
    "mileage": 15000
  },
  "message": "Vehicle registered successfully."
}
```

❌ **Error Responses**  
- **400 Bad Request** – Invalid vehicle details  
- **404 Not Found** – User not found  
- **500 Internal Server Error** – Database/server error  



