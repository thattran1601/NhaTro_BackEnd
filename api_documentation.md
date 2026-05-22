# Tài liệu API - Hệ Thống Quản Lý Nhà Trọ

**URL Backend:** `https://nhatro-backend-ka3b.onrender.com`  
**URL dự phòng:** `https://nhatro-backend-ynm7.onrender.com`  
**Thư mục lưu trữ tĩnh (Static files):** `/uploads/cccd/` (Ví dụ: `https:/nhatro-backend-ka3b.onrender.com/uploads/cccd/filename.jpg`)

---

## 📌 Lưu Ý Quan Trọng Về Cấu Trúc Response

> [!WARNING]
> Hệ thống hiện có hai kiểu trả về kết quả (Response Format). Frontend cần xử lý đúng cấu trúc tương ứng với từng module:
>
> 1. **Kiểu Legacy (Phòng & Thiết bị):** Trả trực tiếp mảng, object JSON hoặc `{ message: "..." }` nếu thành công. Khi lỗi trả về `{ error: "..." }`.
> 2. **Kiểu Chuẩn (Hợp đồng, Khách hàng, Thân nhân, User):** Trả về cấu trúc bọc chuẩn:
>    ```json
>    {
>      "success": true | false,
>      "message": "Thông điệp phản hồi từ server",
>      "data": {} | [] // Chứa dữ liệu trả về (nếu có)
>    }
>    ```

---

## 🗂️ Danh Sách Các Module API

