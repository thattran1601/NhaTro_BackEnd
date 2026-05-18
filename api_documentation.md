# Tài liệu API - Quản Lý Nhà Trọ

Tài liệu này mô tả chi tiết các endpoint API được cung cấp bởi Backend (NodeJS/Express) để Frontend (React) có thể tích hợp.

**URL Backend:** ` https://nhatro-backend-ka3b.onrender.com` 
**URL dự phòng:** `https://nhatro-backend-ynm7.onrender.com` 

> [!NOTE] 
> Lưu ý: Cách trả về dữ liệu của API **Phòng** và **Thiết bị** đang trả trực tiếp mảng/object json hoặc `{ message: "..." }`. Trong khi API **Hợp đồng**, **Khách hàng**, và **Thân nhân** trả về dữ liệu bọc trong `{ success: boolean, data?: any, message?: string }`. Frontend cần chú ý xử lý response khác nhau này.

---

## 1. Module Phòng (`/api/phong`)

### Lấy danh sách tất cả phòng
- **Endpoint:** `GET /api/phong/`
- **Response:**
  ```json
  [
    { "MaPhong": 1, "TenPhong": "Phòng 101", "GiaThue": 2000000, "TinhTrang": 0 },
    ...
  ]
  ```

### Lấy thông tin phòng theo mã phòng
- **Endpoint:** `GET /api/phong/:id`
- **Params:** `id` (Mã phòng)
- **Response:**
  ```json
  { "MaPhong": 1, "TenPhong": "Phòng 101", "GiaThue": 2000000, "TinhTrang": 0 }
  ```

### Thêm phòng mới
- **Endpoint:** `POST /api/phong/`
- **Body:**
  ```json
  {
    "TenPhong": "Phòng 102",
    "GiaThue": 2500000
  }
  ```
  *(Lưu ý: `TinhTrang` mặc định sẽ được set bằng 0).*
- **Response:**
  ```json
  { "message": "Tạo phòng thành công" }
  ```

### Cập nhật phòng
- **Endpoint:** `PUT /api/phong/:id`
- **Params:** `id` (Mã phòng)
- **Body:**
  ```json
  {
    "TenPhong": "Phòng 102 (Đã sửa)",
    "GiaThue": 3000000,
    "TinhTrang": 1
  }
  ```
- **Response:**
  ```json
  { "message": "Cập nhật phòng thành công" }
  ```

### Xóa phòng
- **Endpoint:** `DELETE /api/phong/:id`
- **Params:** `id` (Mã phòng)
- **Response:**
  ```json
  { "message": "Xóa phòng thành công" }
  ```

---

## 2. Module Thiết Bị (`/api/thietbi`)

### Lấy danh sách tất cả thiết bị
- **Endpoint:** `GET /api/thietbi/`
- **Response:**
  ```json
  [
    { "MaTB": 1, "TenTB": "Điều hòa", "SoSeri": "SN123", "TinhTrang": 0 },
    ...
  ]
  ```

### Lấy danh sách thiết bị theo mã phòng
- **Endpoint:** `GET /api/thietbi/phong/:id`
- **Params:** `id` (Mã phòng)
- **Response:**
  ```json
  [
    { "MaPhong": 1, "MaTb": 1, "TenTB": "Điều hòa", "TinhTrang": 0 }
  ]
  ```

### Thêm thiết bị mới (vào kho)
- **Endpoint:** `POST /api/thietbi/`
- **Body:**
  ```json
  {
    "TenTB": "Tủ lạnh",
    "SoSeri": "SN456"
  }
  ```
  *(Lưu ý: `TinhTrang` mặc định sẽ được set bằng 0).*
- **Response:**
  ```json
  { "message": "Tạo thiết bị thành công" }
  ```

### Cập nhật thiết bị
- **Endpoint:** `PUT /api/thietbi/:id`
- **Params:** `id` (Mã thiết bị)
- **Body:**
  ```json
  {
    "TenTB": "Tủ lạnh (Sửa)",
    "SoSeri": "SN456",
    "TinhTrang": 1
  }
  ```
- **Response:**
  ```json
  { "message": "Cập nhật thiết bị thành công" }
  ```

### Xóa thiết bị
- **Endpoint:** `DELETE /api/thietbi/:id`
- **Params:** `id` (Mã thiết bị)
- **Response:**
  ```json
  { "message": "Xóa thiết bị thành công" }
  ```

### Thêm thiết bị vào phòng (Gắn thiết bị cho phòng)
- **Endpoint:** `POST /api/thietbi/them-thiet-bi`
- **Body:**
  ```json
  {
    "MaPhong": 1,
    "MaTB": 2
  }
  ```
- **Response:**
  ```json
  { "message": "Thêm thiết bị vào phòng thành công" }
  ```

---

## 3. Module Hợp Đồng (`/api/hopdong`)

> [!TIP]
> Từ các API bên dưới, Response có cấu trúc chuẩn `{ success: boolean, data/message: any }`.

