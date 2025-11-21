// ===== DATA STORAGE =====
// Load users from localStorage, or initialize with default users ONLY if none exist
let users = JSON.parse(localStorage.getItem('admin_users'));
if (!users || users.length === 0) {
    users = [
        { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", phone: "0901234567", password: "123456", active: true },
        { id: 2, name: "Trần Thị B", email: "tranthib@gmail.com", phone: "0912345678", password: "123456", active: true },
        { id: 3, name: "Lê Văn C", email: "levanc@gmail.com", phone: "0923456789", password: "123456", active: false },
    ];
    localStorage.setItem('admin_users', JSON.stringify(users));
}

let categories = JSON.parse(localStorage.getItem('admin_categories')) || [
    { id: "CPU", name: "CPU - Bộ vi xử lý", description: "Bộ vi xử lý máy tính", active: true },
    { id: "VGA", name: "VGA - Card đồ họa", description: "Card đồ họa rời", active: true },
    { id: "RAM", name: "RAM - Bộ nhớ", description: "Bộ nhớ trong máy tính", active: true },
    { id: "CASE", name: "Case - Vỏ máy tính", description: "Vỏ case máy tính", active: true },
    { id: "MONITOR", name: "Monitor - Màn hình", description: "Màn hình máy tính", active: true },
    { id: "PC", name: "PC - Máy tính", description: "Máy tính đã build sẵn", active: true },
    { id: "GEAR", name: "Gear - Phụ kiện", description: "Phụ kiện gaming", active: true },
];

// Import sản phẩm từ products.js nếu chưa có hoặc đã cũ
function syncProductsFromMainSite() {
    // Kiểm tra xem có products từ products.js không
    if (typeof products === 'undefined' || !Array.isArray(products)) {
        console.warn('Không tìm thấy products.js hoặc biến products không hợp lệ');
        return;
    }
    
    const syncFlag = localStorage.getItem('admin_products_synced');
    const currentProductsJson = JSON.stringify(products);
    
    // Nếu chưa sync hoặc products đã thay đổi, import lại
    if (!syncFlag || syncFlag !== currentProductsJson) {
        const adminProducts = products.map(p => ({
            id: p.id,
            type: (p.category || 'OTHER').toUpperCase(),
            code: `P${p.id}`,
            name: p.name,
            image: p.image,
            desc: p.specs ? Object.values(p.specs).join(', ') : '',
            active: true
        }));
        
        localStorage.setItem('admin_products', JSON.stringify(adminProducts));
        localStorage.setItem('admin_products_synced', currentProductsJson);
        console.log(`✅ Đã import ${adminProducts.length} sản phẩm từ products.js vào admin storage`);
        
        // Đồng bộ inventory: tạo record cho mỗi sản phẩm nếu chưa có
        const existingInventory = JSON.parse(localStorage.getItem('admin_inventory')) || [];
        const inventoryMap = {};
        existingInventory.forEach(inv => {
            inventoryMap[inv.productId] = inv;
        });
        
        adminProducts.forEach(p => {
            if (!inventoryMap[p.id]) {
                inventoryMap[p.id] = {
                    productId: p.id,
                    productName: p.name,
                    type: p.type,
                    quantity: 0
                };
            }
        });
        
        localStorage.setItem('admin_inventory', JSON.stringify(Object.values(inventoryMap)));
    }
}

// Gọi sync khi load admin
syncProductsFromMainSite();

let products_admin = JSON.parse(localStorage.getItem('admin_products')) || [];

let imports = JSON.parse(localStorage.getItem('admin_imports')) || [];

let pricing = JSON.parse(localStorage.getItem('admin_pricing')) || [];

let orders = JSON.parse(localStorage.getItem('admin_orders')) || [];

let inventory = JSON.parse(localStorage.getItem('admin_inventory')) || [];

// Editing states
let editingUserId = null;
let editingCategoryId = null;
let editingProductId = null;
let editingImportId = null;
let editingPricingId = null;

// ===== UTILITY FUNCTIONS =====
function saveData() {
    localStorage.setItem('admin_users', JSON.stringify(users));
    localStorage.setItem('admin_categories', JSON.stringify(categories));
    localStorage.setItem('admin_products', JSON.stringify(products_admin));
    localStorage.setItem('admin_imports', JSON.stringify(imports));
    localStorage.setItem('admin_pricing', JSON.stringify(pricing));
    localStorage.setItem('admin_orders', JSON.stringify(orders));
    localStorage.setItem('admin_inventory', JSON.stringify(inventory));
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'success') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== LOGIN =====
function loginAdmin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    
    if (username === 'admin' && password === 'admin123') {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('adminPage').classList.remove('hidden');
        loadDashboard();
        showNotification('Đăng nhập thành công!', 'success');
        
        // Bắt đầu auto-refresh để cập nhật đơn hàng realtime
        startAutoRefresh();
    } else {
        showNotification('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
    }
}

function logoutAdmin() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        // Dừng auto-refresh
        stopAutoRefresh();
        
        document.getElementById('adminPage').classList.add('hidden');
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';
        showNotification('Đã đăng xuất!', 'info');
    }
}

// ===== AUTO REFRESH - CẬP NHẬT REALTIME =====
let autoRefreshInterval = null;
let lastOrderCount = 0;
let lastUserCount = 0;
let lastProductCount = 0;

function startAutoRefresh() {
    lastOrderCount = orders.length;
    lastUserCount = users.length;
    lastProductCount = products_admin.length;
    
    // Refresh mỗi 3 giây
    autoRefreshInterval = setInterval(() => {
        let hasChanges = false;
        let notifications = [];
        
        // 1. Kiểm tra đơn hàng mới
        const newOrders = JSON.parse(localStorage.getItem('admin_orders')) || [];
        if (newOrders.length > lastOrderCount) {
            const diff = newOrders.length - lastOrderCount;
            notifications.push(`📦 ${diff} đơn hàng mới`);
            orders = newOrders;
            lastOrderCount = newOrders.length;
            hasChanges = true;
        }
        
        // 2. Kiểm tra user thay đổi (thêm/sửa/xóa)
        const newUsers = JSON.parse(localStorage.getItem('admin_users')) || [];
        if (newUsers.length !== lastUserCount) {
            const diff = newUsers.length - lastUserCount;
            if (diff > 0) {
                notifications.push(`👤 ${diff} người dùng mới`);
            } else {
                notifications.push(`�️ ${Math.abs(diff)} người dùng bị xóa`);
            }
            users = newUsers;
            lastUserCount = newUsers.length;
            hasChanges = true;
        }
        
        // 3. Kiểm tra product thay đổi
        const newProducts = JSON.parse(localStorage.getItem('admin_products')) || [];
        if (newProducts.length !== lastProductCount) {
            const diff = newProducts.length - lastProductCount;
            if (diff > 0) {
                notifications.push(`📦 ${diff} sản phẩm mới`);
            } else {
                notifications.push(`🗑️ ${Math.abs(diff)} sản phẩm bị xóa`);
            }
            products_admin = newProducts;
            lastProductCount = newProducts.length;
            hasChanges = true;
        }
        
        // Hiển thị thông báo và refresh view
        if (hasChanges) {
            showNotification(`🔔 ${notifications.join(' • ')}`, 'info');
            
            // Auto-refresh view hiện tại
            const currentSection = document.querySelector('.section.active');
            if (currentSection) {
                const sectionId = currentSection.id;
                if (sectionId === 'dashboard') {
                    loadDashboard();
                } else if (sectionId === 'orders') {
                    renderOrders();
                } else if (sectionId === 'users') {
                    renderUsers();
                } else if (sectionId === 'products') {
                    renderProducts();
                }
            }
        }
    }, 3000); // 3 giây
    
    console.log('✅ Realtime sync: Orders • Users • Products (mỗi 3s)');
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
        console.log('❌ Auto-refresh đã tắt');
    }
}

// ===== NAVIGATION =====
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update menu
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        users: 'Quản lý người dùng',
        categories: 'Quản lý loại sản phẩm',
        products: 'Quản lý danh mục sản phẩm',
        imports: 'Quản lý nhập sản phẩm',
        pricing: 'Quản lý giá bán',
        orders: 'Quản lý đơn hàng',
        inventory: 'Quản lý tồn kho'
    };
    document.getElementById('pageTitle').textContent = titles[sectionId] || 'Dashboard';
    
    // Load data
    if (sectionId === 'dashboard') loadDashboard();
    if (sectionId === 'users') renderUsers();
    if (sectionId === 'categories') renderCategories();
    if (sectionId === 'products') renderProducts();
    if (sectionId === 'imports') renderImports();
    if (sectionId === 'pricing') renderPricing();
    if (sectionId === 'orders') renderOrders();
    if (sectionId === 'inventory') renderInventory();
}

// ===== DASHBOARD =====
function loadDashboard() {
    // Reload data từ localStorage để đảm bảo có dữ liệu mới nhất
    users = JSON.parse(localStorage.getItem('admin_users')) || users;
    orders = JSON.parse(localStorage.getItem('admin_orders')) || orders;
    inventory = JSON.parse(localStorage.getItem('admin_inventory')) || inventory;
    const revenue = JSON.parse(localStorage.getItem('admin_revenue')) || { total: 0, byDate: {}, byMonth: {}, byYear: {} };
    
    // Update stats
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalProducts').textContent = products_admin.length;
    document.getElementById('totalOrders').textContent = orders.length;
    
    // Hiển thị tổng doanh thu từ revenue tracking
    document.getElementById('totalRevenue').textContent = formatCurrency(revenue.total);
    
    // Recent orders
    const tbody = document.getElementById('recentOrdersTable');
    tbody.innerHTML = '';
    
    const recentOrders = orders.slice(-5).reverse();
    
    if (recentOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Chưa có đơn hàng nào</td></tr>';
    } else {
        recentOrders.forEach(o => {
            const statusClass = {
                'Mới đặt': 'badge-info',
                'Đá xử lý': 'badge-warning',
                'Đã giao': 'badge-success',
                'Hủy': 'badge-danger'
            }[o.status];
            
            tbody.innerHTML += `
                <tr>
                    <td>${o.id}</td>
                    <td>${o.date}</td>
                    <td>${o.customer}</td>
                    <td>${formatCurrency(o.total)}</td>
                    <td><span class="badge ${statusClass}">${o.status}</span></td>
                </tr>
            `;
        });
    }
}

