# 📚 HƯỚNG DẪN CẬP NHẬT TỒN KHO TRONG ADMIN

## 🎯 Mục tiêu: Cập nhật tất cả sản phẩm lên 100 đơn vị

---

## ✅ CÁCH 1: SỬ DỤNG CONSOLE (NHANH NHẤT - 30 GIÂY)

### Bước 1: Mở Admin
1. Vào `http://localhost:8000/admin/admin.html`
2. Đăng nhập: `admin` / `admin123`

### Bước 2: Mở Console
- **Windows/Linux**: `Ctrl + Shift + J` hoặc `F12`
- **Mac**: `Cmd + Option + J`

### Bước 3: Copy & Paste Script
1. Mở file `admin-inventory-tool.js`
2. Copy **TOÀN BỘ** nội dung (Ctrl+A → Ctrl+C)
3. Paste vào Console (Ctrl+V) → Enter

### Bước 4: Chạy Lệnh
```javascript
setAllInventoryTo100()
```

### Bước 5: Refresh Admin
- Nhấn `F5` hoặc `Ctrl+R`
- Vào menu "Tồn kho" → Thấy tất cả = 100 ✅

---

## ✅ CÁCH 2: SỬ DỤNG ADMIN UI (CHI TIẾT TỪNG BƯỚC)

### Phương án A: Nhập hàng từng loại

#### 1. Vào Admin → Menu "Nhập hàng"

#### 2. Click nút "Thêm phiếu nhập" (màu xanh)

#### 3. Điền form:
- **Chọn sản phẩm**: Chọn từ dropdown (VD: Intel Core i9-14900K)
- **Giá nhập**: Nhập giá (VD: 16000000)
- **Số lượng**: Nhập 100
- Click "Lưu"

#### 4. Hoàn thành phiếu nhập:
- Trong bảng, tìm phiếu vừa tạo
- Click nút "Hoàn thành" (màu xanh lá)
- → Tồn kho sẽ tự động tăng 100

#### 5. Lặp lại cho các sản phẩm khác
- CPU: 15 sản phẩm
- VGA: 15 sản phẩm  
- RAM: 15 sản phẩm
- CASE: 12 sản phẩm
- MONITOR: 15 sản phẩm
- PC: 12 sản phẩm
- GEAR: 15 sản phẩm
- **Tổng: ~100 sản phẩm** 😅

**⏱️ Thời gian**: ~20-30 phút (nếu làm thủ công)

### Phương án B: Chỉnh trực tiếp trong localStorage (KHÔNG KHUYẾN KHÍCH)

1. Mở Console (F12)
2. Chạy từng lệnh:

```javascript
// Xem tồn kho hiện tại
let inv = JSON.parse(localStorage.getItem('admin_inventory'));
console.table(inv);

// Cập nhật từng sản phẩm
inv[0].quantity = 100;
inv[1].quantity = 100;
// ... (lặp lại cho tất cả)

// Hoặc dùng vòng lặp:
inv.forEach(item => item.quantity = 100);

// Lưu lại
localStorage.setItem('admin_inventory', JSON.stringify(inv));

// Refresh trang
location.reload();
```

---

## 🚀 CÁCH 3: TẠO NÚT NHANH TRONG ADMIN (TỐI ƯU NHẤT)

### Thêm nút "Set All 100" vào trang Tồn kho:

#### Bước 1: Mở file `admin/admin.html`

#### Bước 2: Tìm section "Tồn kho" (dòng ~480)
```html
<div id="inventory" class="section">
    <div class="section-header">
        <h2>Quản lý tồn kho</h2>
        <!-- THÊM NÚT MỚI Ở ĐÂY -->
```

#### Bước 3: Thêm nút sau dòng `<h2>Quản lý tồn kho</h2>`:
```html
<button class="btn btn-warning" onclick="setAllInventoryTo100UI()">
    <i class="fas fa-box"></i> Set All = 100
</button>
```

#### Bước 4: Mở file `admin/admin.js`

