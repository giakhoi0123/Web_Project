# 🔄 HƯỚNG DẪN KIỂM TRA REALTIME UPDATES

## ✅ ĐÃ CẬP NHẬT

### 1. **Giao diện Tìm kiếm Nâng cao** ✨
- Input giá min/max **đồng bộ kích thước** với dropdown danh mục
- Thêm hover và focus effects
- Remove spinner mũi tên trên input number

### 2. **Realtime Sync Admin** 🔄
- Admin tự động cập nhật mỗi 3 giây
- Theo dõi:
  - ✅ **Orders** (đơn hàng mới)
  - ✅ **Users** (thêm/xóa người dùng)
  - ✅ **Products** (thêm/xóa sản phẩm)
- Hiển thị notification khi có thay đổi
- Tự động refresh view hiện tại

### 3. **Revenue Tracking** 💰
- Tự động tăng doanh thu khi checkout
- Lưu theo:
  - **Tổng doanh thu** (total)
  - **Theo ngày** (byDate)
  - **Theo tháng** (byMonth)
  - **Theo năm** (byYear)
- Dashboard hiển thị tổng doanh thu chính xác

---

## 🧪 CÁCH KIỂM TRA

### **Test 1: Giao diện Tìm kiếm**

1. Vào trang user: `http://localhost:8000/main/index.html#advanced-search`
2. Quan sát:
   - ✅ Input "Giá từ" và "Giá đến" **cùng kích thước** với dropdown "Danh mục"
   - ✅ Hover vào input → viền màu tím (#667eea)
   - ✅ Click vào input → focus với shadow xanh
   - ✅ Không có mũi tên lên/xuống trong input number

---

### **Test 2: Realtime Orders** 📦

#### Setup:
1. Mở 2 tab trình duyệt:
   - **Tab 1**: Admin (`http://localhost:8000/admin/admin.html`)
   - **Tab 2**: User (`http://localhost:8000/main/index.html`)

2. Đăng nhập Admin (Tab 1):
   - Username: `admin`
   - Password: `admin123`
   - Vào Dashboard → Để nguyên tab này

#### Thực hiện:
1. **Tab 2 (User)**: 
   - Đăng nhập (hoặc đăng ký nếu chưa có tài khoản)
   - Thêm sản phẩm vào giỏ hàng
   - Checkout → Điền form → Thanh toán

2. **Tab 1 (Admin)**:
   - Chờ **tối đa 3 giây**
   - ✅ Sẽ thấy notification: `🔔 1 đơn hàng mới`
   - ✅ Dashboard tự động refresh
   - ✅ Số "Đơn hàng" tăng lên
   - ✅ Doanh thu tăng

---

### **Test 3: Realtime Users** 👤

#### Thực hiện:
1. **Tab 2 (User)**:
   - Vào trang login: `http://localhost:8000/login/index.html`
   - Click "Đăng ký"
   - Điền form đăng ký → Submit
   - User mới được tạo

2. **Tab 1 (Admin)**:
   - Chờ **tối đa 3 giây**
   - ✅ Notification: `🔔 1 người dùng mới`
   - ✅ Vào menu "Quản lý user" → Thấy user mới xuất hiện
   - ✅ Dashboard "Người dùng" tăng

#### Xóa user:
1. **Tab 1 (Admin)**:
   - Vào "Quản lý user"
   - Click nút "Khóa" một user bất kỳ
   - Refresh trang hoặc đợi 3s
   - ✅ Realtime sync hoạt động

---

### **Test 4: Realtime Products** 📦

#### Thêm sản phẩm:
1. **Tab 1 (Admin)**:
   - Vào "Quản lý sản phẩm"
   - Click "Thêm sản phẩm"
   - Điền form → Lưu

2. Chờ **3 giây**:
   - ✅ Notification: `🔔 1 sản phẩm mới`
   - ✅ Dashboard "Sản phẩm" tăng

#### Xóa sản phẩm:
1. Click nút "Xóa" một sản phẩm
2. Chờ **3 giây**:
   - ✅ Notification: `🔔 1 sản phẩm bị xóa`
   - ✅ Dashboard cập nhật

---

### **Test 5: Revenue Tracking** 💰

#### Kiểm tra doanh thu:
1. **Tab 2 (User)**:
   - Mua 3 đơn hàng với các giá trị khác nhau:
     - Đơn 1: 5.000.000đ
     - Đơn 2: 10.000.000đ
     - Đơn 3: 3.500.000đ

2. **Tab 1 (Admin)**:
   - Vào Dashboard
   - ✅ Kiểm tra card "Doanh thu":
     - Tổng phải là: `18.500.000₫` (5M + 10M + 3.5M)

#### Kiểm tra console:
1. Mở Console (F12) trong **Tab 2 (User)**
2. Checkout một đơn hàng
3. Xem console log:
   ```
   💰 Doanh thu +5030000₫ (27/10/2025)
   ```

#### Kiểm tra localStorage:
1. Trong Console **Tab 1 (Admin)**:
   ```javascript
   // Xem revenue
   let rev = JSON.parse(localStorage.getItem('admin_revenue'));
   console.log(rev);
   
   // Kết quả:
   {
     total: 18500000,
     byDate: {
       "27/10/2025": 18500000
     },
     byMonth: {
       "2025-10": 18500000
     },
     byYear: {
       "2025": 18500000
     }
   }
   ```

---

## 🔍 TROUBLESHOOTING

### Vấn đề 1: "Không thấy notification"
**Nguyên nhân**: Tab admin không focus

**Giải pháp**:
- Để tab admin **hiển thị** (không minimize)
- Hoặc check console log: `✅ Realtime sync: Orders • Users • Products (mỗi 3s)`

---

### Vấn đề 2: "Dashboard không tự động refresh"
**Nguyên nhân**: Đang ở section khác (không phải dashboard/orders/users/products)

**Giải pháp**:
- Auto-refresh chỉ hoạt động khi đang xem:
  - Dashboard
  - Quản lý đơn hàng
  - Quản lý user
  - Quản lý sản phẩm
- Nếu đang ở "Tồn kho" hoặc "Nhập hàng" → Không auto-refresh (chủ ý)

---

### Vấn đề 3: "Doanh thu không đúng"
**Giải pháp**:
```javascript
// Reset revenue (nếu cần test lại)
localStorage.removeItem('admin_revenue');
location.reload();
```

---

### Vấn đề 4: "Input giá vẫn có mũi tên"
**Nguyên nhân**: CSS chưa load

**Giải pháp**:
- Hard refresh: `Ctrl+Shift+R` (Windows) hoặc `Cmd+Shift+R` (Mac)
- Clear cache trình duyệt

---

## 📊 KẾT QUẢ MONG ĐỢI

### ✅ Giao diện Tìm kiếm:
- Input price đẹp, đồng bộ với select
- Hover/focus có hiệu ứng
- Không có spinner

### ✅ Realtime Admin:
- Notification xuất hiện sau 3s khi có thay đổi
- Dashboard auto-refresh
- View hiện tại tự động cập nhật

### ✅ Revenue:
- Tổng doanh thu chính xác
- Tự động tăng khi có đơn mới
- Lưu theo ngày/tháng/năm

---

## 💡 LƯU Ý

1. **Interval 3 giây**: Không thể thay đổi realtime hơn (sẽ tốn tài nguyên)

2. **localStorage**: Nếu clear localStorage → Mất hết dữ liệu

3. **Multiple changes**: Nếu trong 3s có nhiều thay đổi (VD: thêm 5 user) → Notification gộp chung

4. **Console logs**: Để debug, check console:
   ```javascript
   // Tab Admin
   console.log('Orders:', orders.length);
   console.log('Users:', users.length);
   console.log('Products:', products_admin.length);
   ```

---

🎉 **HOÀN TẤT!**

Giờ admin có thể:
- ✅ Xem đơn hàng mới **tự động** (không cần F5)
- ✅ Biết khi có user đăng ký
- ✅ Theo dõi thay đổi sản phẩm
- ✅ Xem doanh thu **chính xác** realtime