// ===== USERS =====
function renderUsers() {
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = '';
    
    users.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.phone || 'Chưa cập nhật'}</td>
                <td><span class="badge ${u.active ? 'badge-success' : 'badge-danger'}">${u.active ? 'Hoạt động' : 'Khóa'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editUser(${u.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="resetPassword(${u.id})">
                        <i class="fas fa-key"></i> Reset
                    </button>
                    <button class="btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}" onclick="toggleUserLock(${u.id})">
                        <i class="fas fa-${u.active ? 'lock' : 'unlock'}"></i> ${u.active ? 'Khóa' : 'Mở'}
                    </button>
                </td>
            </tr>
        `;
    });
}

function openUserModal() {
    editingUserId = null;
    document.getElementById('userModalTitle').textContent = 'Thêm người dùng';
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userPhone').value = '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userModal').classList.add('show');
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('show');
}

function saveUser() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const password = document.getElementById('userPassword').value.trim();
    
    if (!name || !email || !password) {
        showNotification('Vui lòng nhập đầy đủ thông tin bắt buộc!', 'error');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        showNotification('❌ Email không hợp lệ! Vui lòng nhập đúng định dạng (vd: example@domain.com)', 'error');
        return;
    }
    
    if (editingUserId) {
        const user = users.find(u => u.id === editingUserId);
        user.name = name;
        user.email = email;
        user.phone = phone;
        if (password) user.password = password;
        showNotification('Cập nhật người dùng thành công!', 'success');
    } else {
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push({ 
            id: newId, 
            name, 
            email, 
            phone, 
            address: "", // Thêm field address
            password, 
            active: true 
        });
        showNotification('Thêm người dùng thành công!', 'success');
    }
    
    saveData();
    closeUserModal();
    renderUsers();
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    editingUserId = id;
    document.getElementById('userModalTitle').textContent = 'Sửa người dùng';
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPhone').value = user.phone || '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userModal').classList.add('show');
}

function resetPassword(id) {
    if (confirm('Đặt lại mật khẩu thành "123456"?')) {
        const user = users.find(u => u.id === id);
        user.password = '123456';
        saveData();
        showNotification(`Đã reset mật khẩu cho ${user.name}`, 'success');
    }
}

function toggleUserLock(id) {
    const user = users.find(u => u.id === id);
    user.active = !user.active;
    saveData();
    renderUsers();
    showNotification(`Đã ${user.active ? 'mở khóa' : 'khóa'} tài khoản ${user.name}`, 'success');
}

// ===== CATEGORIES =====
function renderCategories() {
    const tbody = document.getElementById('categoriesTable');
    tbody.innerHTML = '';
    
    categories.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.description}</td>
                <td><span class="badge ${c.active ? 'badge-success' : 'badge-danger'}">${c.active ? 'Hiển thị' : 'Ẩn'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editCategory('${c.id}')">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn btn-sm ${c.active ? 'btn-danger' : 'btn-success'}" onclick="toggleCategory('${c.id}')">
                        <i class="fas fa-eye${c.active ? '-slash' : ''}"></i> ${c.active ? 'Ẩn' : 'Hiện'}
                    </button>
                </td>
            </tr>
        `;
    });
}

function openCategoryModal() {
    editingCategoryId = null;
    document.getElementById('categoryModalTitle').textContent = 'Thêm loại sản phẩm';
    document.getElementById('categoryCode').value = '';
    document.getElementById('categoryCode').readOnly = false;
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryDesc').value = '';
    document.getElementById('categoryModal').classList.add('show');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('show');
}

function saveCategory() {
    const code = document.getElementById('categoryCode').value.trim();
    const name = document.getElementById('categoryName').value.trim();
    const desc = document.getElementById('categoryDesc').value.trim();
    
    if (!code || !name) {
        showNotification('Vui lòng nhập mã và tên loại sản phẩm!', 'error');
        return;
    }
    
    if (editingCategoryId) {
        const cat = categories.find(c => c.id === editingCategoryId);
        cat.name = name;
        cat.description = desc;
        showNotification('Cập nhật loại sản phẩm thành công!', 'success');
    } else {
        if (categories.find(c => c.id === code)) {
            showNotification('Mã loại đã tồn tại!', 'error');
            return;
        }
        categories.push({ id: code, name, description: desc, active: true });
        showNotification('Thêm loại sản phẩm thành công!', 'success');
    }
    
    saveData();
    closeCategoryModal();
    renderCategories();
    updateCategoryFilters();
}

function editCategory(id) {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    
    editingCategoryId = id;
    document.getElementById('categoryModalTitle').textContent = 'Sửa loại sản phẩm';
    document.getElementById('categoryCode').value = cat.id;
    document.getElementById('categoryCode').readOnly = true;
    document.getElementById('categoryName').value = cat.name;
    document.getElementById('categoryDesc').value = cat.description;
    document.getElementById('categoryModal').classList.add('show');
}

function toggleCategory(id) {
    const cat = categories.find(c => c.id === id);
    cat.active = !cat.active;
    saveData();
    renderCategories();
    showNotification(`Đã ${cat.active ? 'hiện' : 'ẩn'} loại ${cat.name}`, 'success');
}

function updateCategoryFilters() {
    // Update filters in product section
    const filterSelect = document.getElementById('filterProductType');
    const productTypeSelect = document.getElementById('productType');
    const pricingTypeSelect = document.getElementById('pricingType');
    
    [filterSelect, productTypeSelect, pricingTypeSelect].forEach(select => {
        if (!select) return;
        const currentValue = select.value;
        select.innerHTML = '<option value="">Chọn loại</option>';
        categories.filter(c => c.active).forEach(c => {
            select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
        });
        select.value = currentValue;
    });
}

// ===== PRODUCTS =====
function renderProducts() {
    const tbody = document.getElementById('productsTable');
    const search = document.getElementById('searchProduct').value.toLowerCase();
    const typeFilter = document.getElementById('filterProductType').value;
    
    tbody.innerHTML = '';
    
    const filtered = products_admin.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search) || p.code.toLowerCase().includes(search);
        const matchType = !typeFilter || p.type === typeFilter;
        return matchSearch && matchType;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Không tìm thấy sản phẩm nào</td></tr>';
        return;
    }
    
    filtered.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.type}</td>
                <td>${p.code}</td>
                <td>${p.name}</td>
                <td><img src="${p.image}" alt="${p.name}" onerror="this.src='../img/no-image.png'"></td>
                <td>${p.desc || 'Chưa có mô tả'}</td>
                <td><span class="badge ${p.active ? 'badge-success' : 'badge-danger'}">${p.active ? 'Hiển thị' : 'Ẩn'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editProduct(${p.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm ${p.active ? 'btn-danger' : 'btn-success'}" onclick="toggleProduct(${p.id})">
                        <i class="fas fa-eye${p.active ? '-slash' : ''}"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// ===== IMAGE UTILITIES =====
function handleFileSelection(input) {
    const file = input.files[0];
    const label = document.getElementById('fileUploadLabel');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const selectedFileName = document.getElementById('selectedFileName');
    
    if (file) {
        // Update label text and style
        label.innerHTML = `<i class="fas fa-check-circle"></i> ${file.name}`;
        
        // Show file name in separate display
        selectedFileName.textContent = file.name;
        fileNameDisplay.style.display = 'flex';
    } else {
        // Reset to default
        label.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Chọn file ảnh (JPG, PNG, GIF, tối đa 5MB)';
        fileNameDisplay.style.display = 'none';
    }
}

function validateImageFile(file) {
    // Check file type
    if (!file.type.startsWith('image/')) {
        showNotification('❌ Vui lòng chọn file hình ảnh hợp lệ!', 'error');
        return false;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        showNotification('❌ Kích thước hình ảnh không được vượt quá 5MB!', 'error');
        return false;
    }
    
    return true;
}

function compressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with compression
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                
                // Calculate compression ratio
                const originalSize = (file.size / 1024).toFixed(2);
                const compressedSize = ((compressedDataUrl.length * 0.75) / 1024).toFixed(2);
                
                console.log(`📦 Nén ảnh: ${originalSize}KB → ${compressedSize}KB (${Math.round((1 - compressedSize/originalSize) * 100)}% nhỏ hơn)`);
                
                resolve({
                    dataUrl: compressedDataUrl,
                    originalSize: originalSize,
                    compressedSize: compressedSize
                });
            };
            
            img.onerror = function() {
                reject(new Error('Không thể tải hình ảnh'));
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = function() {
            reject(new Error('Không thể đọc file'));
        };
        
        reader.readAsDataURL(file);
    });
}

function openProductModal() {
    editingProductId = null;
    document.getElementById('productModalTitle').textContent = 'Thêm sản phẩm';
    document.getElementById('productType').value = '';
    document.getElementById('productCode').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productImageFile').value = '';
    document.getElementById('productDesc').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    
    // Reset file upload label
    const label = document.getElementById('fileUploadLabel');
    label.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Chọn file ảnh (JPG, PNG, GIF, tối đa 5MB)';
    document.getElementById('fileNameDisplay').style.display = 'none';
    
    updateCategoryFilters();
    document.getElementById('productModal').classList.add('show');
    
    // Setup image preview listener with compression
    const fileInput = document.getElementById('productImageFile');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    fileInput.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file
        if (!validateImageFile(file)) {
            fileInput.value = '';
            return;
        }
        
        try {
            // Show loading indicator
            previewImg.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14">Đang tải...</text></svg>';
            preview.style.display = 'block';
            
            // Compress and show preview
            const compressed = await compressImage(file);
            previewImg.src = compressed.dataUrl;
            
            // Store compressed data in a custom property for later use
            fileInput.dataset.compressedImage = compressed.dataUrl;
            
            // Show file info
            showNotification(`✅ Đã nén và tải ảnh (${compressed.compressedSize}KB)`, 'success');
        } catch (error) {
            showNotification('❌ Lỗi khi xử lý hình ảnh: ' + error.message, 'error');
            fileInput.value = '';
            preview.style.display = 'none';
        }
    };
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('show');
}

