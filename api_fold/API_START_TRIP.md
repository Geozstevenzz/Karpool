# API Specification: Start Trip

## **Endpoint: Start Trip**

**Endpoint:** `PATCH /api/trips/start`

**Description:** Marks a trip as "ongoing" by updating its status in the database.

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
  "message": "Trip has started successfully.",
  "trip": {
    "trip_id": 12345,
    "status": "ongoing"
  }
}
```

❌ **Error Responses**

- **400 Bad Request** – Missing or invalid `trip_id`
- **404 Not Found** – Trip not found
- **409 Conflict** – Trip already started or completed
- **500 Internal Server Error** – Database/server error

### **Database Update**
- **Table:** `trips`
- **Column:** `status`
- **New Value:** `"ongoing"`