#### Bước 5: Thêm function vào cuối file (trước dấu `}`):
```javascript
// ===== SET ALL INVENTORY TO 100 =====
function setAllInventoryTo100UI() {
    if (!confirm('Cập nhật TẤT CẢ sản phẩm lên 100 đơn vị?')) return;
    
    inventory.forEach(item => {
        item.quantity = 100;
    });
    
    saveData();
    renderInventory();
    showNotification('✅ Đã cập nhật tất cả lên 100!', 'success');
}
```

#### Bước 6: Lưu và refresh
- Vào Admin → "Tồn kho"
- Click nút "Set All = 100"
- Confirm → Done! ✅

---

## 📊 KIỂM TRA KẾT QUẢ

### Console:
```javascript
// Xem tồn kho
let inv = JSON.parse(localStorage.getItem('admin_inventory'));
console.table(inv);

// Đếm số sản phẩm = 100
let count100 = inv.filter(i => i.quantity === 100).length;
console.log(`Có ${count100}/${inv.length} sản phẩm = 100`);
```

### Admin UI:
1. Vào menu "Tồn kho"
2. Xem cột "Số lượng" → Tất cả phải = 100
3. Vào "Dashboard" → Kiểm tra số liệu

---

## 🔧 TROUBLESHOOTING

### Vấn đề 1: "Không thấy sản phẩm trong inventory"
**Giải pháp**:
```javascript
// Force import products từ products.js
syncProductsFromMainSite();
// Sau đó refresh trang
```

### Vấn đề 2: "Cập nhật xong nhưng số không đổi"
**Giải pháp**:
- Refresh trang (F5)
- Hoặc click vào menu "Tồn kho" lại

### Vấn đề 3: "Script không chạy"
**Giải pháp**:
- Kiểm tra Console có lỗi không (chữ đỏ)
- Đảm bảo đã paste TOÀN BỘ script
- Thử refresh và paste lại

---

## 💡 TIPS & TRICKS

### Tip 1: Set theo loại sản phẩm
```javascript
// Set tất cả CPU = 150
setInventoryByType('CPU', 150);

// Set tất cả VGA = 80
setInventoryByType('VGA', 80);
```

### Tip 2: Xem thống kê nhanh
```javascript
inventoryStats(); // Xem tổng quan
```

### Tip 3: Tìm sản phẩm sắp hết
```javascript
viewInventory({ lowStock: 10 }); // Xem SP < 10
```

### Tip 4: Backup trước khi thay đổi
```javascript
// Backup
let backup = localStorage.getItem('admin_inventory');
localStorage.setItem('inventory_backup', backup);

// Restore nếu cần
let restore = localStorage.getItem('inventory_backup');
localStorage.setItem('admin_inventory', restore);
```

---

## ⚡ SO SÁNH THỜI GIAN

| Phương pháp | Thời gian | Độ khó | Khuyến nghị |
|-------------|-----------|--------|-------------|
| Console Script | 30 giây | ⭐ Dễ | ✅ KHUYẾN NGHỊ |
| Nhập hàng UI | 20-30 phút | ⭐⭐⭐ Khó | ❌ Không nên |
| localStorage Manual | 2 phút | ⭐⭐ Trung bình | ⚠️ Chỉ khi cần |
| Thêm nút UI | 5 phút setup | ⭐⭐⭐⭐ Nâng cao | ⭐ Tốt nhất lâu dài |

---

## 📝 CHECKLIST

- [ ] Đã mở admin và đăng nhập
- [ ] Đã mở Console (F12)
- [ ] Đã copy toàn bộ `admin-inventory-tool.js`
- [ ] Đã paste vào Console
- [ ] Đã chạy `setAllInventoryTo100()`
- [ ] Đã refresh trang (F5)
- [ ] Đã vào menu "Tồn kho" kiểm tra
- [ ] ✅ Tất cả sản phẩm = 100

---

🎉 HOÀN THÀNH!
