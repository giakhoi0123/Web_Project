# Changelog - Cập nhật mới nhất

## Ngày 27/10/2025 - Phần 2

### 🎯 Các tính năng bổ sung:

#### 5. ✅ Ràng buộc số điện thoại khi checkout
- **Yêu cầu**: Chỉ chấp nhận 10-11 chữ số
- **Validation**: 
  - HTML5 pattern: `[0-9]{10,11}`
  - JavaScript validation trước khi submit
  - Popup lỗi nếu nhập sai
- **Test**: Thử nhập `abc`, `12345`, `0909180825` (đúng)

#### 6. ✅ Hiển thị ảnh sản phẩm trong lịch sử đơn hàng
- **Trước**: Chỉ có tên sản phẩm dạng text
- **Sau**: 
  - Mỗi sản phẩm có ảnh thumbnail 50x50px
  - Hiển thị: ảnh + tên + số lượng + giá
  - Fallback ảnh nếu lỗi: `no-image.png`

#### 7. ✅ Cập nhật giá real-time khi thay đổi số lượng
- **Trang chi tiết sản phẩm**:
  - Giá tự động nhân với số lượng
  - VD: CPU 5 triệu x 3 = 15 triệu (cập nhật ngay)
  - Hoạt động khi: click +/-, nhập trực tiếp, paste

#### 8. ✅ Kiểm tra tồn kho toàn diện
**Hiển thị trạng thái kho**:
- Trang chi tiết sản phẩm:
  - `Còn hàng (X sản phẩm)` - xanh lá (≥5 sản phẩm)
  - `Chỉ còn X sản phẩm` - cam cảnh báo (<5 sản phẩm)
  - `Hết hàng` - đỏ (0 sản phẩm)

**Chặn mua vượt tồn kho**:
- ❌ Tăng số lượng quá mức → Popup "Chỉ còn X sản phẩm"
- ❌ Thêm giỏ khi hết hàng → Popup "Sản phẩm đã hết hàng"
- ❌ Thay đổi số lượng trong giỏ → Auto giảm về mức tối đa
- ✅ Mua xong → Tồn kho tự động trừ đi

**Các điểm kiểm tra**:
1. Trang danh sách → Click "Thêm giỏ" → Check tồn kho
2. Trang chi tiết → Tăng số lượng → Check tồn kho
3. Giỏ hàng → Nhập số lượng → Check tồn kho
4. Checkout → Trừ tồn kho trong admin storage

---

## 🔧 Các file đã chỉnh sửa (Phần 2):

### `js/router.js`
- `renderCheckout()`: Thêm validation số điện thoại (regex `/^[0-9]{10,11}$/`)
- `renderOrderHistory()`: Thêm ảnh sản phẩm + giá chi tiết
- `renderProductDetail()`: 
  - Thêm `#product-total-price` element
  - Hàm `updateTotalPrice()`: cập nhật giá theo số lượng
  - Hàm `checkInventory()`: lấy tồn kho từ `admin_inventory`
  - Hàm `updateStockStatus()`: hiển thị trạng thái kho
  - Logic chặn tăng số lượng vượt tồn kho
  - Logic kiểm tra trước khi "Thêm giỏ" / "Mua ngay"
- `renderCart()`: Kiểm tra tồn kho khi thay đổi số lượng

### `js/cart-logic.js`
- `addToCart()`: Thêm kiểm tra tồn kho trước khi thêm vào giỏ

---

## 📊 Cách test (Phần 2):

### Test 5: Số điện thoại
1. Vào giỏ hàng → Checkout
2. Nhập số điện thoại:
   - `abc` → Lỗi HTML5
   - `123` → Lỗi HTML5
   - `090918082` → Lỗi (9 số)
   - `09091808255` → Lỗi (12 số)
   - `0909180825` → ✓ Đúng (10 số)
   - `09091808251` → ✓ Đúng (11 số)

### Test 6: Ảnh trong lịch sử
1. Mua vài sản phẩm → Checkout
2. Vào Profile → "Xem lịch sử đơn hàng"
3. Mỗi sản phẩm hiện:
   - Ảnh thumbnail bên trái
   - Tên + số lượng + giá bên phải