1. [Module Phòng (`/api/phong`)](#1-module-phòng-apiphong)
2. [Module Thiết Bị (`/api/thietbi`)](#2-module-thiết-bị-apithietbi)
3. [Module Hợp Đồng (`/api/hopdong`)](#3-module-hợp-đồng-apihopdong)
4. [Module Khách Hàng (`/api/khachhang`)](#4-module-khách-hàng-apikhachhang)
5. [Module Thân Nhân (`/api/thannhan`)](#5-module-thân-nhân-apithannhan)
6. [Module User / Đăng Nhập (`/api/user`)](#6-module-user-đăng-nhập-apiuser)

---

## 1. Module Phòng (`/api/phong`)

Cơ sở dữ liệu lưu trữ thông tin phòng bao gồm: `MaPhong`, `TenPhong`, `GiaThue`, `SoNguoi` (số lượng người tối đa ở trong phòng), và `TinhTrang` (`0`: Còn trống/Còn chỗ, `1`: Đã đầy).

### Lấy danh sách tất cả phòng
- **Endpoint:** `GET /api/phong/`
- **Response:**
  ```json
  [
    {
      "MaPhong": 1,
      "TenPhong": "Phòng 101",
      "GiaThue": 2000000.00,
      "SoNguoi": 3,
      "TinhTrang": 0
    }
  ]
  ```

### Lấy thông tin phòng theo mã phòng
- **Endpoint:** `GET /api/phong/:id`
- **Params:** `id` (Mã phòng)
- **Response:**
  ```json
  {
    "MaPhong": 1,
    "TenPhong": "Phòng 101",
    "GiaThue": 2000000.00,
    "SoNguoi": 3,
    "TinhTrang": 0
  }
  ```

### Thêm phòng mới
- **Endpoint:** `POST /api/phong/`
- **Body (JSON):**
  | Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `TenPhong` | String | Có | Tên phòng trọ |
  | `GiaThue` | Decimal/Number | Có | Giá thuê phòng |
  | `SoNguoi` | Integer | Có | Số người tối đa trong phòng |
  | `DanhSachThietBi` | Array | Không | Mảng chứa ID thiết bị (`MaTB`) muốn gắn vào phòng ngay khi tạo |
- **Body mẫu:**
  ```json
  {
    "TenPhong": "Phòng 102",
    "GiaThue": 2500000,
    "SoNguoi": 3,
    "DanhSachThietBi": [1, 2]
  }
  ```
- **Response mẫu:**
  ```json
  { "message": "Tạo phòng và thêm thiết bị thành công" }
  ```
  *(Nếu không gửi kèm `DanhSachThietBi`, trả về `{ "message": "Tạo phòng thành công" }`)*

### Cập nhật phòng
- **Endpoint:** `PUT /api/phong/:id`
- **Params:** `id` (Mã phòng)
- **Body (JSON):**
  ```json
  {
    "TenPhong": "Phòng 102 (Đã sửa)",
    "GiaThue": 3000000,
    "SoNguoi": 4,
    "TinhTrang": 1
  }
  ```
- **Response mẫu:**
  ```json
  { "message": "Cập nhật phòng thành công" }
  ```

### Xóa phòng
- **Endpoint:** `DELETE /api/phong/:id`
- **Params:** `id` (Mã phòng)
- **Response mẫu:**
  ```json
  { "message": "Xóa phòng thành công" }
  ```

### Lấy thông tin chi tiết phòng (Khách thuê & Thiết bị)
> [!NOTE]
> Endpoint này thực hiện LEFT JOIN giữa Phòng, Hợp đồng đang ký, Khách hàng đại diện thuê, và danh sách các Thiết bị đã lắp đặt tại phòng để trả về dữ liệu tổng hợp đầy đủ.

- **Endpoint:** `GET /api/phong/chitietphong/:id`
- **Params:** `id` (Mã phòng)
- **Response thành công:**
  ```json
  [
    {
      "MaPhong": 1,
      "TenPhong": "Phòng 101",
      "TinhTrangPhong": 0,
      "TenKhachHang": "Nguyễn Văn A",
      "SDT": "0987654321",
      "TenThietBi": "Điều hòa",
      "SoSeri": "SN123",
      "TinhTrangThietBi": 1
    }
  ]
  ```
- **Response khi không tìm thấy phòng (404):**
  ```json
  { "error": "Không tìm thấy phòng" }
  ```

---

## 2. Module Thiết Bị (`/api/thietbi`)

Bảng dữ liệu thiết bị gồm: `MaTB`, `TenTB`, `SoSeri`. Trạng thái và phòng lắp đặt được lưu trữ ở bảng trung gian `thietbiphong` (`TinhTrang` mặc định `1` - Tốt, `0` - Hỏng).

### Lấy danh sách tất cả thiết bị
> [!NOTE]
> API này lấy toàn bộ thiết bị trong hệ thống kèm theo phòng đang được gán và tình trạng sử dụng tương ứng. Nếu thiết bị đang trong kho (chưa gán phòng), `MaPhong` và `TinhTrang` sẽ nhận giá trị `null`.

- **Endpoint:** `GET /api/thietbi/`
- **Response:**
  ```json
  [
    {
      "MaTB": 1,
      "MaPhong": 1,
      "TenTB": "Điều hòa",
      "SoSeri": "SN123",
      "TinhTrang": 1
    },
    {
      "MaTB": 2,
      "MaPhong": null,
      "TenTB": "Tủ lạnh",
      "SoSeri": "SN456",
      "TinhTrang": null
    }
  ]
  ```

### Lấy danh sách thiết bị theo phòng
- **Endpoint:** `GET /api/thietbi/phong/:id`
- **Params:** `id` (Mã phòng)
- **Response:**
  ```json
  [
    {
      "MaPhong": 1,
      "MaTb": 1,
      "TenTB": "Điều hòa",
      "TinhTrang": 1
    }
  ]
  ```
  *(Lưu ý: Thuộc tính mã thiết bị trả về định dạng camelCase `MaTb` với chữ 'b' viết thường)*

### Thêm thiết bị mới (vào kho)
- **Endpoint:** `POST /api/thietbi/`
- **Body (JSON):**
  ```json
  {
    "TenTB": "Máy giặt",
    "SoSeri": "SN789"
  }
  ```
- **Response:**
  ```json
  { "message": "Tạo thiết bị thành công" }
  ```

### Cập nhật thông tin thiết bị
> [!TIP]
> Endpoint này có thể vừa cập nhật thông tin gốc của thiết bị (tên, số seri) đồng thời cập nhật tình trạng tại phòng (nếu gửi kèm `MaPhong` và `TinhTrang`).

- **Endpoint:** `PUT /api/thietbi/:id`
- **Params:** `id` (Mã thiết bị)
- **Body (JSON):**
  | Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `TenTB` | String | Có | Tên thiết bị |
  | `SoSeri` | String | Có | Số Serial của thiết bị |
  | `MaPhong` | Integer | Không | Mã phòng để cập nhật tình trạng thiết bị lắp tại đó |
  | `TinhTrang` | Integer | Không | Tình trạng thiết bị tại phòng (0 hoặc 1) |
- **Body mẫu:**
  ```json
  {
    "TenTB": "Điều hòa Panasonic",
    "SoSeri": "SN12345",
    "MaPhong": 1,
    "TinhTrang": 0
  }
  ```
- **Response:**
  ```json
  { "message": "Cập nhật thiết bị thành công" }
  ```

### Xóa thiết bị khỏi hệ thống
> [!WARNING]
> Không thể xóa thiết bị đang được lắp đặt ở bất kỳ phòng nào. Frontend phải gỡ thiết bị khỏi phòng trước khi thực hiện xóa.

- **Endpoint:** `DELETE /api/thietbi/:id`
- **Params:** `id` (Mã thiết bị)
- **Response thành công:**
  ```json
  { "message": "Xóa thiết bị thành công" }
  ```
- **Response thất bại khi thiết bị đang được gán (400):**
  ```json
  { "error": "Thiết bị đang được gán cho phòng, không thể xóa" }
  ```

### Lắp đặt thiết bị vào phòng
> [!WARNING]
> Thiết bị chỉ được gán cho duy nhất 1 phòng tại 1 thời điểm. Nếu thiết bị đã thuộc về phòng khác, hệ thống sẽ chặn thao tác.

- **Endpoint:** `POST /api/thietbi/them-thiet-bi`
- **Body (JSON):**
  ```json
  {
    "MaPhong": 1,
    "MaTB": 2
  }
  ```
- **Response thành công:**
  ```json
  { "message": "Thêm thiết bị vào phòng thành công" }
  ```
- **Response thất bại khi đã gán phòng khác (400):**
  ```json
  { "message": "Thiết bị đã được gán cho phòng khác" }
  ```

### Gỡ thiết bị khỏi phòng (Chuyển về kho)
- **Endpoint:** `DELETE /api/thietbi/xoa-thiet-bi`
- **Body (JSON):**
  ```json
  {
    "MaPhong": 1,
    "MaTB": 2
  }
  ```
- **Response:**
  ```json
  { "message": "Xóa thiết bị khỏi phòng thành công" }
  ```

---

## 3. Module Hợp Đồng (`/api/hopdong`)

Response chuẩn: `{ success: boolean, data?: any, message?: string }`.

### Lấy danh sách tất cả hợp đồng
- **Endpoint:** `GET /api/hopdong`
- **Query Params (Optional):** `?TrangThai=1` (Lọc theo trạng thái hợp đồng: `1` - Đang hiệu lực, `2` - Đã thanh lý, v.v.)
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "MaHD": 1,
        "MaPhong": 1,
        "MaKH": 2,
        "NgayTao": "2026-05-22T00:00:00.000Z",
        "NgayKT": "2026-12-31T00:00:00.000Z",
        "TienCoc": "1000000.00",
        "TrangThai": 1
      }
    ]
  }
  ```

### Lấy danh sách hợp đồng theo phòng
- **Endpoint:** `GET /api/hopdong/phong/:MaPhong`
- **Params:** `MaPhong` (Mã phòng)
- **Query Params (Optional):** `?TrangThai=1`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "MaHD": 1,
        "MaPhong": 1,
        "MaKH": 2,
        "NgayTao": "2026-05-22T00:00:00.000Z",
        "NgayKT": "2026-12-31T00:00:00.000Z",
        "TienCoc": "1000000.00",
        "TrangThai": 1
      }
    ]
  }
  ```

### Tạo hợp đồng mới
> [!IMPORTANT]
> **Logic Nghiệp vụ Đặc biệt (Database Transaction):**
> 1. Kiểm tra phòng tồn tại (Trả lỗi 404 nếu không tồn tại).
> 2. Đếm số hợp đồng đang hoạt động (`TrangThai = 1`) của phòng đó. So sánh với số người tối đa (`SoNguoi`) của phòng. Nếu đã đầy, trả lỗi **400** và hủy lưu trữ.
> 3. Sau khi tạo thành công, đếm lại số lượng hợp đồng hoạt động. Nếu vừa đủ đạt sức chứa tối đa (`SoNguoi`), hệ thống tự động cập nhật trạng thái của phòng thành **1** (Đã đầy).

- **Endpoint:** `POST /api/hopdong`
- **Body (JSON):**
  | Trường | Kiểu dữ liệu | Bắt buộc | Mô tả | Mặc định |
  | :--- | :--- | :--- | :--- | :--- |
  | `MaPhong` | Integer | Có | Mã phòng trọ | |
  | `MaKH` | Integer | Có | Mã khách hàng đại diện ký hợp đồng | |
  | `NgayTao` | String (YYYY-MM-DD) | Không | Ngày tạo/ký hợp đồng | Ngày hiện tại |
  | `NgayKT` | String (YYYY-MM-DD) | Không | Ngày hết hạn hợp đồng | `null` |
  | `TienCoc` | Decimal/Number | Không | Số tiền đặt cọc | `0` |
  | `TrangThai` | Integer | Không | Trạng thái hợp đồng (1: Active) | `0` |
- **Body mẫu:**
  ```json
  {
    "MaPhong": 1,
    "MaKH": 2,
    "NgayTao": "2026-05-22",
    "NgayKT": "2026-12-31",
    "TienCoc": 2000000,
    "TrangThai": 1
  }
  ```
- **Response khi phòng đầy sau khi ký (201):**
  ```json
  {
    "success": true,
    "message": "Tạo hợp đồng thành công. Phòng đã đầy.",
    "data": {
      "MaHD": 3,
      "MaPhong": 1,
      "MaKH": 2,
      "NgayTao": "2026-05-22",
      "NgayKT": "2026-12-31",
      "TienCoc": 2000000,
      "TrangThai": 1
    }
  }
  ```
- **Response khi phòng vẫn còn chỗ sau khi ký (201):**
  ```json
  {
    "success": true,
    "message": "Tạo hợp đồng thành công",
    "data": { ... }
  }
  ```
- **Response khi phòng đã đầy từ trước (400):**
  ```json
  {
    "success": false,
    "message": "Phòng này đã đầy. Số người tối đa: 2, số hợp đồng hiện tại: 2"
  }
  ```

### Cập nhật thông tin hợp đồng
- **Endpoint:** `PUT /api/hopdong/:MaHD`
- **Params:** `MaHD` (Mã hợp đồng)
- **Body (JSON):**
  ```json
  {
    "NgayKT": "2027-05-22",
    "TienCoc": 3000000,
    "TrangThai": 2
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Cập nhật thành công"
  }
  ```

---

## 4. Module Khách Hàng (`/api/khachhang`)

Response chuẩn: `{ success: boolean, data?: any, message?: string }`.

> [!IMPORTANT]
> **Yêu cầu Upload File (`multipart/form-data`):**
> 1. API **Thêm mới** và **Cập nhật** khách hàng sử dụng upload file hình ảnh qua Multer.
> 2. Định dạng ảnh cho phép: `.jpg`, `.jpeg`, `.png` với dung lượng tối đa là **5MB** cho mỗi ảnh.
> 3. Tệp ảnh upload được lưu trữ trong thư mục `/uploads/cccd/` của server.

### Lấy danh sách khách hàng
- **Endpoint:** `GET /api/khachhang`
- **Query Params (Optional):** `?keyword=098` (Hỗ trợ tìm kiếm không dấu/có dấu tương đối theo `CCCD`, `SDT` hoặc `HoTen`)
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "MaKH": 1,
        "HoTen": "Nguyễn Văn A",
        "CCCD": "012345678910",
        "TruocCCCD": "TruocCCCD-1716353982000.png",
        "SauCCCD": "SauCCCD-1716353982000.png",
        "SDT": "0987654321"
      }
    ]
  }
  ```

### Lấy chi tiết thông tin một khách hàng
- **Endpoint:** `GET /api/khachhang/:id`
- **Params:** `id` (Mã khách hàng)
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "MaKH": 1,
      "HoTen": "Nguyễn Văn A",
      "CCCD": "012345678910",
      "TruocCCCD": "TruocCCCD-1716353982000.png",
      "SauCCCD": "SauCCCD-1716353982000.png",
      "SDT": "0987654321"
    }
  }
  ```

