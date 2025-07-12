# 🏠 Website Cho Thuê Nhà Tại Hà Nội

Dự án xây dựng một website hỗ trợ **tìm kiếm, đăng tin và quản lý nhà trọ, căn hộ cho thuê tại Hà Nội**. Được phát triển bằng **Java Spring Boot** kết hợp với **Thymeleaf**, **MySQL** và các công nghệ web phổ biến khác.

## 🚀 Tính năng chính

### 👤 Người dùng
- Đăng ký / Đăng nhập tài khoản
- Tìm kiếm phòng trọ theo quận/huyện, giá, diện tích, tiện nghi
- Xem chi tiết bài đăng (thông tin chủ nhà, ảnh, mô tả, giá thuê, vị trí)
- Gửi yêu cầu thuê nhà / Liên hệ người cho thuê
- Quản lý thông tin cá nhân, lịch sử thuê

### 🧑‍💼 Người cho thuê (chủ trọ)
- Đăng tin cho thuê nhà/phòng
- Quản lý, chỉnh sửa, xóa bài đăng
- Quản lý yêu cầu thuê từ người dùng

### 🛠️ Quản trị viên (Admin)
- Phê duyệt bài đăng trước khi hiển thị
- Quản lý người dùng và người cho thuê
- Gỡ bỏ bài đăng vi phạm
- Quản lý hệ thống phân quyền

---

## 🧱 Công nghệ sử dụng

| Layer         | Technology                  |
|---------------|-----------------------------|
| Backend       | Spring Boot, Spring Security, Spring Data JPA |
| Frontend      | Thymeleaf, Bootstrap, HTML/CSS, JavaScript |
| Database      | MySQL                        |
| Authentication| JWT (JSON Web Token)         |
| API           | RESTful API                  |

---

## 🏗️ Kiến trúc hệ thống

- Kiến trúc phân tầng (Controller - Service - Repository)
- Phân quyền theo vai trò (USER, RENTALER, ADMIN)
- Hệ thống CRUD cho bài đăng, người dùng, yêu cầu thuê
- Tích hợp bản đồ (Google Maps hoặc Leaflet.js)

---

## 🔐 Phân quyền

- `ROLE_USER`: Tìm kiếm, xem bài đăng
- `ROLE_RENTALER`: Quản lý bài đăng của mình
- `ROLE_ADMIN`: Quản trị toàn bộ hệ thống