function saveProduct() {
    const type = document.getElementById('productType').value;
    const code = document.getElementById('productCode').value.trim();
    const name = document.getElementById('productName').value.trim();
    const desc = document.getElementById('productDesc').value.trim();
    const fileInput = document.getElementById('productImageFile');
    
    if (!type || !code || !name) {
        showNotification('Vui lòng nhập đầy đủ thông tin bắt buộc!', 'error');
        return;
    }
    
    // Handle image upload
    const file = fileInput.files[0];
    if (!editingProductId && !file) {
        showNotification('Vui lòng chọn hình ảnh cho sản phẩm!', 'error');
        return;
    }
    
    function saveProductData(imagePath) {
        if (editingProductId) {
            const prod = products_admin.find(p => p.id === editingProductId);
            prod.type = type;
            prod.code = code;
            prod.name = name;
            if (imagePath) prod.image = imagePath;
            prod.desc = desc;
            showNotification('✅ Cập nhật sản phẩm thành công!', 'success');
        } else {
            const newId = products_admin.length > 0 ? Math.max(...products_admin.map(p => p.id)) + 1 : 1;
            const newProduct = { 
                id: newId, 
                type, 
                code, 
                name, 
                image: imagePath, 
                desc, 
                active: true 
            };
            products_admin.push(newProduct);
            
            // Sync to main site products.js format
            syncProductToMainSite(newProduct);
            showNotification('✅ Thêm sản phẩm thành công và đã đồng bộ lên trang bán hàng!', 'success');
        }
        
        saveData();
        closeProductModal();
        renderProducts();
    }
    
    if (file) {
        // Use compressed image if available, otherwise compress now
        if (fileInput.dataset.compressedImage) {
            // Use already compressed image from preview
            saveProductData(fileInput.dataset.compressedImage);
        } else {
            // Compress image before saving (fallback)
            compressImage(file).then(compressed => {
                saveProductData(compressed.dataUrl);
            }).catch(error => {
                showNotification('❌ Lỗi khi xử lý hình ảnh: ' + error.message, 'error');
            });
        }
    } else {
        // Edit without changing image
        saveProductData(null);
    }
}

// Sync new product to main site
function syncProductToMainSite(adminProduct) {
    // Map admin product to main site format
    const mainProduct = {
        id: adminProduct.id,
        name: adminProduct.name,
        price: "0", // Default price - admin should set via pricing module
        image: adminProduct.image,
        category: adminProduct.type.toLowerCase(),
        specs: {}
    };
    
    // Get existing products from main site
    let mainProducts = [];
    try {
        // Check if products array exists in the global scope (loaded from products.js)
        if (typeof products !== 'undefined') {
            mainProducts = [...products];
        }
    } catch (e) {
        console.log('Products array not found, creating new one');
    }
    
    // Add new product
    mainProducts.push(mainProduct);
    
    // Store in localStorage for main site to pick up
    localStorage.setItem('main_site_products', JSON.stringify(mainProducts));
    localStorage.setItem('products_updated', Date.now().toString());
}

function editProduct(id) {
    const prod = products_admin.find(p => p.id === id);
    if (!prod) return;
    
    editingProductId = id;
    document.getElementById('productModalTitle').textContent = 'Sửa sản phẩm';
    updateCategoryFilters();
    document.getElementById('productType').value = prod.type;
    document.getElementById('productCode').value = prod.code;
    document.getElementById('productName').value = prod.name;
    document.getElementById('productDesc').value = prod.desc;
    document.getElementById('productImageFile').value = '';
    
    // Show current image preview
    if (prod.image) {
        document.getElementById('previewImg').src = prod.image;
        document.getElementById('imagePreview').style.display = 'block';
    } else {
        document.getElementById('imagePreview').style.display = 'none';
    }
    
    document.getElementById('productModal').classList.add('show');
    
    // Setup image preview listener for edit mode with compression
    const fileInput = document.getElementById('productImageFile');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    fileInput.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file
        if (!validateImageFile(file)) {
            fileInput.value = '';
            return;
        }
        
        try {
            // Show loading indicator
            previewImg.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14">Đang tải...</text></svg>';
            preview.style.display = 'block';
            
            // Compress and show preview
            const compressed = await compressImage(file);
            previewImg.src = compressed.dataUrl;
            
            // Store compressed data for later use
            fileInput.dataset.compressedImage = compressed.dataUrl;
            
            showNotification(`✅ Đã nén và tải ảnh (${compressed.compressedSize}KB)`, 'success');
        } catch (error) {
            showNotification('❌ Lỗi khi xử lý hình ảnh: ' + error.message, 'error');
            fileInput.value = '';
            // Restore original image
            if (prod.image) {
                previewImg.src = prod.image;
            } else {
                preview.style.display = 'none';
            }
        }
    };
}

function toggleProduct(id) {
    const prod = products_admin.find(p => p.id === id);
    prod.active = !prod.active;
    saveData();
    renderProducts();
    showNotification(`Đã ${prod.active ? 'hiện' : 'ẩn'} sản phẩm`, 'success');
}

function deleteProduct(id) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        products_admin = products_admin.filter(p => p.id !== id);
        saveData();
        renderProducts();
        showNotification('Xóa sản phẩm thành công!', 'success');
    }
}

