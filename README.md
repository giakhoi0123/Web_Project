# Web Project - PC & Gaming Gear E-commerce

Trang web bán linh kiện máy tính và gear gaming với hệ thống quản trị admin đầy đủ.

## 🚀 Tính năng

### Trang người dùng
- Hiển thị sản phẩm theo danh mục (PC, CPU, VGA, RAM, Monitor, Case, Gear)
- Tìm kiếm sản phẩm
- Giỏ hàng và thanh toán
- Đăng ký/đăng nhập tài khoản
- Responsive design

### Admin Panel
- Quản lý sản phẩm (CRUD)
- Upload ảnh sản phẩm với tự động nén
- Quản lý người dùng
- Quản lý đơn hàng
- Quản lý tồn kho (nhập/xuất/tồn)
- Báo cáo và thống kê
- Real-time sync với localStorage

## 📁 Cấu trúc thư mục

```
├── main/           # Trang chủ người dùng
├── admin/          # Trang quản trị
├── login/          # Trang đăng nhập
├── css/            # Stylesheets
├── js/             # JavaScript files
└── img/            # Hình ảnh sản phẩm
```

## 🛠️ Công nghệ sử dụng

- HTML5
- CSS3 (với Flexbox/Grid)
- Vanilla JavaScript (ES6+)
- LocalStorage cho lưu trữ dữ liệu
- Font Awesome icons

## 🌐 Deploy

Website được deploy trên Vercel.

### Deploy lên Vercel

1. Cài đặt Vercel CLI (nếu chưa có):
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Hoặc deploy qua Vercel Dashboard:
   - Truy cập https://vercel.com
   - Import repository
   - Vercel sẽ tự động phát hiện và deploy

## 📝 Hướng dẫn sử dụng

### Tài khoản Admin mặc định
- Email: `admin@example.com`
- Password: `admin123`

### Tài khoản User mẫu
- Email: `user@example.com`
- Password: `user123`

## 🔧 Chạy local

```bash
# Sử dụng Python HTTP Server
python3 -m http.server 8000

# Hoặc sử dụng Live Server trong VS Code
# Right-click index.html > Open with Live Server
```

Truy cập:
- Trang chủ: http://localhost:8000/main
- Admin: http://localhost:8000/admin
- Login: http://localhost:8000/login

## 📄 License

ISC License