### Test 7: Giá real-time
1. Vào chi tiết sản phẩm (VD: CPU 5 triệu)
2. Giá ban đầu: 5.000.000đ
3. Tăng số lượng lên 3:
   - Click nút + 2 lần
   - Giá tự động: 15.000.000đ
4. Nhập trực tiếp số 5:
   - Giá tự động: 25.000.000đ

### Test 8: Kiểm tra tồn kho

**Chuẩn bị dữ liệu test**:
1. Mở Chrome DevTools → Console
2. Chạy lệnh để set tồn kho:
```javascript
let inv = JSON.parse(localStorage.getItem('admin_inventory')) || [];
// Tìm sản phẩm ID 101 (CPU Intel i9)
let cpu = inv.find(i => i.productId === 101);
if (!cpu) {
  inv.push({ productId: 101, productName: "Intel Core i9-14900K", type: "CPU", quantity: 3 });
} else {
  cpu.quantity = 3; // Set chỉ còn 3 sản phẩm
}
localStorage.setItem('admin_inventory', JSON.stringify(inv));
console.log('✅ Đã set CPU ID 101 còn 3 sản phẩm');
```

**Test trường hợp 1: Còn ít hàng (3 sản phẩm)**
1. Vào chi tiết sản phẩm CPU ID 101
2. Trạng thái hiện: `⚠️ Chỉ còn 3 sản phẩm` (màu cam)
3. Tăng số lượng lên 3 → OK
4. Tăng lên 4 → Popup "Chỉ còn 3 sản phẩm" + không cho tăng
5. Thêm 3 vào giỏ → OK
6. Thử thêm thêm 1 nữa → Popup "Chỉ còn 3 sản phẩm"

**Test trường hợp 2: Hết hàng (0 sản phẩm)**
```javascript
let inv = JSON.parse(localStorage.getItem('admin_inventory')) || [];
let cpu = inv.find(i => i.productId === 101);
if (cpu) cpu.quantity = 0;
localStorage.setItem('admin_inventory', JSON.stringify(inv));
console.log('✅ Đã set CPU ID 101 hết hàng');
```
1. Reload trang chi tiết CPU
2. Trạng thái hiện: `❌ Hết hàng` (màu đỏ)
3. Click "Thêm vào giỏ" → Popup "Sản phẩm đã hết hàng"
4. Click "Mua ngay" → Popup "Sản phẩm đã hết hàng"
5. Thử tăng số lượng → Popup cảnh báo

**Test trường hợp 3: Trừ tồn kho sau khi mua**
```javascript
// Set CPU có 10 sản phẩm
let inv = JSON.parse(localStorage.getItem('admin_inventory')) || [];
let cpu = inv.find(i => i.productId === 101);
if (cpu) cpu.quantity = 10;
localStorage.setItem('admin_inventory', JSON.stringify(inv));
```
1. Vào chi tiết CPU → Thêm 3 sản phẩm vào giỏ
2. Checkout → Hoàn tất đơn hàng
3. Mở Console, kiểm tra:
```javascript
let inv = JSON.parse(localStorage.getItem('admin_inventory'));
let cpu = inv.find(i => i.productId === 101);
console.log('Tồn kho còn:', cpu.quantity); // Phải là 7 (10 - 3)
```
4. Vào admin → "Tồn kho" → CPU ID 101 hiện: `7`
5. Vào "Đơn hàng" → Thấy đơn vừa đặt với 3 CPU

---

## 🎯 Workflow đầy đủ:

### Kịch bản: Mua 1 CPU khi chỉ còn 2 trong kho

1. **Setup**: Set CPU ID 101 còn 2 sản phẩm (xem code Console ở trên)

2. **Vào trang chi tiết**:
   - URL: `main/index.html#product/101`
   - Hiện: `⚠️ Chỉ còn 2 sản phẩm`
   - Giá: 16.990.000đ

3. **Tăng số lượng**:
   - Click + 1 lần → Số lượng: 2, Giá: 33.980.000đ ✓
   - Click + thêm 1 lần → Popup "Chỉ còn 2 sản phẩm" ❌

4. **Thêm vào giỏ**:
   - Click "Thêm vào giỏ hàng" → ✓ Thêm 2 sản phẩm
   - Click lại "Thêm vào giỏ hàng" → Popup "Không đủ hàng! Còn 2 sản phẩm, bạn đã có 2 trong giỏ" ❌