// ===== IMPORTS =====
function renderImports() {
    const tbody = document.getElementById('importsTable');
    const search = document.getElementById('searchImport').value.toLowerCase();
    const statusFilter = document.getElementById('filterImportStatus').value;
    
    tbody.innerHTML = '';
    
    const filtered = imports.filter(i => {
        // Kiểm tra xem có items không (phiếu mới) hoặc productName (phiếu cũ)
        let matchSearch = i.id.toLowerCase().includes(search);
        
        if (i.items && i.items.length > 0) {
            // Phiếu nhập mới (có nhiều sản phẩm)
            matchSearch = matchSearch || i.items.some(item => 
                item.productName.toLowerCase().includes(search)
            );
        } else if (i.productName) {
            // Phiếu nhập cũ (1 sản phẩm)
            matchSearch = matchSearch || i.productName.toLowerCase().includes(search);
        }
        
        const matchStatus = !statusFilter || (statusFilter === 'completed' && i.completed) || (statusFilter === 'pending' && !i.completed);
        return matchSearch && matchStatus;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Không tìm thấy phiếu nhập nào</td></tr>';
        return;
    }
    
    filtered.forEach(i => {
        // Xử lý cả phiếu cũ (1 sản phẩm) và phiếu mới (nhiều sản phẩm)
        if (i.items && i.items.length > 0) {
            // Phiếu nhập MỚI - Nhiều sản phẩm
            const totalItems = i.items.length;
            const grandTotal = i.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
            const productsList = i.items.map(item => item.productName).join(', ');
            const productsDisplay = totalItems > 2 
                ? `${i.items[0].productName} + ${totalItems - 1} SP khác` 
                : productsList;
            
            tbody.innerHTML += `
                <tr>
                    <td>${i.id}</td>
                    <td>${i.date}</td>
                    <td title="${productsList}">${productsDisplay}</td>
                    <td colspan="2" class="text-center">${totalItems} sản phẩm</td>
                    <td>${formatCurrency(grandTotal)}</td>
                    <td><span class="badge ${i.completed ? 'badge-success' : 'badge-warning'}">${i.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="viewImportDetail('${i.id}')" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="completeImport('${i.id}')" ${i.completed ? 'disabled' : ''} title="Hoàn thành">
                            <i class="fas fa-check"></i>
                        </button>
                    </td>
                </tr>
            `;
        } else {
            // Phiếu nhập CŨ - 1 sản phẩm (backward compatibility)
            const total = (i.price || 0) * (i.qty || 0);
            tbody.innerHTML += `
                <tr>
                    <td>${i.id}</td>
                    <td>${i.date}</td>
                    <td>${i.productName || 'N/A'}</td>
                    <td>${formatCurrency(i.price || 0)}</td>
                    <td>${i.qty || 0}</td>
                    <td>${formatCurrency(total)}</td>
                    <td><span class="badge ${i.completed ? 'badge-success' : 'badge-warning'}">${i.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editImport('${i.id}')" ${i.completed ? 'disabled' : ''}>
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="completeImport('${i.id}')" ${i.completed ? 'disabled' : ''}>
                            <i class="fas fa-check"></i> Hoàn thành
                        </button>
                    </td>
                </tr>
            `;
        }
    });
}

// ===== IMPORT MANAGEMENT (MULTI-PRODUCT) =====
let importProducts = []; // Mảng tạm chứa sản phẩm trong phiếu nhập hiện tại

function openImportModal() {
    editingImportId = null;
    importProducts = []; // Reset danh sách sản phẩm
    
    const newCode = 'PN' + String(imports.length + 1).padStart(3, '0');
    const today = new Date().toISOString().split('T')[0];
    
    document.getElementById('importModalTitle').textContent = 'Thêm phiếu nhập hàng';
    document.getElementById('importCode').value = newCode;
    document.getElementById('importDate').value = today;
    
    // Clear table
    document.getElementById('importProductsTable').innerHTML = '';
    document.getElementById('importGrandTotal').textContent = '0đ';
    
    // Thêm 1 dòng mặc định
    addImportRow();
    
    document.getElementById('importModal').classList.add('show');
}

function addImportRow() {
    const tableBody = document.getElementById('importProductsTable');
    const rowIndex = importProducts.length;
    
    // Thêm vào mảng tạm
    importProducts.push({
        productId: null,
        price: 0,
        qty: 0
    });
    
    // Tạo dropdown sản phẩm
    let productOptions = '<option value="">-- Chọn sản phẩm --</option>';
    products_admin.filter(p => p.active).forEach(p => {
        productOptions += `<option value="${p.id}">${p.name}</option>`;
    });
    
    const row = `
        <tr data-row-index="${rowIndex}">
            <td>
                <select class="form-control import-product-select" onchange="updateImportRow(${rowIndex})" data-row="${rowIndex}">
                    ${productOptions}
                </select>
            </td>
            <td>
                <input type="number" class="form-control import-price" placeholder="0" min="0" 
                       onchange="updateImportRow(${rowIndex})" oninput="updateImportRow(${rowIndex})" 
                       data-row="${rowIndex}">
            </td>
            <td>
                <input type="number" class="form-control import-qty" placeholder="0" min="1" 
                       onchange="updateImportRow(${rowIndex})" oninput="updateImportRow(${rowIndex})" 
                       data-row="${rowIndex}">
            </td>
            <td class="import-row-total" data-row="${rowIndex}">0đ</td>
            <td>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeImportRow(${rowIndex})" 
                        title="Xóa dòng">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
    
    tableBody.insertAdjacentHTML('beforeend', row);
}

function updateImportRow(rowIndex) {
    const row = document.querySelector(`tr[data-row-index="${rowIndex}"]`);
    if (!row) return;
    
    const productSelect = row.querySelector('.import-product-select');
    const priceInput = row.querySelector('.import-price');
    const qtyInput = row.querySelector('.import-qty');
    const totalCell = row.querySelector('.import-row-total');
    
    const productId = parseInt(productSelect.value) || null;
    let price = parseInt(priceInput.value) || 0;
    let qty = parseInt(qtyInput.value) || 0;
    
    // Validate số âm
    if (price < 0) {
        price = 0;
        priceInput.value = 0;
        showNotification('❌ Giá nhập không được là số âm!', 'error');
    }
    
    if (qty < 0) {
        qty = 0;
        qtyInput.value = 0;
        showNotification('❌ Số lượng không được là số âm!', 'error');
    }
    
    // Cập nhật dữ liệu
    importProducts[rowIndex] = {
        productId,
        price,
        qty
    };
    
    // Tính thành tiền
    const rowTotal = price * qty;
    totalCell.textContent = formatCurrency(rowTotal);
    
    // Cập nhật tổng cộng
    updateImportGrandTotal();
}

function removeImportRow(rowIndex) {
    const row = document.querySelector(`tr[data-row-index="${rowIndex}"]`);
    if (row) {
        row.remove();
        importProducts[rowIndex] = null; // Đánh dấu xóa
        updateImportGrandTotal();
    }
}

function updateImportGrandTotal() {
    const grandTotal = importProducts
        .filter(item => item !== null && item.productId)
        .reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    document.getElementById('importGrandTotal').textContent = formatCurrency(grandTotal);
}

function closeImportModal() {
    document.getElementById('importModal').classList.remove('show');
    importProducts = [];
}

function saveImport() {
    const code = document.getElementById('importCode').value;
    const date = document.getElementById('importDate').value;
    
    // Lọc sản phẩm hợp lệ
    const validProducts = importProducts.filter(item => 
        item !== null && item.productId && item.price > 0 && item.qty > 0
    );
    
    if (validProducts.length === 0) {
        showNotification('❌ Vui lòng thêm ít nhất 1 sản phẩm hợp lệ!', 'error');
        return;
    }
    
    if (!date) {
        showNotification('❌ Vui lòng chọn ngày nhập!', 'error');
        return;
    }
    
    // Validate số âm trong danh sách
    for (let item of validProducts) {
        if (item.price < 0) {
            showNotification('❌ Giá nhập không được là số âm!', 'error');
            return;
        }
        if (item.qty < 0 || item.qty === 0) {
            showNotification('❌ Số lượng phải lớn hơn 0!', 'error');
            return;
        }
    }
    
    // Lưu từng sản phẩm thành phiếu riêng (hoặc có thể gộp chung, tùy yêu cầu)
    // Ở đây tôi sẽ lưu thành 1 phiếu duy nhất với nhiều items
    const importRecord = {
        id: code,
        date,
        items: validProducts.map(item => {
            const product = products_admin.find(p => p.id === item.productId);
            return {
                productId: item.productId,
                productName: product.name,
                price: item.price,
                qty: item.qty
            };
        }),
        completed: false
    };
    
    imports.push(importRecord);
    
    // Cập nhật tồn kho cho từng sản phẩm
    validProducts.forEach(item => {
        updateInventoryAfterImport(item.productId, item.qty, item.price);
    });
    
    showNotification(`✅ Đã tạo phiếu nhập ${code} với ${validProducts.length} sản phẩm!`, 'success');
    
    saveData();
    closeImportModal();
    renderImports();
}

// Cập nhật hàm updateInventoryAfterImport để tương thích
function updateInventoryAfterImport(productId, qty, price) {
    const inventory = JSON.parse(localStorage.getItem('admin_inventory')) || [];
    const existingItem = inventory.find(inv => Number(inv.productId) === Number(productId));
    
    if (existingItem) {
        existingItem.quantity += qty;
        existingItem.lastImportPrice = price;
    } else {
        const product = products_admin.find(p => p.id === productId);
        inventory.push({
            productId: productId,
            productName: product.name,
            quantity: qty,
            minStock: 10,
            lastImportPrice: price
        });
    }
    
    localStorage.setItem('admin_inventory', JSON.stringify(inventory));
}

function editImport(id) {
    const imp = imports.find(i => i.id === id);
    if (!imp || imp.completed) return;
    
    editingImportId = id;
    document.getElementById('importModalTitle').textContent = 'Sửa phiếu nhập hàng';
    document.getElementById('importCode').value = imp.id;
    document.getElementById('importDate').value = imp.date;
    
    // Load products
    const select = document.getElementById('importProduct');
    select.innerHTML = '<option value="">Chọn sản phẩm</option>';
    products_admin.filter(p => p.active).forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.name}</option>`;
    });
    select.value = imp.productId;
    
    document.getElementById('importPrice').value = imp.price;
    document.getElementById('importQty').value = imp.qty;
    document.getElementById('importTotal').value = formatCurrency(imp.price * imp.qty);
    
    document.getElementById('importModal').classList.add('show');
}

function completeImport(id) {
    if (confirm('Hoàn thành phiếu nhập này? Sau khi hoàn thành sẽ không thể chỉnh sửa.')) {
        const imp = imports.find(i => i.id === id);
        if (!imp) return;
        
        imp.completed = true;
        
        // Xử lý cả phiếu cũ và phiếu mới
        if (imp.items && imp.items.length > 0) {
            // Phiếu MỚI - Nhiều sản phẩm
            imp.items.forEach(item => {
                let stock = inventory.find(s => Number(s.productId) === Number(item.productId));
                if (stock) {
                    stock.quantity = Number(stock.quantity) + Number(item.qty);
                } else {
                    const product = products_admin.find(p => p.id === item.productId);
                    inventory.push({
                        productId: item.productId,
                        productName: item.productName,
                        type: product ? product.type : 'unknown',
                        quantity: item.qty
                    });
                }
            });
        } else {
            // Phiếu CŨ - 1 sản phẩm (backward compatibility)
            let stock = inventory.find(s => Number(s.productId) === Number(imp.productId));
            if (stock) {
                stock.quantity = Number(stock.quantity) + Number(imp.qty);
            } else {
                const product = products_admin.find(p => p.id === imp.productId);
                inventory.push({
                    productId: imp.productId,
                    productName: imp.productName,
                    type: product ? product.type : 'unknown',
                    quantity: imp.qty
                });
            }
        }
        
        saveData();
        renderImports();
        renderInventory();
        showNotification('✅ Đã hoàn thành phiếu nhập!', 'success');
    }
}

