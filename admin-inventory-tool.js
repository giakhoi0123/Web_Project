/**
 * ========================================
 * CÔNG CỤ QUẢN LÝ TỒN KHO ADMIN
 * ========================================
 * Copy toàn bộ file này và paste vào Console của trang Admin
 */

// ===== 1. CẬP NHẬT TỒN KHO 100 CHO TẤT CẢ SẢN PHẨM =====
function setAllInventoryTo100() {
    let inv = JSON.parse(localStorage.getItem('admin_inventory')) || [];
    
    if (inv.length === 0) {
        console.log('⚠️ Chưa có sản phẩm nào trong inventory!');
        console.log('💡 Hãy vào admin, refresh lại trang để tự động import sản phẩm');
        return;
    }
    
    inv.forEach(item => {
        item.quantity = 100;
    });
    
    localStorage.setItem('admin_inventory', JSON.stringify(inv));
    
    console.log(`✅ Đã cập nhật ${inv.length} sản phẩm lên 100 đơn vị!`);
    console.log('🔄 Refresh trang admin để thấy thay đổi');
    
    return inv;
}

// ===== 2. XEM TẤT CẢ TỒN KHO (KÈM BỘ LỌC) =====
function viewInventory(filter = null) {
    const inv = JSON.parse(localStorage.getItem('admin_inventory')) || [];
    
    if (inv.length === 0) {
        console.log('❌ Inventory trống!');
        return [];
    }
    
    let filtered = inv;
    
    if (filter) {
        filtered = inv.filter(item => {
            if (filter.type) {
                return item.type === filter.type.toUpperCase();
            }
            if (filter.lowStock) {
                return item.quantity < filter.lowStock;
            }
            if (filter.productId) {
                return item.productId === filter.productId;
            }
            return true;
        });
    }
    
    console.log(`📦 TỒN KHO (${filtered.length} sản phẩm):`);
    console.table(filtered);
    
    return filtered;
}

// ===== 3. CẬP NHẬT TỒN KHO THEO LOẠI =====
function setInventoryByType(type, quantity) {
    let inv = JSON.parse(localStorage.getItem('admin_inventory')) || [];
    
    const updated = inv.filter(item => item.type === type.toUpperCase());
    
    if (updated.length === 0) {
        console.log(`❌ Không tìm thấy sản phẩm loại "${type}"`);
        return;
    }
    
    updated.forEach(item => {
        item.quantity = quantity;
    });
    
    localStorage.setItem('admin_inventory', JSON.stringify(inv));
    
    console.log(`✅ Đã cập nhật ${updated.length} sản phẩm loại "${type}" lên ${quantity}`);
    console.log('🔄 Refresh trang admin để thấy thay đổi');
}

// ===== 4. TẠO PHIẾU NHẬP HÀNG NHANH =====
function quickImport(productId, quantity, price) {
    const inv = JSON.parse(localStorage.getItem('admin_inventory')) || [];
    const item = inv.find(i => Number(i.productId) === Number(productId));
    
    if (!item) {
        console.log(`❌ Không tìm thấy sản phẩm ID ${productId}`);
        return;
    }
    
    // Tăng tồn kho
    item.quantity = (item.quantity || 0) + quantity;
    localStorage.setItem('admin_inventory', JSON.stringify(inv));
    
    // Tạo phiếu nhập
    const imports = JSON.parse(localStorage.getItem('admin_imports')) || [];
    const newImportId = 'PN' + String(imports.length + 1).padStart(3, '0');
    
    imports.push({
        id: newImportId,
        date: new Date().toLocaleDateString('vi-VN'),
        productId: Number(productId),
        productName: item.productName,
        price: price || 0,
        qty: quantity,
        completed: true
    });
    
    localStorage.setItem('admin_imports', JSON.stringify(imports));
    
    console.log(`✅ Đã nhập ${quantity} ${item.productName}`);
    console.log(`   Tồn kho mới: ${item.quantity}`);
    console.log(`   Phiếu nhập: ${newImportId}`);
    console.log('🔄 Refresh trang admin để thấy thay đổi');
}

// ===== 5. XEM THỐNG KÊ TỒN KHO =====
function inventoryStats() {
    const inv = JSON.parse(localStorage.getItem('admin_inventory')) || [];
    
    const stats = {
        total: inv.length,
        totalQuantity: inv.reduce((sum, i) => sum + (i.quantity || 0), 0),
        outOfStock: inv.filter(i => i.quantity === 0).length,
        lowStock: inv.filter(i => i.quantity > 0 && i.quantity < 10).length,
        inStock: inv.filter(i => i.quantity >= 10).length,
        byType: {}
    };
    
    inv.forEach(item => {
        if (!stats.byType[item.type]) {
            stats.byType[item.type] = { count: 0, totalQty: 0 };
        }
        stats.byType[item.type].count++;
        stats.byType[item.type].totalQty += item.quantity || 0;
    });
    
    console.log('📊 THỐNG KÊ TỒN KHO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Tổng sản phẩm:      ${stats.total}`);
    console.log(`Tổng số lượng:      ${stats.totalQuantity}`);
    console.log(`Hết hàng:           ${stats.outOfStock} (${((stats.outOfStock/stats.total)*100).toFixed(1)}%)`);
    console.log(`Sắp hết (<10):      ${stats.lowStock} (${((stats.lowStock/stats.total)*100).toFixed(1)}%)`);
    console.log(`Còn hàng (≥10):     ${stats.inStock} (${((stats.inStock/stats.total)*100).toFixed(1)}%)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 THEO LOẠI:');
    console.table(stats.byType);
    
    return stats;
}

// ===== MENU HƯỚNG DẪN =====
console.log(`
╔════════════════════════════════════════════════════════════════╗
║          🛠️  CÔNG CỤ QUẢN LÝ TỒN KHO ADMIN                    ║
╚════════════════════════════════════════════════════════════════╝

📌 CÁC LỆNH CƠ BẢN:

1️⃣  setAllInventoryTo100()
   → Cập nhật TẤT CẢ sản phẩm lên 100 đơn vị
   ⭐ DÙNG LỆNH NÀY ĐỂ SET TỒN KHO 100!

2️⃣  viewInventory()
   → Xem toàn bộ tồn kho dạng bảng
   
3️⃣  viewInventory({ type: 'CPU' })
   → Xem tồn kho theo loại (CPU, VGA, RAM, CASE, MONITOR, PC, GEAR)
   
4️⃣  viewInventory({ lowStock: 10 })
   → Xem sản phẩm sắp hết (<10)
   
5️⃣  inventoryStats()
   → Xem thống kê chi tiết

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 CÁC LỆNH NÂNG CAO:

6️⃣  setInventoryByType('CPU', 50)
   → Set tất cả CPU lên 50

7️⃣  quickImport(101, 20, 5000000)
   → Nhập 20 sản phẩm ID 101, giá 5 triệu
   → Tự động tạo phiếu nhập + tăng tồn kho

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 HƯỚNG DẪN NHANH:

Bước 1: Paste toàn bộ file này vào Console
Bước 2: Chạy lệnh: setAllInventoryTo100()
Bước 3: Refresh trang admin (F5)
Bước 4: Vào "Tồn kho" → Thấy tất cả = 100

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
