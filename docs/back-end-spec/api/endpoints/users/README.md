# **Users API Endpoints**

**Domain:** [Users](../../domains/users.md)

**Base Path:** `/api/users`

---

## **Endpoint Index**

### **Users CRUD**

| Method | Path | Description |
|--------|------|-------------|
| GET | [`/api/users`](./list.md) | List users with search and filters |
| POST | [`/api/users`](./create.md) | Create new user (admin only) |
| GET | [`/api/users/{id}`](./get.md) | Get single user profile |
| PATCH | [`/api/users/{id}`](./update.md) | Update user profile |
| DELETE | [`/api/users/{id}`](./delete.md) | Delete user (admin only) |

### **Following**

| Method | Path | Description |
|--------|------|-------------|
| GET | [`/api/users/{id}/following`](./get-following.md) | Get users this user follows |
| GET | [`/api/users/{id}/followers`](./get-followers.md) | Get user's followers |
| POST | [`/api/users/{id}/follows/{followeeId}`](./follow.md) | Follow a user |
| DELETE | [`/api/users/{id}/unfollows/{followeeId}`](./unfollow.md) | Unfollow a user |

### **Connections**

| Method | Path | Description |
|--------|------|-------------|
| GET | [`/api/users/{id}/connections`](./get-connections.md) | Get user's connections |
| POST | [`/api/users/{id}/connection-requests/{recipientId}`](./send-connection-request.md) | Send connection request |
| GET | [`/api/users/{id}/connection-requests/received`](./get-received-requests.md) | Get received requests |
| GET | [`/api/users/{id}/connection-requests/sent`](./get-sent-requests.md) | Get sent requests |
| POST | [`/api/users/connection-requests/{requestId}/accept`](./accept-connection.md) | Accept connection request |
| POST | [`/api/users/connection-requests/{requestId}/decline`](./decline-connection.md) | Decline connection request |
| DELETE | [`/api/users/{id}/connections/{connectionId}`](./remove-connection.md) | Remove connection |

---

## **Common Patterns**

### **User ID Parameter**

All endpoints using `{id}` accept:
* Numeric ID: `123`
* String ID: `"123"`

### **Authentication**

All endpoints require authentication via Bearer token:

```
Authorization: Bearer <jwt_token>
```

### **Connection Status**

When fetching users, responses may include `connectionStatus`:

```json
{
  "id": "123",
  "connectionStatus": "connected"
}
```

Values: `"none"` | `"pending"` | `"connected"`

This is computed relative to the authenticated user.
