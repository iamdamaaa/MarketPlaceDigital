# API Testing Guide — MarketPlace Digital

## Base URL
```
http://127.0.0.1:8000/api
```

## Status Codes
| Code | Meaning |
|------|---------|
| 200  | OK — Request berhasil |
| 201  | Created — Resource berhasil dibuat |
| 401  | Unauthorized — Token tidak valid / belum login |
| 403  | Forbidden — Tidak punya akses (bukan admin) |
| 404  | Not Found — Resource tidak ditemukan |
| 422  | Unprocessable Entity — Validasi gagal |
| 500  | Server Error — Error internal |

## Response Format
Semua endpoint mengembalikan format JSON konsisten:
```json
{
  "success": true|false,
  "message": "Pesan deskriptif",
  "data": { ... }
}
```

---

## 1. AUTH ENDPOINTS

### POST /api/auth/register
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```
**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "buyer" },
    "token": "1|abc123...",
    "token_type": "Bearer"
  }
}
```

### POST /api/auth/login
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```
**Response (200):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "buyer" },
    "token": "2|xyz789...",
    "token_type": "Bearer"
  }
}
```
**Error (401):**
```json
{ "success": false, "message": "Email or Password is wrong" }
```

### POST /api/auth/logout
```bash
curl -X POST http://127.0.0.1:8000/api/auth/logout \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Response (200):**
```json
{ "success": true, "message": "User logged out successfully" }
```

### GET /api/auth/me
```bash
curl http://127.0.0.1:8000/api/auth/me \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Response (200):**
```json
{
  "success": true,
  "message": "User data retrieved",
  "data": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "buyer" }
}
```

---

## 2. PRODUCT ENDPOINTS

### GET /api/products (Public)
```bash
curl "http://127.0.0.1:8000/api/products?search=template&category_id=1&per_page=12&page=1" \
  -H "Accept: application/json"
```
**Response (200):**
```json
{
  "success": true,
  "message": "List of products",
  "data": [
    {
      "id": 1, "title": "Template Premium", "slug": "template-premium",
      "description": "Template website premium", "price": 150000,
      "status": "published", "thumbnail": null,
      "category": { "id": 1, "name": "Templates" },
      "seller": { "id": 1, "name": "Admin" }
    }
  ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 12, "total": 1 }
}
```

### POST /api/products (Admin only)
```bash
curl -X POST http://127.0.0.1:8000/api/products \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "title": "Template Website Pro",
    "description": "Template website profesional dengan desain modern",
    "price": 250000,
    "category_id": 1,
    "status": "published"
  }'
```
**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { "id": 2, "title": "Template Website Pro", ... }
}
```

### PUT /api/products/{id} (Admin only)
```bash
curl -X PUT http://127.0.0.1:8000/api/products/2 \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{ "price": 200000 }'
```

### DELETE /api/products/{id} (Admin only)
```bash
curl -X DELETE http://127.0.0.1:8000/api/products/2 \
  -H "Accept: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 3. ORDER ENDPOINTS

### GET /api/orders (Auth required)
```bash
curl http://127.0.0.1:8000/api/orders \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### POST /api/orders (Auth required)
```bash
curl -X POST http://127.0.0.1:8000/api/orders \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "product_id": 1,
    "quantity": 2,
    "notes": "Mohon kirim segera"
  }'
```
**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1, "user_id": 2, "product_id": 1,
    "quantity": 2, "total_price": 300000,
    "status": "pending", "notes": "Mohon kirim segera"
  }
}
```

### GET /api/orders/{id}
```bash
curl http://127.0.0.1:8000/api/orders/1 \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### PUT /api/orders/{id}/status (Admin only)
```bash
curl -X PUT http://127.0.0.1:8000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{ "status": "processing" }'
```
**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated from pending to processing",
  "data": { "id": 1, "status": "processing", ... }
}
```

---

## 4. NOTIFICATION ENDPOINTS

### GET /api/notifications (Auth required)
```bash
curl http://127.0.0.1:8000/api/notifications \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Response (200):**
```json
{
  "success": true,
  "message": "List of notifications",
  "data": [
    {
      "id": "uuid-string",
      "type": "order_status_updated",
      "title": "Status Pesanan Diperbarui",
      "message": "Status pesanan #1 berubah dari pending ke processing",
      "read_at": null,
      "created_at": "2026-05-19T10:00:00.000000Z"
    }
  ],
  "unread_count": 1,
  "meta": { "current_page": 1, "last_page": 1, "per_page": 20, "total": 1 }
}
```

### POST /api/notifications/read (Auth required)
```bash
curl -X POST http://127.0.0.1:8000/api/notifications/read \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 5. TESTING FLOW (End-to-End)

### Step 1: Register admin (via tinker)
```bash
php artisan tinker
> App\Models\User::create(['name'=>'Admin','email'=>'admin@test.com','password'=>bcrypt('password123'),'role'=>'admin','is_active'=>true]);
```

### Step 2: Register buyer
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"name":"Buyer","email":"buyer@test.com","password":"password123","password_confirmation":"password123"}'
```
Save the token from response.

### Step 3: Admin login & create product
```bash
# Login as admin
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'

# Create product (use admin token)
curl -X POST http://127.0.0.1:8000/api/products \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"title":"Test Product","description":"A test product","price":100000,"category_id":1,"status":"published"}'
```

### Step 4: Buyer creates order
```bash
curl -X POST http://127.0.0.1:8000/api/orders \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -H "Authorization: Bearer BUYER_TOKEN" \
  -d '{"product_id":1,"quantity":1}'
```

### Step 5: Admin updates order status
```bash
curl -X PUT http://127.0.0.1:8000/api/orders/1/status \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"status":"processing"}'
```

### Step 6: Buyer checks notifications
```bash
curl http://127.0.0.1:8000/api/notifications \
  -H "Accept: application/json" \
  -H "Authorization: Bearer BUYER_TOKEN"
```

---

## Postman Collection Setup

1. Create environment variable `base_url` = `http://127.0.0.1:8000/api`
2. Create environment variable `token` (empty initially)
3. In Login request, add Post-response Script:
   ```javascript
   var jsonData = pm.response.json();
   pm.environment.set("token", jsonData.data.token);
   ```
4. In all protected requests, set Authorization header: `Bearer {{token}}`

## Real-time (Pusher) Setup

1. Register at https://pusher.com and create an app
2. Update `.env` with your Pusher credentials
3. Run `php artisan queue:work` for broadcasting
4. For free self-hosted option, use Soketi:
   ```bash
   npx soketi start
   ```
   Then update `.env`:
   ```
   PUSHER_HOST=127.0.0.1
   PUSHER_PORT=6001
   PUSHER_SCHEME=http
   ```
