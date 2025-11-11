/**
 * Script helper để test tính năng tồn kho
 * Mở Console trong Chrome DevTools và paste script này
 */

// === 1. Xem tồn kho tất cả sản phẩm ===
function viewAllInventory() {
  const inv = JSON.parse(localStorage.getItem('admin_inventory')) || [];
  console.log('📦 DANH SÁCH TỒN KHO:');
  console.table(inv);
  return inv;
}

// === 2. Xem tồn kho của 1 sản phẩm ===
function checkStock(productId) {
  const inv = JSON.parse(localStorage.getItem('admin_inventory')) || [];
  const item = inv.find(i => Number(i.productId) === Number(productId));
  if (item) {
    console.log(`✅ Sản phẩm ID ${productId} - ${item.productName}:`);
    console.log(`   Tồn kho: ${item.quantity}`);
    console.log(`   Loại: ${item.type}`);
  } else {
    console.log(`❌ Không tìm thấy sản phẩm ID ${productId} trong kho`);
  }
  return item;
}

// === 3. Set tồn kho cho 1 sản phẩm ===
function setStock(productId, quantity) {
  let inv = JSON.parse(localStorage.getItem('admin_inventory')) || [];
  let item = inv.find(i => Number(i.productId) === Number(productId));
  
  if (!item) {
    // Tạo mới nếu chưa có
    console.log(`⚠️ Sản phẩm ID ${productId} chưa có trong kho. Tạo mới...`);
    item = {
      productId: Number(productId),
      productName: `Sản phẩm #${productId}`,
      type: 'UNKNOWN',
      quantity: quantity
    };
    inv.push(item);
  } else {
    item.quantity = quantity;
  }
  
  localStorage.setItem('admin_inventory', JSON.stringify(inv));
  console.log(`✅ Đã set sản phẩm ID ${productId} = ${quantity}`);
  return item;
}

// === 4. Tạo dữ liệu test: 10 sản phẩm phổ biến ===
function setupTestData() {
  const testProducts = [
    { id: 101, name: "Intel Core i9-14900K", type: "CPU", qty: 15 },
    { id: 102, name: "AMD Ryzen 9 7950X3D", type: "CPU", qty: 8 },
    { id: 201, name: "NVIDIA RTX 4090", type: "VGA", qty: 5 },
    { id: 202, name: "NVIDIA RTX 4080", type: "VGA", qty: 12 },
    { id: 301, name: "G.Skill Trident Z5 32GB", type: "RAM", qty: 25 },
    { id: 302, name: "Corsair Vengeance 16GB", type: "RAM", qty: 30 },
    { id: 401, name: "Lian Li O11 Dynamic", type: "CASE", qty: 10 },
    { id: 501, name: "LG UltraGear 27\" 240Hz", type: "MONITOR", qty: 7 },
    { id: 701, name: "PC Gaming Starter E1", type: "PC", qty: 3 },
    { id: 601, name: "Logitech G Pro X", type: "GEAR", qty: 20 }
  ];
  
  let inv = JSON.parse(localStorage.getItem('admin_inventory')) || [];
  
  testProducts.forEach(p => {
    let item = inv.find(i => Number(i.productId) === p.id);
    if (!item) {
      inv.push({
        productId: p.id,
        productName: p.name,
        type: p.type,
        quantity: p.qty
      });
    } else {
      item.quantity = p.qty;
      item.productName = p.name;
      item.type = p.type;
    }
  });
  
  localStorage.setItem('admin_inventory', JSON.stringify(inv));
  console.log('✅ Đã tạo dữ liệu test cho 10 sản phẩm:');
  console.table(inv.filter(i => testProducts.some(p => p.id === i.productId)));
}

// === 5. Test kịch bản: Sản phẩm sắp hết (chỉ còn 2) ===
function testLowStock() {
  setStock(101, 2); // Intel i9 chỉ còn 2
  console.log('🧪 TEST: Đã set CPU Intel i9 (ID 101) còn 2 sản phẩm');
  console.log('📋 Hướng dẫn test:');
  console.log('   1. Vào trang chi tiết: main/index.html#product/101');
  console.log('   2. Trạng thái phải hiện: "⚠️ Chỉ còn 2 sản phẩm" (màu cam)');
  console.log('   3. Thử tăng số lượng lên 3 → Bị chặn');
  console.log('   4. Thêm 2 vào giỏ → OK');
  console.log('   5. Thử thêm thêm 1 nữa → Bị chặn');
}

// === 6. Test kịch bản: Hết hàng ===
function testOutOfStock() {
  setStock(102, 0); // AMD Ryzen hết hàng
  console.log('🧪 TEST: Đã set CPU AMD Ryzen (ID 102) HẾT HÀNG');
  console.log('📋 Hướng dẫn test:');
  console.log('   1. Vào trang chi tiết: main/index.html#product/102');
  console.log('   2. Trạng thái phải hiện: "❌ Hết hàng" (màu đỏ)');
  console.log('   3. Click "Thêm giỏ" → Popup "Sản phẩm đã hết hàng"');
  console.log('   4. Click "Mua ngay" → Popup "Sản phẩm đã hết hàng"');
}

// === 7. Reset tất cả về 0 ===
function resetAllStock() {
  let inv = JSON.parse(localStorage.getItem('admin_inventory')) || [];
  inv.forEach(item => item.quantity = 0);
  localStorage.setItem('admin_inventory', JSON.stringify(inv));
  console.log('⚠️ Đã reset TẤT CẢ tồn kho về 0');
}

// === 8. Xóa toàn bộ inventory ===
function clearInventory() {
  localStorage.removeItem('admin_inventory');
  console.log('🗑️ Đã xóa toàn bộ dữ liệu inventory');
}

// === HƯỚNG DẪN SỬ DỤNG ===
console.log(`
╔════════════════════════════════════════════════════════╗
║   📦 SCRIPT TEST TỒN KHO - HƯỚNG DẪN SỬ DỤNG          ║
╚════════════════════════════════════════════════════════╝

Các lệnh có sẵn:

1️⃣  viewAllInventory()
   → Xem tất cả tồn kho (dạng bảng)

2️⃣  checkStock(productId)
   → Xem tồn kho của 1 sản phẩm
   VD: checkStock(101)

3️⃣  setStock(productId, quantity)
   → Set tồn kho cho 1 sản phẩm
   VD: setStock(101, 5)

4️⃣  setupTestData()
   → Tạo dữ liệu test cho 10 sản phẩm phổ biến

5️⃣  testLowStock()
   → Test kịch bản: CPU còn 2 sản phẩm

6️⃣  testOutOfStock()
   → Test kịch bản: CPU hết hàng

7️⃣  resetAllStock()
   → Reset tất cả về 0

8️⃣  clearInventory()
   → Xóa toàn bộ inventory

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Quick Start:
   setupTestData()  ← Chạy lệnh này trước!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