5. **Checkout**:
   - Vào giỏ → Thấy 2 CPU
   - Thử đổi số lượng thành 5 → Auto giảm về 2 + Popup
   - Click "Thanh toán"
   - Nhập SĐT: `0909180825` ✓
   - Hoàn tất đơn

6. **Kiểm tra kết quả**:
   - Tồn kho CPU 101: `0` (2 - 2)
   - Admin → Đơn hàng: Thấy order mới với 2 CPU
   - Admin → Tồn kho: CPU 101 = `0`
   - Vào lại chi tiết CPU → Hiện: `❌ Hết hàng`

---

## 💡 Lưu ý quan trọng:

### Tồn kho ban đầu
- Khi admin load lần đầu, mọi sản phẩm có `quantity: 0`
- Bạn cần:
  1. Vào Admin → "Nhập hàng" → Tạo phiếu nhập cho các sản phẩm
  2. Hoặc dùng Console để set thủ công (như ví dụ test)

### Import hàng trong Admin
1. Admin → "Nhập hàng" → "Thêm phiếu nhập"
2. Chọn sản phẩm, nhập giá + số lượng
3. Click "Hoàn thành nhập hàng" → Tồn kho tự động tăng

### Kiểm tra tồn kho nhanh
```javascript
// Xem tồn kho tất cả sản phẩm
console.table(JSON.parse(localStorage.getItem('admin_inventory')));

// Xem tồn kho 1 sản phẩm
let inv = JSON.parse(localStorage.getItem('admin_inventory'));
let product = inv.find(i => i.productId === 101);
console.log('CPU ID 101:', product ? product.quantity : 'Chưa có');
```

---

## Ngày 27/10/2025 - Phần 1

### 🎯 Các tính năng đã hoàn thành:

#### 1. ✅ Đồng bộ dữ liệu Admin với User
- **Đăng ký tài khoản**: Khi user đăng ký, dữ liệu tự động lưu vào `admin_users`
- **Đơn hàng**: Khi checkout, đơn hàng tự động tạo trong `admin_orders`
- **Tồn kho**: Khi mua hàng, số lượng tự động trừ trong `admin_inventory`
- **Đổi mật khẩu**: Khi user đổi mật khẩu, admin storage cũng được cập nhật
- **Import sản phẩm**: Admin tự động import toàn bộ sản phẩm từ `products.js` khi load lần đầu

#### 2. ✅ Xây dựng cấu hình PC
**Trước**: Chỉ chọn 1 sản phẩm mỗi loại (ghi đè)
**Sau**: Có thể chọn nhiều sản phẩm trong cùng 1 loại (giàn xuống như giỏ hàng)
- Chọn nhiều CPU, nhiều RAM, nhiều VGA, v.v.
- Tổng giá tính tự động
- Thêm tất cả vào giỏ hàng 1 lượt

