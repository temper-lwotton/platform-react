# **Discussions API Endpoints**

**Domain:** [Discussions](../../domains/discussions.md)

**Base Path:** `/api/discussion` (note: singular)

---

## **Endpoint Index**

### **Discussions CRUD**

| Method | Path | Description |
|--------|------|-------------|
| GET | [`/api/discussion`](./list.md) | List all discussions |
| GET | [`/api/spaces/{spaceId}/discussions`](./list-by-space.md) | List discussions in space |
| GET | [`/api/discussion/{id}`](./get.md) | Get single discussion |
| POST | [`/api/discussion`](./create.md) | Create discussion |
| PATCH | [`/api/discussion/{id}`](./update.md) | Update discussion |
| DELETE | [`/api/discussion/{id}`](./delete.md) | Delete discussion |

### **Engagement**

| Method | Path | Description |
|--------|------|-------------|
| POST | [`/api/discussion/{id}/like`](./like.md) | Like discussion |
| DELETE | [`/api/discussion/{id}/unlike`](./unlike.md) | Unlike discussion |
| GET | [`/api/discussion/{id}/likes`](./get-likes.md) | Get users who liked |
| POST | [`/api/discussion/{id}/follow`](./follow.md) | Follow discussion |
| DELETE | [`/api/discussion/{id}/unfollow`](./unfollow.md) | Unfollow discussion |

### **Comments**

| Method | Path | Description |
|--------|------|-------------|
| GET | [`/api/discussion/{id}/comments`](./get-comments.md) | Get discussion comments |
| POST | [`/api/discussion/comments`](./create-comment.md) | Create comment |

---

## **Common Patterns**

### **User Context**

Discussions include user-specific flags:

```json
{
  "isLiked": true,
  "isFollowing": false
}
```

These are computed for the authenticated user.

### **Likes from JWT**

Like/unlike endpoints detect user from JWT token - no user ID in request body needed.

### **Comment Nesting**

Comments are returned in nested structure:

```json
{
  "id": "1",
  "content": "Great post!",
  "__children": [
    {
      "id": "2",
      "content": "Thanks!",
      "__children": []
    }
  ]
}
```

Transform `__children` to `replies` on the frontend.
