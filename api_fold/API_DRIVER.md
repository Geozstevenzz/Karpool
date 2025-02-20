
# Driver Mode API Specification

## **2. Driver APIs**
### **2.1 Create a Trip**
**Endpoint:** `POST /api/trips`
**Description:** Creates a new trip for a driver.

#### **Request Body**
```json
{
  "driver_id": 1,
  "source": 24.3756, 31.456778,
  "destination": 32.45678, 33. 78965,
  "date": ["2025-02-15"],
  "time": "08:30 AM",
  "available_seats": 3
}
```

#### **Response**
✅ **Success (201 Created)**

#### **Database Storage**
```json
{
  "trip_id": 101,
  "driver_id": 1,
  "source": 24.3756, 31.456778,
  "destination": 32.45678, 33. 78965,
  "date": ["2025-02-15"],
  "time": "08:30 AM",
  "available_seats": 3,
  "message": "Trip created successfully."
}
```

---

### **2.2 Edit a Trip**
**Endpoint:** `PUT /api/trips/{trip_id}`
**Description:** Updates an existing trip.

#### **Request Body**
```json
{
  "source": 22.3756, 31.456778,
  "destination": 30.3756, 31.456778,
  "date": ["2025-02-16", "2025-02-17"],
  "time": "09:00 AM",
  "available_seats": 2
}
```

#### **Response**
✅ **Success (200 OK)**

```json
{
  "message": "Trip updated successfully!"
}
```

#### **Database Storage**
```json
{
  "trip_id": 101,
  "source": 22.3756, 31.456778,
  "destination": 30.3756, 31.456778,
  "date": ["2025-02-16", "2025-02-17"],
  "time": "09:00 AM",
  "available_seats": 2
}
```

---

### **2.3 Delete a Trip**
**Endpoint:** `DELETE /api/trips/{trip_id}`
**Description:** Deletes an existing trip.

#### **Response**
✅ **Success (200 OK)**

```json
{
  "message": "Trip deleted successfully!"
}
```

---

### **2.4 Accept Passenger Request**
**Endpoint:** `POST /api/trips/{trip_id}/accept`
**Description:** Allows the driver to accept a passenger request.

#### **Request Body**
```json
{
  "passenger_id": 5
}
```

#### **Response**
✅ **Success (200 OK)**
```json
{
  "message": "Passenger request accepted!"
}
```

---

### **2.5 Start Trip**
**Endpoint:** `POST /api/trips/{trip_id}/start`
**Description:** Marks the trip as started.

#### **Response**
✅ **Success (200 OK)**
```json
{
  "message": "Trip started successfully!"
}
```

---

### **2.6 End Trip & Confirm Payment**
**Endpoint:** `POST /api/trips/{trip_id}/end`
**Description:** Marks the trip as completed and confirms payment.

#### **Request Body**
```json
{
  "payment_confirmed": true
}
```

#### **Response**
✅ **Success (200 OK)**
```json
{
  "message": "Trip ended and payment confirmed!"
}
```

---

### **2.7 Rate & Review Passenger**
**Endpoint:** `POST /api/trips/{trip_id}/rate`
**Description:** Allows the driver to rate and review a passenger.

#### **Request Body**
```json
{
  "passenger_id": 5,
  "rating": 4,
  "review": "Great passenger, timely and respectful."
}
```

#### **Response**
✅ **Success (200 OK)**
```json
{
  "message": "Review submitted successfully!"
}
```

#### **Database Storage**
```json
{
  "review_id": 1,
  "passenger_id": 5,
  "rating": 4,
  "review": "Great passenger, timely and respectful."
}
```

---