#### 3. ✅ Kiểm tra độ mạnh mật khẩu
**Yêu cầu mật khẩu mạnh**:
- Tối thiểu 8 ký tự
- Có chữ thường (a-z)
- Có chữ HOA (A-Z)
- Có số (0-9)
- Có ký tự đặc biệt (!@#$%^&*...)

**Hiển thị real-time**:
- Thanh màu 5 cấp độ (đỏ → cam → vàng → xanh lá nhạt → xanh lá đậm)
- Text gợi ý chi tiết: "Cần: Chữ HOA, số, ký tự đặc biệt"
- Không cho đăng ký nếu mật khẩu yếu (< 4/5 điểm)

#### 4. ✅ Tìm kiếm nâng cao - Nhập khoảng giá tự do
**Trước**: Chỉ có dropdown với các mức giá cố định
**Sau**: Có 2 ô input:
- "Giá từ" (min)
- "Giá đến" (max)
- Người dùng tự do nhập bất kỳ khoảng giá nào
- Kiểm tra lỗi: giá từ > giá đến

---

## 🔧 Các file đã chỉnh sửa:

### `js/router.js`
- Sửa `renderAdvancedSearch()`: thay dropdown bằng 2 input min/max
- Sửa `renderBuildConfig()`: thay `selectedComponents` object → array để chọn nhiều sản phẩm
- Sửa `renderCheckout()`: thêm logic đồng bộ order + inventory vào admin storage

### `js/script.js`
- Thêm hàm `checkPasswordStrength()`: kiểm tra 5 tiêu chí
- Thêm event listener real-time cho password input
- Sửa signup handler: kiểm tra mật khẩu trước khi cho đăng ký
- Sửa reset password: đồng bộ vào `admin_users`

### `admin/admin.js`
- Thêm hàm `syncProductsFromMainSite()`: import products từ `products.js`
- Đổi tên biến `products` → `products_admin` để tránh xung đột
- Cập nhật tất cả function dùng products thành products_admin
- Thêm danh mục PC và GEAR vào categories

### `admin/admin.html`
- Thêm `<script src="../js/products.js"></script>` để import products

### `login/index.html`
- Thêm thanh hiển thị độ mạnh mật khẩu (5 bars)
- Thêm text gợi ý dưới thanh màu

---

## 📊 Cách test:

### Test 1: Đồng bộ dữ liệu Admin
1. Mở `login/index.html` → Đăng ký tài khoản mới
2. Đăng nhập → Thêm sản phẩm vào giỏ → Checkout
3. Mở `admin/admin.html` → Đăng nhập (admin / admin123)
4. Kiểm tra:
   - **Người dùng**: user vừa đăng ký xuất hiện
   - **Đơn hàng**: order vừa tạo xuất hiện
   - **Tồn kho**: số lượng sản phẩm đã trừ

### Test 2: Xây dựng cấu hình
1. Vào trang chủ → Click "Xây dựng cấu hình" (Gaming/Workstation/Budget)
2. Chọn nhiều CPU, nhiều RAM, nhiều VGA
3. Xem tổng giá tự động cập nhật
4. Click "Thêm vào giỏ hàng" → Tất cả sản phẩm được thêm 1 lượt

### Test 3: Mật khẩu mạnh
1. Mở `login/index.html` → Click "Sign Up"
2. Nhập mật khẩu:
   - `abc` → Hiện thanh đỏ "Yếu - Cần: Chữ HOA, số, ký tự đặc biệt, ≥8 ký tự"
   - `Abcd1234` → Hiện thanh vàng "Trung bình - Nên thêm ký tự đặc biệt"
   - `Abcd@1234` → Hiện thanh xanh "Mật khẩu mạnh ✓"
3. Thử đăng ký với mật khẩu yếu → Bị chặn với popup lỗi

### Test 4: Tìm kiếm giá tự do
1. Vào "Tìm kiếm nâng cao"
2. Nhập:
   - Giá từ: 5000000
   - Giá đến: 15000000
3. Click "Lọc sản phẩm" → Chỉ hiện sản phẩm trong khoảng 5-15 triệu

---

## 🚀 Hướng dẫn chạy:

```bash
cd /Users/phamgiakhoi/Web_Project/final/Web_Project
python3 -m http.server 8000
```

Sau đó mở trình duyệt:
- Trang chủ: http://localhost:8000/main/index.html
- Đăng nhập: http://localhost:8000/login/index.html
- Admin: http://localhost:8000/admin/admin.html

---

## 💾 LocalStorage Keys:

- `admin_users`: Danh sách tất cả user
- `admin_products`: Danh sách sản phẩm (auto import từ products.js)
- `admin_orders`: Danh sách đơn hàng (bao gồm order từ user)
- `admin_inventory`: Tồn kho (tự động trừ khi user mua)
- `admin_imports`: Danh sách phiếu nhập kho
- `admin_pricing`: Giá bán và lợi nhuận
- `admin_categories`: Danh mục sản phẩm
- `cart_{email}`: Giỏ hàng của từng user
- `order-history_{email}`: Lịch sử đơn hàng của từng user
- `user`: User hiện tại (legacy)

---

## ⚠️ Lưu ý:

1. **Admin products tự động sync**: Lần đầu load admin, toàn bộ sản phẩm từ `products.js` sẽ được import vào `admin_products`
2. **Inventory tự động tạo**: Mỗi sản phẩm sẽ có 1 record inventory với quantity = 0 ban đầu
3. **Mật khẩu mạnh**: Bắt buộc phải đạt 4/5 điểm trở lên mới được đăng ký
4. **Khoảng giá**: Nếu nhập "Giá từ" > "Giá đến", hệ thống sẽ báo lỗi

---

✅ Tất cả yêu cầu đã hoàn thành!