// Hàm xem chi tiết phiếu nhập nhiều sản phẩm
function viewImportDetail(id) {
    const imp = imports.find(i => i.id === id);
    if (!imp) return;
    
    let detailHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Phiếu nhập: ${imp.id}</h4>
            <p><strong>Ngày nhập:</strong> ${imp.date}</p>
            <p><strong>Trạng thái:</strong> <span class="badge ${imp.completed ? 'badge-success' : 'badge-warning'}">${imp.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}</span></p>
        </div>
        <table class="table" style="width: 100%;">
            <thead>
                <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    let grandTotal = 0;
    
    if (imp.items && imp.items.length > 0) {
        imp.items.forEach(item => {
            const total = item.price * item.qty;
            grandTotal += total;
            detailHTML += `
                <tr>
                    <td>${item.productName}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${item.qty}</td>
                    <td>${formatCurrency(total)}</td>
                </tr>
            `;
        });
    } else {
        // Phiếu cũ
        const total = (imp.price || 0) * (imp.qty || 0);
        grandTotal = total;
        detailHTML += `
            <tr>
                <td>${imp.productName || 'N/A'}</td>
                <td>${formatCurrency(imp.price || 0)}</td>
                <td>${imp.qty || 0}</td>
                <td>${formatCurrency(total)}</td>
            </tr>
        `;
    }
    
    detailHTML += `
            </tbody>
            <tfoot>
                <tr style="font-weight: bold; background: #f8f9fa;">
                    <td colspan="3" style="text-align: right;">Tổng cộng:</td>
                    <td>${formatCurrency(grandTotal)}</td>
                </tr>
            </tfoot>
        </table>
    `;
    
    // Hiển thị trong modal hoặc alert
    const modal = document.getElementById('orderDetailModal');
    if (modal) {
        document.getElementById('orderDetailContent').innerHTML = detailHTML;
        modal.classList.add('show');
    } else {
        // Fallback: Tạo modal tạm
        const tempModal = document.createElement('div');
        tempModal.className = 'modal show';
        tempModal.style.display = 'flex';
        tempModal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>Chi tiết phiếu nhập</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    ${detailHTML}
                </div>
                <div class="modal-footer">
                    <button class="btn" style="background: #e2e8f0; color: #333;" onclick="this.closest('.modal').remove()">Đóng</button>
                </div>
            </div>
        `;
        document.body.appendChild(tempModal);
    }
}

// ===== PRICING =====
function renderPricing() {
    const tbody = document.getElementById('pricingTable');
    tbody.innerHTML = '';
    
    if (pricing.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có cấu hình giá nào</td></tr>';
        return;
    }
    
    pricing.forEach(p => {
        const sellPrice = Math.round(p.cost * (1 + p.profit / 100));
        tbody.innerHTML += `
            <tr>
                <td>${p.type}</td>
                <td>${p.productName}</td>
                <td>${formatCurrency(p.cost)}</td>
                <td>${p.profit}%</td>
                <td style="font-weight: 600; color: #10b981;">${formatCurrency(sellPrice)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editPricing(${p.id})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePricing(${p.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function openPricingModal() {
    editingPricingId = null;
    document.getElementById('pricingModalTitle').textContent = 'Cấu hình giá bán';
    
    updateCategoryFilters();
    document.getElementById('pricingType').value = '';
    document.getElementById('pricingProduct').innerHTML = '<option value="">Chọn sản phẩm</option>';
    document.getElementById('pricingCost').value = '';
    document.getElementById('pricingProfit').value = '';
    document.getElementById('pricingSell').value = '';
    
    document.getElementById('pricingModal').classList.add('show');
}

function closePricingModal() {
    document.getElementById('pricingModal').classList.remove('show');
}

// Update product list when category changes
document.addEventListener('DOMContentLoaded', () => {
    const typeSelect = document.getElementById('pricingType');
    const productSelect = document.getElementById('pricingProduct');
    
    if (typeSelect && productSelect) {
        typeSelect.addEventListener('change', () => {
            const type = typeSelect.value;
            productSelect.innerHTML = '<option value="">Chọn sản phẩm</option>';
            
            if (type) {
                products_admin.filter(p => p.type === type && p.active).forEach(p => {
                    productSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
                });
            }
        });
    }
});

function savePricing() {
    const type = document.getElementById('pricingType').value;
    const productId = parseInt(document.getElementById('pricingProduct').value);
    const cost = parseInt(document.getElementById('pricingCost').value);
    const profit = parseInt(document.getElementById('pricingProfit').value);
    
    if (!type || !productId || !cost || profit === '') {
        showNotification('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }
    
    // Validate số âm
    if (cost < 0) {
        showNotification('❌ Giá vốn không được là số âm!', 'error');
        return;
    }
    
    if (profit < 0) {
        showNotification('❌ % Lợi nhuận không được là số âm!', 'error');
        return;
    }
    
    const product = products_admin.find(p => p.id === productId);
    
    if (editingPricingId) {
        const price = pricing.find(p => p.id === editingPricingId);
        price.type = type;
        price.productId = productId;
        price.productName = product.name;
        price.cost = cost;
        price.profit = profit;
        showNotification('Cập nhật giá thành công!', 'success');
    } else {
        const newId = pricing.length > 0 ? Math.max(...pricing.map(p => p.id)) + 1 : 1;
        pricing.push({
            id: newId,
            type,
            productId,
            productName: product.name,
            cost,
            profit
        });
        showNotification('Thêm cấu hình giá thành công!', 'success');
    }
    
    // Đồng bộ giá sang trang user
    syncPricingToUserSite(productId, cost, profit);
    
    saveData();
    closePricingModal();
    renderPricing();
}


/**
 * Reset giá về products.js gốc (xóa user_site_products)
 */
function resetPricesToDefault() {
    if (!confirm('⚠️ RESET GIÁ VỀ MẶC ĐỊNH?\n\nSẽ xóa tất cả giá đã đồng bộ và quay về giá gốc trong products.js\n\nBạn có chắc chắn?')) {
        return;
    }
    
    try {
        // Xóa user_site_products - trang user sẽ dùng giá từ products.js
        localStorage.removeItem('user_site_products');
        localStorage.removeItem('products_price_updated');
        
        showNotification('✅ Đã reset về giá gốc từ products.js!\n\nBây giờ bạn có thể đồng bộ lại từ Pricing.', 'success');
        console.log('✅ Đã xóa user_site_products - Giá quay về products.js gốc');
    } catch (error) {
        showNotification('❌ Lỗi khi reset: ' + error.message, 'error');
    }
}

/**
 * Đồng bộ giá từ admin pricing sang trang user
 * CHỈ cập nhật giá của sản phẩm được chỉ định
 */
function syncPricingToUserSite(productId, cost, profit) {
    try {
        // Tính giá bán
        const sellPrice = Math.round(cost * (1 + profit / 100));
        
        // Đọc user_site_products hiện tại
        let userProducts = localStorage.getItem('user_site_products');
        
        if (userProducts) {
            // Đã có - CHỈ CẬP NHẬT sản phẩm này
            userProducts = JSON.parse(userProducts);
            const productIndex = userProducts.findIndex(p => p.id === productId);
            
            if (productIndex !== -1) {
                userProducts[productIndex].price = sellPrice.toString();
            } else {
                // Thêm sản phẩm mới vào danh sách
                const adminProduct = products_admin.find(p => p.id === productId);
                if (adminProduct) {
                    userProducts.push({
                        id: adminProduct.id,
                        name: adminProduct.name,
                        price: sellPrice.toString(),
                        image: adminProduct.image,
                        category: adminProduct.type.toLowerCase(),
                        specs: {}
                    });
                }
            }
            
            localStorage.setItem('user_site_products', JSON.stringify(userProducts));
            console.log(`✅ Đã sync giá sản phẩm ${productId}: ${formatCurrency(sellPrice)}`);
        } else {
            // Chưa có user_site_products - chỉ tạo cho sản phẩm này
            const adminProduct = products_admin.find(p => p.id === productId);
            if (adminProduct) {
                userProducts = [{
                    id: adminProduct.id,
                    name: adminProduct.name,
                    price: sellPrice.toString(),
                    image: adminProduct.image,
                    category: adminProduct.type.toLowerCase(),
                    specs: {}
                }];
                localStorage.setItem('user_site_products', JSON.stringify(userProducts));
                console.log(`📦 Tạo user_site_products với 1 sản phẩm: ${formatCurrency(sellPrice)}`);
            }
        }
        
        localStorage.setItem('products_price_updated', Date.now().toString());
    } catch (error) {
        console.error('Lỗi khi sync giá sang trang user:', error);
    }
}

/**
 * Đồng bộ TẤT CẢ giá từ pricing sang trang user
 * CHỈ đồng bộ những sản phẩm có trong Pricing, GIỮ NGUYÊN giá gốc của sản phẩm khác
 */
function syncAllPricingToUserSite() {
    try {
        if (!pricing || pricing.length === 0) {
            showNotification('❌ Chưa có cấu hình giá nào để đồng bộ!', 'error');
            return;
        }
        
        // Đọc user_site_products hiện tại (nếu có)
        let userProducts = localStorage.getItem('user_site_products');
        
        if (userProducts) {
            userProducts = JSON.parse(userProducts);
            console.log(`📦 Đã có ${userProducts.length} sản phẩm trong user_site_products`);
        } else {
            // Tạo mảng rỗng - chỉ thêm sản phẩm có pricing
            userProducts = [];
            console.log('📦 Tạo mới user_site_products (chỉ chứa sản phẩm có pricing)');
        }
        
        let syncCount = 0;
        
        // CHỈ cập nhật/thêm những sản phẩm có trong pricing
        pricing.forEach(priceConfig => {
            const sellPrice = Math.round((Number(priceConfig.cost) || 0) * (1 + (Number(priceConfig.profit) || 0) / 100));
            const productIndex = userProducts.findIndex(p => p.id === priceConfig.productId);
            
            if (productIndex !== -1) {
                // Cập nhật giá cho sản phẩm đã có
                const oldPrice = userProducts[productIndex].price;
                userProducts[productIndex].price = sellPrice.toString();
                console.log(`💰 ${priceConfig.productName}: ${oldPrice} → ${formatCurrency(sellPrice)}`);
                syncCount++;
            } else {
                // Thêm sản phẩm mới
                const adminProduct = products_admin.find(p => p.id === priceConfig.productId);
                if (adminProduct) {
                    userProducts.push({
                        id: adminProduct.id,
                        name: adminProduct.name,
                        price: sellPrice.toString(),
                        image: adminProduct.image,
                        category: adminProduct.type.toLowerCase(),
                        specs: {}
                    });
                    console.log(`➕ ${priceConfig.productName}: ${formatCurrency(sellPrice)}`);
                    syncCount++;
                }
            }
        });
        
        // Lưu toàn bộ vào localStorage
        localStorage.setItem('user_site_products', JSON.stringify(userProducts));
        localStorage.setItem('products_price_updated', Date.now().toString());
        
        showNotification(`✅ Đã đồng bộ ${syncCount} giá sản phẩm lên trang bán hàng!\n\n💡 Các sản phẩm KHÔNG có trong Pricing giữ nguyên giá gốc.\n\nRefresh trang web để thấy giá mới.`, 'success');
        console.log(`✅ Đã sync ${syncCount}/${pricing.length} giá sản phẩm`);
        console.log(`💡 Các sản phẩm khác (không có pricing) vẫn dùng giá gốc từ products.js`);
    } catch (error) {
        showNotification('❌ Lỗi khi đồng bộ giá: ' + error.message, 'error');
        console.error('Lỗi khi sync tất cả giá:', error);
    }
}

function editPricing(id) {
    const price = pricing.find(p => p.id === id);
    if (!price) return;
    
    editingPricingId = id;
    document.getElementById('pricingModalTitle').textContent = 'Sửa cấu hình giá';
    
    updateCategoryFilters();
    document.getElementById('pricingType').value = price.type;
    
    // Trigger product list update
    const event = new Event('change');
    document.getElementById('pricingType').dispatchEvent(event);
    
    setTimeout(() => {
        document.getElementById('pricingProduct').value = price.productId;
        document.getElementById('pricingCost').value = price.cost;
        document.getElementById('pricingProfit').value = price.profit;
        
        const sellPrice = Math.round(price.cost * (1 + price.profit / 100));
        document.getElementById('pricingSell').value = formatCurrency(sellPrice);
    }, 100);
    
    document.getElementById('pricingModal').classList.add('show');
}

function deletePricing(id) {
    if (confirm('Bạn có chắc muốn xóa cấu hình giá này?')) {
        pricing = pricing.filter(p => p.id !== id);
        saveData();
        renderPricing();
        showNotification('Xóa cấu hình giá thành công!', 'success');
    }
}

// ===== ORDERS =====
function renderOrders(list = orders) {
    // Reload orders từ localStorage trước khi render
    orders = JSON.parse(localStorage.getItem('admin_orders')) || orders;
    if (!list || list === orders) {
        list = orders; // Dùng data mới nhất
    }
    
    const tbody = document.getElementById('ordersTable');
    tbody.innerHTML = '';
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Không tìm thấy đơn hàng nào</td></tr>';
        return;
    }
    
    list.forEach(o => {
        const statusClass = {
            'Mới đặt': 'badge-info',
            'Đã xử lý': 'badge-warning',
            'Đã giao': 'badge-success',
            'Hủy': 'badge-danger'
        }[o.status];
        
        tbody.innerHTML += `
            <tr>
                <td>${o.id}</td>
                <td>${o.date}</td>
                <td>${o.customer}</td>
                <td>${formatCurrency(o.total)}</td>
                <td><span class="badge ${statusClass}">${o.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewOrderDetail('${o.id}')">
                        <i class="fas fa-eye"></i> Chi tiết
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="updateOrderStatus('${o.id}')">
                        <i class="fas fa-sync"></i> Cập nhật
                    </button>
                </td>
            </tr>
        `;
    });
}

function filterOrders() {
    const from = document.getElementById('fromDate').value;
    const to = document.getElementById('toDate').value;
    const status = document.getElementById('orderStatusFilter').value;
    
    const filtered = orders.filter(o => {
        const date = new Date(o.date);
        const inRange = (!from || date >= new Date(from)) && (!to || date <= new Date(to));
        const matchStatus = !status || o.status === status;
        return inRange && matchStatus;
    });
    
    renderOrders(filtered);
}

function viewOrderDetail(id) {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    
    const statusClass = {
        'Mới đặt': 'badge-info',
        'Đã xử lý': 'badge-warning',
        'Đã giao': 'badge-success',
        'Hủy': 'badge-danger'
    }[order.status];
    
    let itemsHTML = '';
    order.items.forEach(item => {
        const itemTotal = item.price * item.qty;
        itemsHTML += `
            <tr>
                <td>${item.productName}</td>
                <td class="text-center">${item.qty}</td>
                <td class="text-right">${formatCurrency(item.price)}</td>
                <td class="text-right" style="font-weight: 600;">${formatCurrency(itemTotal)}</td>
            </tr>
        `;
    });
    
    const content = `
        <div style="padding: 10px;">
            <div style="margin-bottom: 20px;">
                <h4 style="color: #667eea; margin-bottom: 10px;">Thông tin đơn hàng</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div><strong>Mã đơn:</strong> ${order.id}</div>
                    <div><strong>Ngày đặt:</strong> ${order.date}</div>
                    <div><strong>Khách hàng:</strong> ${order.customer}</div>
                    <div><strong>Trạng thái:</strong> <span class="badge ${statusClass}">${order.status}</span></div>
                </div>
            </div>
            
            <h4 style="color: #667eea; margin-bottom: 10px;">Danh sách sản phẩm</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f1f5f9;">
                        <th style="padding: 10px; text-align: left;">Sản phẩm</th>
                        <th style="padding: 10px; text-align: center;">Số lượng</th>
                        <th style="padding: 10px; text-align: right;">Đơn giá</th>
                        <th style="padding: 10px; text-align: right;">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
                <tfoot>
                    <tr style="background: #f1f5f9; font-weight: 600;">
                        <td colspan="3" style="padding: 10px; text-align: right;">Tổng cộng:</td>
                        <td style="padding: 10px; text-align: right; color: #10b981; font-size: 18px;">${formatCurrency(order.total)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    document.getElementById('orderDetailContent').innerHTML = content;
    document.getElementById('orderDetailModal').classList.add('show');
}

function closeOrderDetailModal() {
    document.getElementById('orderDetailModal').classList.remove('show');
}

function updateOrderStatus(id) {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    
    const statuses = ['Mới đặt', 'Đã xử lý', 'Đã giao', 'Hủy'];
    const currentIndex = statuses.indexOf(order.status);
    
    let options = '<select id="newStatusSelect" class="form-control" style="margin: 10px 0;">';
    statuses.forEach((s, i) => {
        options += `<option value="${s}" ${i === currentIndex ? 'selected' : ''}>${s}</option>`;
    });
    options += '</select>';
    
    const message = `
        <div style="padding: 10px;">
            <p><strong>Đơn hàng:</strong> ${order.id}</p>
            <p><strong>Khách hàng:</strong> ${order.customer}</p>
            <p><strong>Trạng thái hiện tại:</strong> ${order.status}</p>
            <p style="margin-top: 15px;"><strong>Chọn trạng thái mới:</strong></p>
            ${options}
        </div>
    `;
    
    document.getElementById('orderDetailContent').innerHTML = message;
    document.getElementById('orderDetailModal').classList.add('show');
    
    // Add save button
    const footer = document.querySelector('#orderDetailModal .modal-footer');
    footer.innerHTML = `
        <button class="btn btn-primary" onclick="saveOrderStatus('${id}')">
            <i class="fas fa-save"></i> Lưu
        </button>
        <button class="btn" style="background: #e2e8f0; color: #333;" onclick="closeOrderDetailModal()">Hủy</button>
    `;
}

function saveOrderStatus(id) {
    const newStatus = document.getElementById('newStatusSelect').value;
    const order = orders.find(o => o.id === id);
    order.status = newStatus;
    saveData();
    closeOrderDetailModal();
    renderOrders();
    showNotification(`Cập nhật trạng thái đơn hàng ${id} thành công!`, 'success');
    
    // Reset footer
    const footer = document.querySelector('#orderDetailModal .modal-footer');
    footer.innerHTML = '<button class="btn" style="background: #e2e8f0; color: #333;" onclick="closeOrderDetailModal()">Đóng</button>';
}

// ===== INVENTORY =====

// Ngưỡng cảnh báo (có thể tùy chỉnh)
let lowStockThreshold = parseInt(localStorage.getItem('lowStockThreshold')) || 5;

function setLowStockThreshold() {
    const newThreshold = prompt('Nhập ngưỡng cảnh báo sắp hết hàng:', lowStockThreshold);
    if (newThreshold && !isNaN(newThreshold) && newThreshold > 0) {
        lowStockThreshold = parseInt(newThreshold);
        localStorage.setItem('lowStockThreshold', lowStockThreshold);
        
        // Update display
        const thresholdDisplay = document.getElementById('thresholdDisplay');
        if (thresholdDisplay) {
            thresholdDisplay.textContent = lowStockThreshold;
        }
        
        showNotification(`✅ Đã đặt ngưỡng cảnh báo = ${lowStockThreshold}!`, 'success');
        renderInventory();
    }
}

function renderInventory() {
    const tbody = document.getElementById('inventoryTable');
    const search = document.getElementById('searchInventory').value.toLowerCase();
    
    tbody.innerHTML = '';
    
    const filtered = inventory.filter(i => {
        return i.productName.toLowerCase().includes(search) || i.type.toLowerCase().includes(search);
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Không tìm thấy sản phẩm trong kho</td></tr>';
        return;
    }
    
    filtered.forEach(i => {
        const isLow = i.quantity < lowStockThreshold;
        tbody.innerHTML += `
            <tr style="${isLow ? 'background: #fef3c7;' : ''}">
                <td>${i.type}</td>
                <td>${i.productName}</td>
                <td style="font-weight: 600; color: ${isLow ? '#f59e0b' : '#10b981'};">${i.quantity}</td>
                <td>
                    ${isLow ? '<span class="badge badge-warning"><i class="fas fa-exclamation-triangle"></i> Sắp hết</span>' : '<span class="badge badge-success">Đủ hàng</span>'}
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewInventoryDetail(${i.productId})">
                        <i class="fas fa-chart-bar"></i> Chi tiết
                    </button>
                </td>
            </tr>
        `;
    });
}

function showLowStockAlert() {
    const lowStock = inventory.filter(i => i.quantity < lowStockThreshold);
    
    if (lowStock.length === 0) {
        showNotification(`Tất cả sản phẩm đều còn ≥ ${lowStockThreshold}!`, 'success');
        return;
    }
    
    let message = `<div style="padding: 10px;"><h4 style="color: #f59e0b; margin-bottom: 15px;"><i class="fas fa-exclamation-triangle"></i> Sản phẩm sắp hết hàng (< ${lowStockThreshold})</h4><ul style="list-style: none; padding: 0;">`;
    
    lowStock.forEach(i => {
        message += `<li style="padding: 8px; margin: 5px 0; background: #fef3c7; border-radius: 5px;">
            <strong>${i.productName}</strong> - Còn: <span style="color: #f59e0b; font-weight: 600;">${i.quantity}</span>
        </li>`;
    });
    
    message += '</ul></div>';
    
    document.getElementById('orderDetailContent').innerHTML = message;
    document.getElementById('orderDetailModal').classList.add('show');
}

function viewInventoryDetail(productId) {
    const stock = inventory.find(i => i.productId === productId);
    if (!stock) return;
    
    // Calculate imports and exports for this product
    const totalImports = imports.filter(i => i.productId === productId && i.completed)
        .reduce((sum, i) => sum + i.qty, 0);
    
    const totalExports = orders.reduce((sum, o) => {
        const items = o.items.filter(item => item.productId === productId);
        return sum + items.reduce((itemSum, item) => itemSum + item.qty, 0);
    }, 0);
    
    const content = `
        <div style="padding: 10px;">
            <h4 style="color: #667eea; margin-bottom: 15px;">Thông tin tồn kho</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="padding: 15px; background: #f1f5f9; border-radius: 10px;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Loại sản phẩm</div>
                    <div style="font-size: 16px; font-weight: 600;">${stock.type}</div>
                </div>
                <div style="padding: 15px; background: #f1f5f9; border-radius: 10px;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Tên sản phẩm</div>
                    <div style="font-size: 16px; font-weight: 600;">${stock.productName}</div>
                </div>
                <div style="padding: 15px; background: #dbeafe; border-radius: 10px;">
                    <div style="font-size: 12px; color: #1e40af; margin-bottom: 5px;">Tổng nhập</div>
                    <div style="font-size: 24px; font-weight: 600; color: #3b82f6;">${totalImports}</div>
                </div>
                <div style="padding: 15px; background: #fee2e2; border-radius: 10px;">
                    <div style="font-size: 12px; color: #991b1b; margin-bottom: 5px;">Tổng xuất</div>
                    <div style="font-size: 24px; font-weight: 600; color: #ef4444;">${totalExports}</div>
                </div>
                <div style="padding: 15px; background: #d1fae5; border-radius: 10px; grid-column: span 2;">
                    <div style="font-size: 12px; color: #065f46; margin-bottom: 5px;">Tồn kho hiện tại</div>
                    <div style="font-size: 32px; font-weight: 600; color: #10b981;">${stock.quantity}</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetailContent').innerHTML = content;
    document.getElementById('orderDetailModal').classList.add('show');
}

function openInventoryReportModal() {
    // Load product list
    const select = document.getElementById('reportProduct');
    select.innerHTML = '<option value="">Tất cả sản phẩm</option>';
    products_admin.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.name}</option>`;
    });
    
    // Set default dates
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    document.getElementById('reportFromDate').value = lastMonth.toISOString().split('T')[0];
    document.getElementById('reportToDate').value = today.toISOString().split('T')[0];
    document.getElementById('reportResult').innerHTML = '';
    
    document.getElementById('inventoryReportModal').classList.add('show');
}

function closeInventoryReportModal() {
    document.getElementById('inventoryReportModal').classList.remove('show');
}

function generateReport() {
    const productId = parseInt(document.getElementById('reportProduct').value);
    const fromDate = document.getElementById('reportFromDate').value;
    const toDate = document.getElementById('reportToDate').value;
    
    if (!fromDate || !toDate) {
        showNotification('Vui lòng chọn khoảng thời gian!', 'error');
        return;
    }
    
    // Filter imports
    const filteredImports = imports.filter(i => {
        const matchDate = i.date >= fromDate && i.date <= toDate;
        // If productId not specified, include any completed import in date range
        if (!productId) return matchDate && i.completed;

        // If import uses new format (items array), include if any item matches productId
        if (i.items && Array.isArray(i.items) && i.items.length > 0) {
            return matchDate && i.completed && i.items.some(it => Number(it.productId) === Number(productId));
        }

        // Old format: top-level productId field
        return matchDate && i.completed && Number(i.productId) === Number(productId);
    });
    
    // Filter orders
    const filteredOrders = orders.filter(o => {
        const matchDate = o.date >= fromDate && o.date <= toDate;
        return matchDate;
    });
    
    // Calculate totals (handle both old and new import record formats safely)
    let totalImport = 0;
    filteredImports.forEach(i => {
        if (i.items && Array.isArray(i.items) && i.items.length > 0) {
            // Sum quantities inside items array (only those matching productId when filtered by product)
            i.items.forEach(it => {
                if (!productId || Number(it.productId) === Number(productId)) {
                    totalImport += Number(it.qty) || 0;
                }
            });
        } else {
            // Old single-product import format
            totalImport += Number(i.qty) || 0;
        }
    });
    
    let totalExport = 0;
    filteredOrders.forEach(o => {
        o.items.forEach(item => {
            if (!productId || item.productId === productId) {
                totalExport += item.qty;
            }
        });
    });
    
    const currentStock = productId ? 
        (inventory.find(i => i.productId === productId)?.quantity || 0) : 
        inventory.reduce((sum, i) => sum + i.quantity, 0);
    
    const productName = productId ? 
        products_admin.find(p => p.id === productId)?.name : 
        'Tất cả sản phẩm';
    
    // Tính toán giá vốn, giá bán, doanh thu và lợi nhuận
    let totalCostPrice = 0;
    let totalRevenue = 0;
    let avgProfit = 0;
    
    if (productId) {
        // Tính cho 1 sản phẩm cụ thể
        const priceConfig = pricing.find(p => p.productId === productId);
        if (priceConfig) {
            const costPrice = Number(priceConfig.cost) || 0;
            const sellPrice = Math.round(costPrice * (1 + (Number(priceConfig.profit) || 0) / 100));
            
            totalCostPrice = costPrice * totalImport;
            totalRevenue = sellPrice * totalExport;
            avgProfit = Number(priceConfig.profit) || 0;
        }
    } else {
        // Tính cho tất cả sản phẩm
        filteredImports.forEach(imp => {
            if (imp.items && Array.isArray(imp.items)) {
                // Format mới
                imp.items.forEach(item => {
                    const priceConfig = pricing.find(p => p.productId === item.productId);
                    const costPrice = priceConfig ? (Number(priceConfig.cost) || Number(item.price) || 0) : (Number(item.price) || 0);
                    totalCostPrice += costPrice * (Number(item.qty) || 0);
                });
            } else {
                // Format cũ
                const priceConfig = pricing.find(p => p.productId === imp.productId);
                const costPrice = priceConfig ? (Number(priceConfig.cost) || Number(imp.price) || 0) : (Number(imp.price) || 0);
                totalCostPrice += costPrice * (Number(imp.qty) || 0);
            }
        });
        
        // Tính doanh thu từ orders
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const priceConfig = pricing.find(p => p.productId === item.productId);
                if (priceConfig) {
                    const sellPrice = Math.round((Number(priceConfig.cost) || 0) * (1 + (Number(priceConfig.profit) || 0) / 100));
                    totalRevenue += sellPrice * (Number(item.qty) || 0);
                } else {
                    totalRevenue += (Number(item.price) || 0) * (Number(item.qty) || 0);
                }
            });
        });
        
        // Tính % lợi nhuận trung bình
        if (pricing.length > 0) {
            avgProfit = pricing.reduce((sum, p) => sum + (Number(p.profit) || 0), 0) / pricing.length;
        }
    }
    
    const totalProfit = totalRevenue - totalCostPrice;
    const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;
    
    const html = `
        <div style="background: white; padding: 20px; border-radius: 10px; border: 2px solid #667eea;">
            <h4 style="color: #667eea; margin-bottom: 15px; text-align: center;">
                <i class="fas fa-chart-line"></i> BÁO CÁO NHẬP - XUẤT - TỒN
            </h4>
            <div style="text-align: center; margin-bottom: 20px; color: #666;">
                <div><strong>Sản phẩm:</strong> ${productName}</div>
                <div><strong>Từ ngày:</strong> ${fromDate} <strong>đến ngày:</strong> ${toDate}</div>
            </div>
            
            <!-- Phần 1: Số lượng -->
            <div style="margin-bottom: 20px;">
                <h5 style="color: #667eea; margin-bottom: 10px;">📦 Số lượng</h5>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 10px; color: white;">
                        <div style="font-size: 14px; margin-bottom: 10px; opacity: 0.9;">Tổng nhập</div>
                        <div style="font-size: 32px; font-weight: 600;">${totalImport}</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 10px; color: white;">
                        <div style="font-size: 14px; margin-bottom: 10px; opacity: 0.9;">Tổng xuất</div>
                        <div style="font-size: 32px; font-weight: 600;">${totalExport}</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 10px; color: white;">
                        <div style="font-size: 14px; margin-bottom: 10px; opacity: 0.9;">Tồn hiện tại</div>
                        <div style="font-size: 32px; font-weight: 600;">${currentStock}</div>
                    </div>
                </div>
            </div>
            
            <!-- Phần 2: Tài chính -->
            <div>
                <h5 style="color: #667eea; margin-bottom: 10px;">💰 Tài chính</h5>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px;">
                    <div style="padding: 15px; background: #f1f5f9; border-radius: 10px; border-left: 4px solid #3b82f6;">
                        <div style="font-size: 12px; color: #64748b; margin-bottom: 5px;">Tổng giá vốn</div>
                        <div style="font-size: 20px; font-weight: 600; color: #1e293b;">${formatCurrency(totalCostPrice)}</div>
                    </div>
                    <div style="padding: 15px; background: #f1f5f9; border-radius: 10px; border-left: 4px solid #10b981;">
                        <div style="font-size: 12px; color: #64748b; margin-bottom: 5px;">Doanh thu bán</div>
                        <div style="font-size: 20px; font-weight: 600; color: #1e293b;">${formatCurrency(totalRevenue)}</div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div style="padding: 15px; background: ${totalProfit >= 0 ? '#d1fae5' : '#fee2e2'}; border-radius: 10px; border-left: 4px solid ${totalProfit >= 0 ? '#10b981' : '#ef4444'};">
                        <div style="font-size: 12px; color: #64748b; margin-bottom: 5px;">Lợi nhuận</div>
                        <div style="font-size: 20px; font-weight: 600; color: ${totalProfit >= 0 ? '#059669' : '#dc2626'};">${formatCurrency(totalProfit)}</div>
                    </div>
                    <div style="padding: 15px; background: #fef3c7; border-radius: 10px; border-left: 4px solid #f59e0b;">
                        <div style="font-size: 12px; color: #64748b; margin-bottom: 5px;">Biên lợi nhuận</div>
                        <div style="font-size: 20px; font-weight: 600; color: #d97706;">${profitMargin}%</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('reportResult').innerHTML = html;
}

// Initialize on page load
window.addEventListener('load', () => {
    updateCategoryFilters();
    
    // Update threshold display
    const thresholdDisplay = document.getElementById('thresholdDisplay');
    if (thresholdDisplay) {
        thresholdDisplay.textContent = lowStockThreshold;
    }
});

// ===== TEST FUNCTIONS =====

/**
 * Function để test: Reset tất cả về 0, sau đó chỉ nhập 20 sản phẩm đầu tiên
 */
function initInventoryForTesting(quantity = 10, maxProducts = 20) {
    if (!confirm(`⚠️ Khởi tạo dữ liệu test?\n\n- Reset TẤT CẢ tồn kho về 0\n- Chỉ nhập ${maxProducts} sản phẩm đầu với số lượng ${quantity}\n- Xóa tất cả phiếu nhập cũ\n\n(Chỉ dùng để test)`)) {
        return;
    }
    
    let inventory = JSON.parse(localStorage.getItem('admin_inventory')) || [];
    
    // Nếu chưa có inventory, tạo từ products_admin
    if (inventory.length === 0 && products_admin.length > 0) {
        inventory = products_admin.map(p => ({
            productId: p.id,
            productName: p.name,
            type: p.type,
            quantity: 0, // Reset tất cả về 0
            lastUpdated: new Date().toISOString()
        }));
    } else {
        // Reset TẤT CẢ về 0
        inventory = inventory.map(item => ({
            ...item,
            quantity: 0,
            lastUpdated: new Date().toISOString()
        }));
    }
    
    // Reset imports
    imports = [];
    
    const today = new Date().toISOString().split('T')[0];
    const importCode = 'PN001';
    
    // Chỉ lấy 20 sản phẩm đầu tiên để tạo phiếu nhập
    const selectedProducts = inventory.slice(0, maxProducts);
    
    if (selectedProducts.length === 0) {
        showNotification('❌ Không có sản phẩm nào để nhập!', 'error');
        return;
    }
    
    // Tạo 1 phiếu nhập duy nhất với 20 sản phẩm (format mới - items array)
    const importItems = selectedProducts.map(item => {
        // Cập nhật tồn kho cho 20 sản phẩm này
        const invItem = inventory.find(i => i.productId === item.productId);
        if (invItem) {
            invItem.quantity = quantity;
            invItem.lastUpdated = new Date().toISOString();
        }
        
        // Lấy giá bán từ products (nếu có)
        const product = products_admin.find(p => p.id === item.productId);
        let currentPrice = 10000000; // Default 10M nếu không tìm thấy
        
        if (product && typeof products !== 'undefined') {
            const userProduct = products.find(p => p.id === item.productId);
            if (userProduct && userProduct.price) {
                currentPrice = parseInt(userProduct.price) || 10000000;
            }
        }
        
        // Tính giá vốn = 60% giá bán (lợi nhuận 67% trên giá vốn)
        // VD: Giá bán 10M → Giá vốn 6M → Lợi nhuận = (10M-6M)/6M = 67%
        const costPrice = Math.round(currentPrice * 0.6);
        
        return {
            productId: item.productId,
            productName: item.productName,
            price: costPrice,
            qty: quantity
        };
    });
    
    imports.push({
        id: importCode,
        date: today,
        items: importItems,
        completed: true,
        completedDate: new Date().toISOString()
    });
    
    localStorage.setItem('admin_inventory', JSON.stringify(inventory));
    localStorage.setItem('admin_imports', JSON.stringify(imports));
    
    // Update pricing cho 20 sản phẩm đã nhập
    let pricing = JSON.parse(localStorage.getItem('admin_pricing')) || [];
    selectedProducts.forEach(item => {
        // Lấy giá bán từ products
        let currentPrice = 10000000; // Default
        if (typeof products !== 'undefined') {
            const userProduct = products.find(p => p.id === item.productId);
            if (userProduct && userProduct.price) {
                currentPrice = parseInt(userProduct.price) || 10000000;
            }
        }
        
        // Giá vốn = 60% giá bán
        const costPrice = Math.round(currentPrice * 0.6);
        
        const existingPrice = pricing.find(p => p.productId === item.productId);
        if (!existingPrice) {
            pricing.push({
                id: pricing.length + 1,
                type: item.type,
                productId: item.productId,
                productName: item.productName,
                cost: costPrice,
                profit: 67 // 67% lợi nhuận (giá bán = giá vốn × 1.67)
            });
        } else {
            existingPrice.cost = costPrice;
            existingPrice.profit = 67;
        }
    });
    localStorage.setItem('admin_pricing', JSON.stringify(pricing));
    
    // Đồng bộ tất cả giá lên trang user
    syncAllPricingToUserSite();
    
    const totalImported = selectedProducts.length * quantity;
    
    // Tính ví dụ với sản phẩm đầu tiên
    const firstProduct = selectedProducts[0];
    let examplePrice = 10000000;
    if (typeof products !== 'undefined') {
        const exampleUserProduct = products.find(p => p.id === firstProduct.productId);
        if (exampleUserProduct && exampleUserProduct.price) {
            examplePrice = parseInt(exampleUserProduct.price) || 10000000;
        }
    }
    const exampleCost = Math.round(examplePrice * 0.6);
    
    showNotification(`✅ Đã khởi tạo:\n- ${selectedProducts.length} sản phẩm đã nhập (${quantity} cái/sp)\n- Tổng nhập: ${totalImported}\n- VD giá: ${formatCurrency(examplePrice)} → Vốn: ${formatCurrency(exampleCost)} (67% lợi nhuận)\n- ${inventory.length - selectedProducts.length} sản phẩm còn lại = 0`, 'success');
    
    // Reload dữ liệu
    location.reload();
}

// ...existing code...

/**
 * Function reset toàn bộ dữ liệu GIAO DỊCH (GIỮ NGUYÊN sản phẩm)
 */
function resetAllData() {
    if (!confirm('⚠️ RESET DỮ LIỆU GIAO DỊCH?\n\n- Tồn kho → 0\n- Phiếu nhập → Xóa\n- Đơn hàng → Xóa\n- Pricing → Xóa\n- Doanh thu → Xóa\n\n✅ GIỮ NGUYÊN:\n- Danh sách sản phẩm\n- Danh sách user\n- Danh mục\n\nThao tác này KHÔNG THỂ HOÀN TÁC!')) {
        return;
    }
    
    const confirmText = prompt('Gõ "RESET" để xác nhận:');
    if (confirmText !== 'RESET') {
        showNotification('❌ Đã hủy!', 'error');
        return;
    }
    
    // CHỈ XÓA dữ liệu giao dịch - GIỮ NGUYÊN products, users, categories
    const keysToReset = [
        'admin_inventory',   // Reset tồn kho về 0
        'admin_imports',     // Xóa phiếu nhập
        'admin_orders',      // Xóa đơn hàng
        'admin_pricing',     // Xóa pricing
        'admin_revenue'      // Xóa doanh thu
    ];
    
    keysToReset.forEach(key => localStorage.removeItem(key));
    
    // Reset inventory về 0 thay vì xóa hoàn toàn
    const inventory = JSON.parse(localStorage.getItem('admin_inventory')) || [];
    const resetInventory = products_admin.map(p => ({
        productId: p.id,
        productName: p.name,
        type: p.type,
        quantity: 0,
        lastUpdated: new Date().toISOString()
    }));
    localStorage.setItem('admin_inventory', JSON.stringify(resetInventory));
    
    showNotification('✅ Đã reset dữ liệu giao dịch! Sản phẩm và user vẫn còn nguyên.', 'success');
    
    setTimeout(() => {
        location.reload();
    }, 1000);
}

/**
 * Function XÓA TẤT CẢ (bao gồm cả products, users) - CHỈ DÙNG KHI THẬT SỰ CẦN
 */
function resetEverything() {
    if (!confirm('⚠️⚠️⚠️ XÓA TOÀN BỘ HỆ THỐNG?\n\n- Users\n- Products  \n- Categories\n- Inventory\n- Imports\n- Orders\n- Pricing\n\nSau khi xóa sẽ QUAY VỀ TRẠNG THÁI BAN ĐẦU!\n\nThao tác này CỰC KỲ NGUY HIỂM!')) {
        return;
    }
    
    const confirmText = prompt('Gõ "DELETE EVERYTHING" để xác nhận XÓA TOÀN BỘ:');
    if (confirmText !== 'DELETE EVERYTHING') {
        showNotification('❌ Đã hủy!', 'error');
        return;
    }
    
    const allKeys = [
        'admin_users',
        'admin_products',
        'admin_categories',
        'admin_inventory',
        'admin_imports',
        'admin_orders',
        'admin_pricing',
        'admin_revenue',
        'admin_products_synced',
        'user_site_products',
        'products_price_updated'
    ];
    
    allKeys.forEach(key => localStorage.removeItem(key));
    
    showNotification('🗑️ Đã xóa TOÀN BỘ! Hệ thống sẽ quay về trạng thái ban đầu.', 'warning');
    
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// ...existing code...