### Thêm khách hàng mới
> [!NOTE]
> Khi xảy ra lỗi kiểm tra đầu vào hoặc trùng số CCCD, các file ảnh vừa tải lên sẽ tự động bị xóa khỏi ổ đĩa server để giải phóng dung lượng bộ nhớ.

- **Endpoint:** `POST /api/khachhang`
- **Request Type:** `multipart/form-data`
- **Form Fields:**
  | Tên trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `HoTen` | String | Có | Họ tên khách hàng |
  | `CCCD` | String | Có | Số CCCD (phải là duy nhất) |
  | `SDT` | String | Có | Số điện thoại liên lạc |
  | `TruocCCCD` | File (Image) | Không | Ảnh chụp mặt trước CCCD |
  | `SauCCCD` | File (Image) | Không | Ảnh chụp mặt sau CCCD |
- **Response thành công (201):**
  ```json
  {
    "success": true,
    "message": "Thêm khách hàng thành công",
    "data": {
      "MaKH": 2,
      "HoTen": "Trần Thị B",
      "CCCD": "001122334455",
      "TruocCCCD": "TruocCCCD-1716353982000.jpg",
      "SauCCCD": "SauCCCD-1716353982000.jpg",
      "SDT": "0912345678"
    }
  }
  ```
- **Response lỗi trùng số CCCD (400):**
  ```json
  {
    "success": false,
    "message": "Số CCCD này đã tồn tại trong hệ thống"
  }
  ```

