# API Specification

## **5. Bookmark APIs**

### **5.1 Add Bookmark**
**Endpoint:** `POST /api/bookmarks`  
**Description:** Adds a location to the user's bookmark list.

#### **Request Body**
```json
{
  "user_id": 123,
  "location": "123 Main St, New York, NY"
}
```

#### **Response**
✅ **Success (201 Created)**
```json
{
  "message": "Bookmark added successfully."
}
```

❌ **Error Responses**
- **400 Bad Request** – Invalid request payload
- **409 Conflict** – Bookmark already exists
- **500 Internal Server Error** – Database/server error

---

### **5.2 Remove Bookmark**
**Endpoint:** `DELETE /api/bookmarks`  
**Description:** Removes a location from the user's bookmark list.

#### **Request Body**
```json
{
  "bookmark_id": 4
}
```

#### **Response**
✅ **Success (200 OK)**
```json
{
  "message": "Bookmark removed successfully."
}
```

❌ **Error Responses**
- **400 Bad Request** – Invalid request payload
- **404 Not Found** – Bookmark does not exist
- **500 Internal Server Error** – Database/server error

---

### **5.3 Get Bookmarks**
**Endpoint:** `GET /api/bookmarks`  
**Description:** Retrieves all bookmarks for a given user.

#### **Request Query Parameters**
| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| user_id   | int    | Yes      | User's unique ID   |

#### **Response**
✅ **Success (200 OK)**
```json
{
  "user_id": 123,
  "bookmarks": [
    "123 Main St, New York, NY",
    "456 Elm St, San Francisco, CA",
    "789 Maple Ave, Boston, MA"
  ]
}
```

❌ **Error Responses**
- **400 Bad Request** – Invalid user_id
- **404 Not Found** – No bookmarks found for user
- **500 Internal Server Error** – Database/server error

---

