
// Chú thích: File này quản lý trạng thái đăng nhập của người dùng.

const USER_SESSION_KEY = 'loggedInUser';

/**
 * Chú thích: Lưu thông tin người dùng vào sessionStorage khi đăng nhập thành công.
 * sessionStorage sẽ tự động xóa khi người dùng đóng tab/trình duyệt.
 * @param {object} userData - Đối tượng chứa thông tin người dùng (ví dụ: {name, email}).
 */
function login(userData) {
    sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
}

/**
 * Chú thích: Xóa thông tin người dùng khỏi sessionStorage để đăng xuất.
 */
function logout() {
    sessionStorage.removeItem(USER_SESSION_KEY);
    // Tải lại trang để cập nhật giao diện header và các trạng thái khác.
    window.location.href = 'index.html'; 
}

/**
 * Chú thích: Kiểm tra xem người dùng đã đăng nhập hay chưa.
 * @returns {boolean} - Trả về true nếu đã đăng nhập, ngược lại trả về false.
 */
function isUserLoggedIn() {
    return sessionStorage.getItem(USER_SESSION_KEY) !== null;
}

/**
 * Chú thích: Lấy thông tin của người dùng đang đăng nhập.
 * @returns {object|null} - Trả về đối tượng người dùng nếu có, ngược lại trả về null.
 */
function getLoggedInUser() {
    const user = sessionStorage.getItem(USER_SESSION_KEY);
    return user ? JSON.parse(user) : null;
}

/**
 * Chú thích: Cập nhật giao diện header dựa trên trạng thái đăng nhập.
 */
function updateUserDisplay() {
    const userIconContainer = document.querySelector('.topicon > div:last-child');
    if (!userIconContainer) return;

    if (isUserLoggedIn()) {
        const user = getLoggedInUser();
        userIconContainer.innerHTML = `
            <a href="#profile" title="Xem thông tin cá nhân">
                <i class="fa-solid fa-circle-user"></i>
                <div>Chào, ${user.name}</div>
            </a>
            <a href="#" id="logout-btn" title="Đăng xuất">
                 <i class="fa-solid fa-right-from-bracket"></i>
            </a>
        `;
        // Gắn sự kiện cho nút đăng xuất
        const logoutBtn = document.getElementById('logout-btn');
        if(logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    } else {
        userIconContainer.innerHTML = `
            <a href="../login/index.html">
                <i class="fa-solid fa-circle-user"></i>
                <div>Tài khoản</div>
            </a>
        `;
    }
}

// Gọi hàm này mỗi khi trang tải để đảm bảo header luôn đúng.
document.addEventListener('DOMContentLoaded', updateUserDisplay);