### Cập nhật thông tin khách hàng
> [!NOTE]
> Khi cập nhật ảnh chụp CCCD mới (`TruocCCCD` hoặc `SauCCCD`), máy chủ sẽ tự động xóa các file ảnh cũ tương ứng trên server để tối ưu hóa bộ nhớ lưu trữ.

- **Endpoint:** `PUT /api/khachhang/:id`
- **Params:** `id` (Mã khách hàng)
- **Request Type:** `multipart/form-data`
- **Form Fields (Tất cả là Optional):** `HoTen`, `CCCD`, `SDT`, `TruocCCCD` (File), `SauCCCD` (File).
- **Response thành công (200):**
  ```json
  {
    "success": true,
    "message": "Cập nhật thông tin khách hàng thành công"
  }
  ```
- **Response lỗi trùng số CCCD của người khác (400):**
  ```json
  {
    "success": false,
    "message": "Số CCCD này đã được sử dụng cho một khách hàng khác"
  }
  ```

---

## 5. Module Thân Nhân (`/api/thannhan`)

Response chuẩn: `{ success: boolean, data?: any, message?: string }`.

### Lấy danh sách thân nhân theo Khách Hàng
- **Endpoint:** `GET /api/thannhan/khachhang/:maKH`
- **Params:** `maKH` (Mã khách hàng đại diện)
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "MaTN": 1,
        "MaKH": 1,
        "HoTen": "Nguyễn Văn C",
        "SDT": "0999888777",
        "QuanHe": "Con trai"
      }
    ]
  }
  ```

### Thêm thân nhân mới
- **Endpoint:** `POST /api/thannhan`
- **Body (JSON):**
  | Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `MaKH` | Integer | Có | Mã khách hàng quản lý thân nhân |
  | `HoTen` | String | Có | Họ tên thân nhân |
  | `SDT` | String | Có | Số điện thoại thân nhân |
  | `QuanHe` | String | Không | Mối quan hệ với khách hàng (Vợ, Con, v.v.) |
- **Body mẫu:**
  ```json
  {
    "MaKH": 1,
    "HoTen": "Nguyễn Thị D",
    "SDT": "0123123123",
    "QuanHe": "Vợ"
  }
  ```
- **Response thành công (201):**
  ```json
  {
    "success": true,
    "message": "Thêm thân nhân thành công",
    "data": {
      "MaTN": 2,
      "MaKH": 1,
      "HoTen": "Nguyễn Thị D",
      "SDT": "0123123123",
      "QuanHe": "Vợ"
    }
  }
  ```

### Cập nhật thân nhân
- **Endpoint:** `PUT /api/thannhan/:id`
- **Params:** `id` (Mã thân nhân - `MaTN`)
- **Body (JSON):**
  ```json
  {
    "HoTen": "Nguyễn Thị D (Đã sửa)",
    "SDT": "0123123123",
    "QuanHe": "Vợ"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Cập nhật thông tin thân nhân thành công"
  }
  ```

### Xóa thân nhân
- **Endpoint:** `DELETE /api/thannhan/:id`
- **Params:** `id` (Mã thân nhân - `MaTN`)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Xóa thân nhân thành công"
  }
  ```

---

## 6. Module User / Đăng Nhập (`/api/user`)

Response chuẩn: `{ success: boolean, data?: any, message?: string }`.

### Đăng nhập hệ thống
- **Endpoint:** `POST /api/user/login`
- **Body (JSON):**
  ```json
  {
    "username": "admin",
    "password": "123"
  }
  ```
- **Response đăng nhập thành công (200):**
  ```json
  {
    "success": true,
    "message": "Đăng nhập thành công",
    "data": {
      "UserID": 1,
      "Username": "admin"
    }
  }
  ```
- **Response đăng nhập thất bại (401 hoặc 400):**
  ```json
  {
    "success": false,
    "message": "Username hoặc password không đúng"
  }
  ```
