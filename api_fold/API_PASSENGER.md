
# Passenger API Specification

## **2. Passenger Mode APIs**

### **2.1 Search for Trips**
**Endpoint:** `POST /api/passenger/search-trips`  
**Description:** Allows a passenger to search for available trips based on source, destination, date, and time.

#### **Request Body**
```json
{
  "source": "New York, NY",
  "destination": "Boston, MA",
  "date": "2025-03-15",
  "time": "08:00 AM"
}
```

#### **Response**  
✅ **Success (200 OK)**
```json
{
  "trips": [
    {
      "trip_id": 101,
      "driver_id": 5,
      "driver_name": "Alice Smith",
      "source": "New York, NY",
      "destination": "Boston, MA",
      "date": "2025-03-15",
      "time": "08:00 AM"
    }
  ]
}
```

❌ **Error Responses**  
- **404 Not Found** – No trips available matching the criteria  
- **500 Internal Server Error** – Database error  

---

### **2.2 View Trip Details**
**Endpoint:** `GET /api/passenger/trip/{trip_id}`  
**Description:** Fetches the full details of a selected trip.  

#### **Response**  
✅ **Success (200 OK)**
```json
{
  "trip_id": 101,
  "driver_id": 5,
  "driver_name": "Alice Smith",
  "vehicle": "Toyota Prius",
  "source": "New York, NY",
  "destination": "Boston, MA",
  "date": "2025-03-15",
  "time": "08:00 AM",
  "available_seats": 3
}
```

---

### **2.3 Request Trip**
**Endpoint:** `POST /api/passenger/request-trip`  
**Description:** Sends a trip request to the driver.  

#### **Request Body**
```json
{
  "trip_id": 101,
  "passenger_id": 12
}
```

#### **Response**  
✅ **Success (201 Created)**
```json
{
  "message": "Trip request sent to driver."
}
```

---

### **2.4 Contact Driver**
**Endpoint:** `POST /api/passenger/contact-driver`  
**Description:** Allows a passenger to contact a driver via message or call.  

#### **Request Body**
```json
{
  "trip_id": 101,
  "passenger_id": 12,
  "message": "Hello, is there still an available seat?"
}
```

#### **Response**  
✅ **Success (200 OK)**
```json
{
  "message": "Message sent to driver."
}
```

---

### **2.5 Rate & Review Driver**
**Endpoint:** `POST /api/passenger/rate-driver`  
**Description:** Allows the passenger to rate and review the driver after the trip ends.  

#### **Request Body**
```json
{
  "trip_id": 101,
  "passenger_id": 12,
  "rating": 5,
  "review": "Great experience! Very professional driver."
}
```

#### **Response**  
✅ **Success (201 Created)**
```json
{
  "message": "Review submitted successfully."
}
```

❌ **Error Responses**  
- **400 Bad Request** – Invalid rating input  
- **500 Internal Server Error** – Database error  

---

