# API Specification

## **4. Review APIs**

### **4.1 Submit Review**
**Endpoint:** `POST /api/reviews`

**Description:** Submits a review for a trip, either from the driver to the passenger or from the passenger to the driver.

#### **Request Body**
```json
{
  "review_id": 101,
  "trip_id": 45,
  "driver_id": 12,
  "passenger_id": 34,
  "review_from": "driver",
  "review_for": "passenger",
  "rating": 5,
  "review": "Great passenger, smooth ride!"
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
- **400 Bad Request** – Invalid request payload (e.g., missing required fields, invalid rating value)
- **404 Not Found** – Trip, driver, or passenger not found
- **500 Internal Server Error** – Database/server error

### **4.2 Get Reviews for a User**
**Endpoint:** `GET /api/reviews/:user_id`

**Description:** Retrieves all reviews written for a specific user (driver or passenger).

#### **Response**
✅ **Success (200 OK)**
```json
{
  "user_id": 34,
  "reviews": [
    {
      "review_id": 101,
      "trip_id": 45,
      "review_from": "driver",
      "rating": 5,
      "review": "Great passenger, smooth ride!"
    },
    {
      "review_id": 102,
      "trip_id": 46,
      "review_from": "driver",
      "rating": 4,
      "review": "Polite but was a bit late."
    }
  ]
}
```

❌ **Error Responses**
- **404 Not Found** – User not found
- **500 Internal Server Error** – Database/server error
