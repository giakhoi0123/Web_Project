// =========================================
// SCRIPT XÓA DỮ LIỆU DEMO/CŨ - ADMIN
// =========================================
// Copy toàn bộ script này vào Console (F12) trong trang admin
// Sau đó chạy: clearAdminData();

function clearAdminData() {
    console.log('🗑️ Bắt đầu xóa dữ liệu...');
    
    // Xóa các data admin (giữ lại products vì sẽ tự import)
    const keysToRemove = [
        'admin_imports',      // Phiếu nhập
        'admin_inventory',    // Tồn kho
        'admin_orders',       // Đơn hàng
        'admin_pricing',      // Định giá
        'admin_revenue',      // Doanh thu
        'admin_products_synced' // Flag sync products
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`✅ Đã xóa: ${key}`);
    });
    
    console.log('✅ Xóa xong! Reload trang...');
    
    // Reload trang
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// =========================================
// HƯỚNG DẪN SỬ DỤNG
// =========================================
console.log(`
╔═══════════════════════════════════════════════════╗
║   🗑️  XÓA DỮ LIỆU DEMO/CŨ - ADMIN               ║
╚═══════════════════════════════════════════════════╝

CÁCH DÙNG:
1. Copy toàn bộ file này
2. Mở trang admin: http://localhost:8000/admin/admin.html
3. Mở Console (F12)
4. Paste toàn bộ code vào Console → Enter
5. Chạy lệnh: clearAdminData()
6. Trang sẽ tự động reload

SAU KHI CLEAR:
- Phiếu nhập: 0
- Tồn kho: 0
- Đơn hàng: 0
- Doanh thu: 0
- Sản phẩm: Tự động import từ products.js

BƯỚC TIẾP THEO:
1. Login admin lại (admin / admin123)
2. Set tồn kho: Dùng admin-inventory-tool.js
   - setAllInventoryTo100()
3. Bắt đầu test!
`);

console.log('✅ Script đã load. Gõ: clearAdminData() để xóa dữ liệu');
