# API Specification: Stop Trip

## **Endpoint: Stop Trip**

**Endpoint:** `PATCH /api/trips/stop`

**Description:** Marks a trip as "completed" by updating its status in the database.

### **Request Body**
```json
{
  "trip_id": 12345
}
```

### **Response**

✅ **Success (200 OK)**
```json
{
  "message": "Trip has ended successfully.",
  "trip": {
    "trip_id": 12345,
    "status": "completed"
  }
}
```

❌ **Error Responses**

- **400 Bad Request** – Missing or invalid `trip_id`
- **404 Not Found** – Trip not found
- **409 Conflict** – Trip already completed or not started
- **500 Internal Server Error** – Database/server error

### **Database Update**
- **Table:** `trips`
- **Column:** `status`
- **New Value:** `"completed"`

