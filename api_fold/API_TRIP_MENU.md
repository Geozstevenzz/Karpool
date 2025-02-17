# API Specification - View Trips

## **View Trips API**
### **1. Get Upcoming Trips**
**Endpoint:** `GET /api/trips/upcoming`
**Description:** Fetches all upcoming trips for the authenticated user (driver or passenger).

#### **Request Headers**
```json
{
  "Authorization": "Bearer user_token"
}
```

#### **Response**
✅ **Success (200 OK)**
```json
{
  "trips": [
    {
      "trip_id": 101,
      "role": "driver",
      "source": "123 Main St, New York, NY",
      "destination": "456 Elm St, Boston, MA",
      "date": "2025-02-15",
      "time": "10:00 AM",
      "status": "Scheduled"
    },
    {
      "trip_id": 102,
      "role": "passenger",
      "source": "456 Elm St, Boston, MA",
      "destination": "789 Oak St, Chicago, IL",
      "date": "2025-02-18",
      "time": "3:00 PM",
      "status": "Scheduled"
    }
  ]
}
```

❌ **Error Responses**
- **401 Unauthorized** – Missing or invalid token
- **500 Internal Server Error** – Database/server issue

---

### **2. Get Completed Trips**
**Endpoint:** `GET /api/trips/completed`
**Description:** Fetches all completed trips for the authenticated user (driver or passenger).

#### **Request Headers**
```json
{
  "Authorization": "Bearer user_token"
}
```

#### **Response**
✅ **Success (200 OK)**
```json
{
  "trips": [
    {
      "trip_id": 99,
      "role": "driver",
      "source": "123 Main St, New York, NY",
      "destination": "456 Elm St, Boston, MA",
      "date": "2025-01-10",
      "time": "12:00 PM",
      "status": "Completed"
    },
    {
      "trip_id": 98,
      "role": "passenger",
      "source": "456 Elm St, Boston, MA",
      "destination": "789 Oak St, Chicago, IL",
      "date": "2025-01-15",
      "time": "5:00 PM",
      "status": "Completed"
    }
  ]
}
```

❌ **Error Responses**
- **401 Unauthorized** – Missing or invalid token
- **500 Internal Server Error** – Database/server issue