### Lấy danh sách hợp đồng
- **Endpoint:** `GET /api/hopdong`
- **Query Param (Optional):** `?TrangThai=0` (Lọc theo trạng thái)
- **Response Thành công:**
  ```json
  {
    "success": true,
    "data": [
      { "MaHD": 1, "MaPhong": 1, "MaKH": 2, "NgayKT": "...", "TienCoc": 1000000, "TrangThai": 1, "NgayTao": "..." }
    ]
  }
  ```

### Thêm hợp đồng mới
- **Endpoint:** `POST /api/hopdong`
- **Body:**
  ```json
  {
    "MaPhong": 1,
    "MaKH": 2,
    "NgayKT": "2026-12-31",
    "TienCoc": 2000000,
    "TrangThai": 1
  }
  ```
  *(API này tự động cập nhật `TinhTrang = 1` cho Phòng)*
- **Response Thành công:**
  ```json
  {
    "success": true,
    "message": "Tạo hợp đồng thành công",
    "data": { "MaHD": 3, "MaPhong": 1, "MaKH": 2, "NgayKT": "2026-12-31", "TienCoc": 2000000, "TrangThai": 1 }
  }
  ```

### Cập nhật hợp đồng
- **Endpoint:** `PUT /api/hopdong/:MaHD`
- **Params:** `MaHD` (Mã hợp đồng)
- **Body:**
  ```json
  {
    "NgayKT": "2027-01-01",
    "TienCoc": 3000000,
    "TrangThai": 2
  }
  ```
- **Response Thành công:**
  ```json
  { "success": true, "message": "Cập nhật thành công" }
  ```

---

## 4. Module Khách Hàng (`/api/khachhang`)

### Lấy danh sách khách hàng
- **Endpoint:** `GET /api/khachhang`
- **Query Param (Optional):** `?keyword=098` (Tìm kiếm theo CCCD hoặc SDT)
- **Response Thành công:**
  ```json
  {
    "success": true,
    "data": [
      { "MaKH": 1, "HoTen": "Nguyễn Văn A", "CCCD": "012345678910", "AnhCCCD": "link_anh", "SDT": "0987654321" }
    ]
  }
  ```

### Lấy thông tin 1 khách hàng
- **Endpoint:** `GET /api/khachhang/:id`
- **Params:** `id` (Mã khách hàng)
- **Response Thành công:**
  ```json
  {
    "success": true,
    "data": { "MaKH": 1, "HoTen": "Nguyễn Văn A", "CCCD": "012345678910", "AnhCCCD": null, "SDT": "0987654321" }
  }
  ```

### Thêm mới khách hàng
- **Endpoint:** `POST /api/khachhang`
- **Body:**
  ```json
  {
    "HoTen": "Trần Thị B",
    "CCCD": "001122334455",
    "AnhCCCD": "url_anh_hoac_base64", 
    "SDT": "0912345678"
  }
  ```
  *(Lưu ý: CCCD là duy nhất (unique))*
- **Response Thành công (201):**
  ```json
  {
    "success": true,
    "message": "Thêm khách hàng thành công",
    "data": { "MaKH": 2, "HoTen": "Trần Thị B", ... }
  }
  ```

### Cập nhật khách hàng
- **Endpoint:** `PUT /api/khachhang/:id`
- **Params:** `id` (Mã khách hàng)
- **Body:**
  ```json
  {
    "HoTen": "Trần Thị C",
    "CCCD": "001122334455",
    "AnhCCCD": null,
    "SDT": "0912345678"
  }
  ```
- **Response Thành công:**
  ```json
  { "success": true, "message": "Cập nhật thông tin khách hàng thành công" }
  ```

---

## 5. Module Thân Nhân (`/api/thannhan`)

### Lấy danh sách thân nhân theo Khách Hàng
- **Endpoint:** `GET /api/thannhan/khachhang/:maKH`
- **Params:** `maKH` (Mã khách hàng)
- **Response Thành công:**
  ```json
  {
    "success": true,
    "data": [
      { "MaTN": 1, "MaKH": 1, "HoTen": "Nguyễn Văn C", "SDT": "0999888777", "QuanHe": "Con trai" }
    ]
  }
  ```

### Thêm thân nhân mới
- **Endpoint:** `POST /api/thannhan`
- **Body:**
  ```json
  {
    "MaKH": 1,
    "HoTen": "Nguyễn Thị D",
    "SDT": "0123123123",
    "QuanHe": "Vợ"
  }
  ```
- **Response Thành công (201):**
  ```json
  {
    "success": true,
    "message": "Thêm thân nhân thành công",
    "data": { "MaTN": 2, "MaKH": 1, ... }
  }
  ```

### Cập nhật thân nhân
- **Endpoint:** `PUT /api/thannhan/:id`
- **Params:** `id` (Mã thân nhân - MaTN)
- **Body:**
  ```json
  {
    "HoTen": "Nguyễn Thị D (Đã sửa)",
    "SDT": "0123123123",
    "QuanHe": "Vợ"
  }
  ```
- **Response Thành công:**
  ```json
  { "success": true, "message": "Cập nhật thông tin thân nhân thành công" }
  ```

### Xóa thân nhân
- **Endpoint:** `DELETE /api/thannhan/:id`
- **Params:** `id` (Mã thân nhân - MaTN)
- **Response Thành công:**
  ```json
  { "success": true, "message": "Xóa thân nhân thành công" }
  ```
