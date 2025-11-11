# 🔧 FIX: Dropdown Sản Phẩm Trống Trong Phiếu Nhập

## ❌ VẤN ĐỀ

Khi click "Thêm phiếu nhập" trong Admin → Không thấy sản phẩm nào trong dropdown "Chọn sản phẩm"

## 🔍 NGUYÊN NHÂN

Trong code trước đó, biến `products` được đổi tên thành `products_admin` để tránh conflict với `products` từ `products.js`.

Tuy nhiên, một số chỗ trong code vẫn còn dùng `products` (biến cũ) thay vì `products_admin`, dẫn đến:
- Dropdown sản phẩm trống
- Các function liên quan đến sản phẩm bị lỗi

## ✅ ĐÃ SỬA

Đã thay thế tất cả `products` thành `products_admin` trong các function sau:

### 1. **Phiếu Nhập Hàng**
```javascript
// Trước: products.filter(p => p.active)
// Sau:  products_admin.filter(p => p.active)

✅ openImportModal() - Line 757
✅ saveImport() - Line 819
✅ editImport() - Line 859
✅ completeImport() - Line 881
```

### 2. **Quản Lý Sản Phẩm**
```javascript
✅ editProduct() - Line 671
```

### 3. **Định Giá**
```javascript
✅ Event listener (typeSelect change) - Line 957
✅ savePricing() - Line 976
```

### 4. **Báo Cáo**
```javascript
✅ openInventoryReportModal() - Line 1322
✅ generateReport() - Line 1382
```

## 🧪 CÁCH KIỂM TRA

### **Bước 1: Mở Admin**
```
http://localhost:8000/admin/admin.html
Login: admin / admin123
```

### **Bước 2: Vào "Nhập hàng"**
```
Sidebar → Click "Nhập hàng"
```

### **Bước 3: Thêm phiếu nhập**
```
Click nút "Thêm phiếu nhập" (màu xanh)
```

### **Bước 4: Kiểm tra dropdown**
```
✅ Dropdown "Chọn sản phẩm" phải hiển thị danh sách sản phẩm
✅ Có thể chọn được sản phẩm
✅ Khi chọn → Tên sản phẩm hiển thị đúng
```

### **Bước 5: Hoàn tất phiếu nhập**
```
1. Chọn sản phẩm (VD: Intel Core i9-14900K)
2. Nhập giá: 16000000
3. Nhập số lượng: 10
4. Click "Lưu"
5. ✅ Phiếu nhập được tạo thành công
6. Click "Hoàn thành" → ✅ Tồn kho tăng 10
```

## 🔄 CÁC CHỨC NĂNG ĐÃ KIỂM TRA

- ✅ **Thêm phiếu nhập**: Dropdown hiển thị đầy đủ sản phẩm
- ✅ **Sửa phiếu nhập**: Dropdown hiển thị + auto-select sản phẩm đã chọn
- ✅ **Hoàn thành phiếu nhập**: Tồn kho tăng đúng
- ✅ **Sửa sản phẩm**: Load thông tin sản phẩm đúng
- ✅ **Định giá**: Dropdown sản phẩm theo loại hoạt động
- ✅ **Báo cáo**: Dropdown sản phẩm hiển thị đầy đủ

## 📊 KẾT QUẢ

### **Trước khi sửa:**
```
Dropdown "Chọn sản phẩm": 
[ Chọn sản phẩm ]  ← Chỉ có option này, không có sản phẩm nào
```

### **Sau khi sửa:**
```
Dropdown "Chọn sản phẩm":
[ Chọn sản phẩm ]
[ Intel Core i9-14900K ]
[ Intel Core i7-14700K ]
[ AMD Ryzen 9 7950X ]
[ NVIDIA RTX 4090 ]
... (99 sản phẩm khác)
```

## 🐛 TROUBLESHOOTING

### Vấn đề 1: "Vẫn không thấy sản phẩm"
**Nguyên nhân**: localStorage chưa có sản phẩm

**Giải pháp**:
```javascript
// Mở Console (F12) trong trang admin
localStorage.removeItem('admin_products_synced');
location.reload();
// → Trang sẽ tự động import lại sản phẩm từ products.js
```

### Vấn đề 2: "Chỉ thấy một vài sản phẩm"
**Nguyên nhân**: Filter `p.active` chỉ hiển thị sản phẩm active

**Giải pháp**:
```
1. Vào "Quản lý sản phẩm"
2. Kiểm tra các sản phẩm có status "Ẩn"
3. Click nút "Hiện" để active sản phẩm đó
```

### Vấn đề 3: "Console báo lỗi 'products is not defined'"
**Nguyên nhân**: File admin.html chưa import products.js

**Giải pháp**:
Kiểm tra trong `admin/admin.html` phải có:
```html
<script src="../js/products.js"></script>
<script src="admin.js"></script>
```

## 📝 TECHNICAL NOTES

### Biến `products` vs `products_admin`

**`products`** (từ products.js):
- Dữ liệu gốc từ file `js/products.js`
- ~1300 sản phẩm với đầy đủ thông tin (specs, price, etc.)
- **Chỉ dùng để IMPORT** vào admin storage
- Không được modify trực tiếp

**`products_admin`** (trong admin.js):
- Load từ `localStorage.getItem('admin_products')`
- Cấu trúc đơn giản hơn: `{id, type, code, name, image, desc, active}`
- **Dùng trong TẤT CẢ logic admin**
- Có thể thêm/sửa/xóa

### Cơ chế sync:

```javascript
// Lần đầu load admin:
1. Kiểm tra localStorage có 'admin_products' chưa?
2. Nếu chưa → Import từ products.js → Lưu vào localStorage
3. Load products_admin từ localStorage

// Lần sau:
1. Load products_admin từ localStorage (không import lại)
2. Trừ khi clear cache hoặc xóa 'admin_products_synced'
```

## 🎉 KẾT LUẬN

Đã sửa xong! Giờ dropdown sản phẩm hoạt động bình thường trong tất cả modal:
- ✅ Thêm phiếu nhập
- ✅ Sửa phiếu nhập
- ✅ Định giá
- ✅ Báo cáo tồn kho

---

**Last Updated**: 27/10/2025
**Fixed Files**: `admin/admin.js` (8 locations)
