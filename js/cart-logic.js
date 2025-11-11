// ==================================================
//      LOGIC GIỎ HÀNG DÙNG CHUNG
// ==================================================

const cartCounter = document.getElementById('cart-counter');

/**
 * Chú thích: Hiển thị một popup thông báo nhỏ.
 */
function showPopup(message, duration = 2000) {
    const popup = document.createElement('div');
    popup.className = 'cart-popup';
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => { popup.classList.add('show'); }, 10);

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => { document.body.removeChild(popup); }, 500);
    }, duration);
}

/**
 * Chú thích: Lấy dữ liệu giỏ hàng của người dùng đang đăng nhập.
 * Mỗi người dùng sẽ có một giỏ hàng riêng, được lưu theo email.
 * @returns {Array} - Mảng các sản phẩm trong giỏ, hoặc mảng rỗng.
 */
function getCart() {
    const user = getLoggedInUser();
    if (!user) return []; // Nếu không có user, trả về giỏ hàng rỗng
    const userCartKey = `cart_${user.email}`;
    return JSON.parse(localStorage.getItem(userCartKey)) || [];
}

/**
 * Chú thích: Lưu lại dữ liệu giỏ hàng cho người dùng hiện tại.
 * @param {Array} cart - Mảng giỏ hàng cần lưu.
 */
function saveCart(cart) {
    const user = getLoggedInUser();
    if (!user) return; // Không lưu nếu không có user
    const userCartKey = `cart_${user.email}`;
    localStorage.setItem(userCartKey, JSON.stringify(cart));
    updateCartCounter();
}

/**
 * Chú thích: Hàm chính để thêm một sản phẩm vào giỏ hàng.
 * YÊU CẦU ĐĂNG NHẬP.
 * @param {string|number} productId - ID của sản phẩm cần thêm.
 */
function addToCart(productId) {
    // --- KIỂM TRA ĐĂNG NHẬP ---
    if (!isUserLoggedIn()) {
        showPopup('Vui lòng đăng nhập để mua hàng!', 2500);
        setTimeout(() => {
            window.location.href = '../login/index.html';
        }, 2500);
        return; // Dừng hàm tại đây
    }
    // -------------------------

    const cart = getCart();
    const numericProductId = parseInt(productId, 10);

    // Kiểm tra tồn kho
    const adminInventory = JSON.parse(localStorage.getItem('admin_inventory')) || [];
    const inventoryItem = adminInventory.find(inv => Number(inv.productId) === numericProductId);
    const availableStock = inventoryItem ? inventoryItem.quantity : 0;
    
    if (availableStock <= 0) {
        showPopup('❌ Sản phẩm này hiện đã hết hàng!', 2500);
        return;
    }

    const existingProduct = cart.find(item => item.id === numericProductId);
    const currentQty = existingProduct ? existingProduct.quantity : 0;
    
    if (currentQty >= availableStock) {
        showPopup(`⚠️ Chỉ còn ${availableStock} sản phẩm trong kho!`, 2500);
        return;
    }

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id: numericProductId, quantity: 1 });
    }

    saveCart(cart);
    showPopup('✅ Đã thêm vào giỏ hàng!');
}

/**
 * Chú thích: Cập nhật con số trên icon giỏ hàng ở header.
 */
function updateCartCounter() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCounter) {
        cartCounter.textContent = totalItems;
    }
}

// Cập nhật bộ đếm khi trang tải.
document.addEventListener('DOMContentLoaded', updateCartCounter);