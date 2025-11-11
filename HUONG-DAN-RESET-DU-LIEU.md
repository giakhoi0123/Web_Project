# 🔄 HƯỚNG DẪN RESET DỮ LIỆU CŨ - NHẬP HÀNG & TỒN KHO

## ❌ VẤN ĐỀ

Các phiếu nhập hàng cũ (tạo trước khi sửa code) gây ra:
- ✗ Tồn kho bị âm (VD: -1, -5)
- ✗ Bấm "Hoàn thành" phiếu nhập nhưng tồn kho không tăng
- ✗ Số liệu không chính xác

## ✅ GIẢI PHÁP: RESET VÀ BẮT ĐẦU LẠI

### **Bước 1: Vào Admin Dashboard**
```
http://localhost:8000/admin/admin.html
Login: admin / admin123
```

### **Bước 2: Tìm nút Reset**
Ngay đầu Dashboard, bạn sẽ thấy:
```
⚠️ Dữ liệu cũ có vấn đề?
Nếu thấy số lượng tồn kho âm hoặc phiếu nhập cũ lỗi, hãy reset dữ liệu
[Reset Nhập Hàng & Tồn Kho] ← NÚT NÀY
```

### **Bước 3: Click nút "Reset Nhập Hàng & Tồn Kho"**

Sẽ có 2 popup xác nhận:

**Popup 1:**
```
⚠️ CẢNH BÁO: Thao tác này sẽ:

✓ Xóa TẤT CẢ phiếu nhập hàng
✓ Reset tồn kho về 0
✓ GIỮ NGUYÊN: User, Sản phẩm, Đơn hàng, Doanh thu

Bạn có chắc chắn muốn tiếp tục?
```
→ Click **OK**

**Popup 2:**
```
🚨 XÁC NHẬN LẦN CUỐI!

Dữ liệu phiếu nhập và tồn kho sẽ bị XÓA VĨNH VIỄN.
Bạn sẽ phải tạo lại phiếu nhập từ đầu.

Tiếp tục?
```
→ Click **OK**

### **Bước 4: Kiểm tra kết quả**

Sau khi reset, bạn sẽ thấy notification:
```
✅ Đã reset thành công!

• Phiếu nhập: 0
• Tồn kho: 0

Bạn có thể bắt đầu tạo phiếu nhập mới.
```

---

## 🔍 KIỂM TRA SAU KHI RESET

### **1. Vào "Nhập hàng"**
```
✅ Bảng phiếu nhập: Trống (hoặc chỉ còn phiếu mới)
✅ Không còn phiếu cũ lỗi
```

### **2. Vào "Tồn kho"**
```
✅ Tất cả số lượng = 0
✅ Không còn số âm (-1, -5, etc.)
```

### **3. Console check**
Mở Console (F12):
```javascript
// Kiểm tra imports
let imp = JSON.parse(localStorage.getItem('admin_imports'));
console.log('Imports:', imp.length); // Phải = 0

// Kiểm tra inventory
let inv = JSON.parse(localStorage.getItem('admin_inventory'));
console.log('Inventory:', inv.length); // Phải = 0
console.table(inv);
```

---

## 📦 TẠO PHIẾU NHẬP MỚI (SAU KHI RESET)

### **Cách 1: Tạo thủ công từng phiếu**

#### Bước 1: Vào "Nhập hàng"
```
Sidebar → Click "Nhập hàng"
```

#### Bước 2: Thêm phiếu nhập
```
Click "Thêm phiếu nhập" (nút xanh)
```

#### Bước 3: Điền form
```
Mã phiếu: PN001 (tự động)
Ngày: 27/10/2025 (tự động)
Chọn sản phẩm: Intel Core i9-14900K ✓ (Bây giờ dropdown đã có sản phẩm!)
Giá nhập: 16000000
Số lượng: 50
→ Tổng tự động tính: 800,000,000₫
```

#### Bước 4: Lưu và hoàn thành
```
1. Click "Lưu" → Phiếu được tạo
2. Trong bảng, click "Hoàn thành" → Tồn kho tăng 50 ✅
```

#### Bước 5: Kiểm tra tồn kho
```
Vào "Tồn kho" → Xem Intel Core i9-14900K: 50 ✅
```

---

### **Cách 2: Dùng tool set hàng loạt (NHANH HƠN)**

#### Option A: Set tất cả = 100
Mở Console (F12), paste code:
```javascript
// Copy toàn bộ file admin-inventory-tool.js vào đây
// Sau đó chạy:
setAllInventoryTo100();

// Kết quả: Tất cả sản phẩm = 100
```

#### Option B: Set theo loại
```javascript
// Set CPU = 150
setInventoryByType('CPU', 150);

// Set VGA = 80
setInventoryByType('VGA', 80);

// Set RAM = 120
setInventoryByType('RAM', 120);
```

#### Option C: Quick Import (tạo cả phiếu nhập + tăng inventory)
```javascript
// productId, quantity, price
quickImport(1, 100, 16000000);  // CPU i9: 100 cái
quickImport(50, 80, 28000000);  // VGA RTX 4090: 80 cái
quickImport(100, 120, 2500000); // RAM 16GB: 120 cái
```

---

## ⚠️ QUAN TRỌNG: DỮ LIỆU GIỮ NGUYÊN

Reset **KHÔNG ẢNH HƯỞNG** đến:
- ✅ **Users** (Người dùng) - Giữ nguyên
- ✅ **Products** (Sản phẩm) - Giữ nguyên (~1300 sản phẩm)
- ✅ **Orders** (Đơn hàng) - Giữ nguyên
- ✅ **Revenue** (Doanh thu) - Giữ nguyên
- ✅ **Categories** (Danh mục) - Giữ nguyên
- ✅ **Pricing** (Định giá) - Giữ nguyên

Reset **CHỈ XÓA**:
- ❌ **Imports** (Phiếu nhập hàng)
- ❌ **Inventory** (Tồn kho)

---

## 🐛 TROUBLESHOOTING

### Vấn đề 1: "Sau khi reset vẫn thấy phiếu cũ"
**Giải pháp**:
```javascript
// Force clear trong Console
localStorage.removeItem('admin_imports');
localStorage.removeItem('admin_inventory');
location.reload();
```

### Vấn đề 2: "Tồn kho vẫn âm sau reset"
**Giải pháp**:
```javascript
// Manual reset inventory
let inv = [];
localStorage.setItem('admin_inventory', JSON.stringify(inv));
location.reload();
```

### Vấn đề 3: "Muốn reset CẢ user/order/revenue"
**Giải pháp**: Clear toàn bộ localStorage (MẤT HẾT DỮ LIỆU!)
```javascript
// ⚠️ CẢNH BÁO: Mất hết dữ liệu admin!
localStorage.clear();
location.reload();
// Sau đó sẽ phải:
// 1. Login lại admin
// 2. Import products từ products.js
// 3. Tạo lại user/order từ đầu
```

---

## 📊 WORKFLOW KHUYẾN NGHỊ

### **Lần đầu setup (hoặc sau khi sửa code)**
```
1. Reset Nhập hàng & Tồn kho (nút trong Dashboard)
2. Dùng admin-inventory-tool.js:
   - setAllInventoryTo100() → Tất cả = 100
   hoặc
   - Set từng loại theo nhu cầu
3. Bắt đầu nhận đơn hàng từ user
```

### **Khi có đơn hàng mới**
```
1. User checkout → Tồn kho tự động giảm ✅
2. Doanh thu tự động tăng ✅
3. Admin thấy notification realtime ✅
```

### **Khi cần nhập thêm hàng**
```
1. Vào "Nhập hàng"
2. Tạo phiếu nhập mới
3. Click "Hoàn thành" → Tồn kho tăng ✅
```

---

## 💡 LƯU Ý

### Tại sao phải reset?
- Code trước đó có bug trong việc cập nhật inventory
- Các phiếu cũ đã tạo ra dữ liệu sai
- Reset để bắt đầu với dữ liệu sạch, code mới (đã fix bug)

### Có mất dữ liệu quan trọng không?
- **KHÔNG**: User, Product, Order, Revenue đều giữ nguyên
- **CÓ**: Phiếu nhập và tồn kho sẽ bị xóa (nhưng đó là dữ liệu lỗi, cần xóa!)

### Sau khi reset có cần làm gì không?
- Nếu dùng `setAllInventoryTo100()`: **KHÔNG**, xong luôn!
- Nếu muốn tồn kho chính xác: Tạo phiếu nhập thủ công

---

## 🎯 KẾT QUẢ MONG ĐỢI

### Trước khi reset:
```
Tồn kho:
- CPU i9: -1 ❌
- VGA RTX 4090: -5 ❌
- RAM 16GB: 0 ❌

Phiếu nhập: 10 phiếu (nhiều phiếu lỗi)
```

### Sau khi reset + setAllInventoryTo100():
```
Tồn kho:
- CPU i9: 100 ✅
- VGA RTX 4090: 100 ✅
- RAM 16GB: 100 ✅
- ... (tất cả ~100 sản phẩm): 100 ✅

Phiếu nhập: 0 (sạch sẽ)
```

### Sau khi user mua hàng (1 CPU i9):
```
Tồn kho:
- CPU i9: 99 ✅ (100 - 1)

Đơn hàng: +1 ✅
Doanh thu: +16,030,000₫ ✅
```

---

🎉 **HOÀN TẤT!**

Giờ hệ thống admin đã sạch sẽ, không còn dữ liệu lỗi!

---

**Created**: 27/10/2025  
**Files changed**: 
- `admin/admin.html` - Thêm nút Reset
- `admin/admin.js` - Thêm function `resetImportsAndInventory()`
