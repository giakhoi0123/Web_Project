
// Chú thích: File này xử lý logic cho trang đăng nhập và đăng ký.

// === Lấy các phần tử cần thiết ===
const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

// === Chuyển giao diện giữa Sign In / Sign Up ===
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});
loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// === Kiểm tra mật khẩu real-time ===
const passwordInput = document.getElementById("password");
if (passwordInput) {
  passwordInput.addEventListener("input", (e) => {
    const password = e.target.value;
    const result = checkPasswordStrength(password);
    
    // Update bars
    const bars = [
      document.getElementById("strength-bar-1"),
      document.getElementById("strength-bar-2"),
      document.getElementById("strength-bar-3"),
      document.getElementById("strength-bar-4"),
      document.getElementById("strength-bar-5")
    ];
    
    const colors = ["#ef4444", "#f59e0b", "#eab308", "#84cc16", "#10b981"];
    const strengthText = document.getElementById("strength-text");
    
    bars.forEach((bar, index) => {
      if (index < result.strength) {
        bar.style.background = colors[result.strength - 1];
      } else {
        bar.style.background = "#ddd";
      }
    });
    
    if (password.length === 0) {
      strengthText.textContent = "Cần: Chữ thường, HOA, số, ký tự đặc biệt, ≥8 ký tự";
      strengthText.style.color = "#888";
    } else if (result.strength < 4) {
      strengthText.textContent = `Yếu - Cần: ${result.feedback.join(", ")}`;
      strengthText.style.color = "#ef4444";
    } else if (result.strength === 4) {
      strengthText.textContent = "Trung bình - Nên thêm ký tự đặc biệt";
      strengthText.style.color = "#f59e0b";
    } else {
      strengthText.textContent = "Mật khẩu mạnh ✓";
      strengthText.style.color = "#10b981";
    }
  });
}

// === Hàm hiện Popup ===

// === Hàm kiểm tra độ mạnh mật khẩu ===
function checkPasswordStrength(password) {
  let strength = 0;
  let feedback = [];

  // Độ dài tối thiểu 8 ký tự
  if (password.length >= 8) {
    strength += 1;
  } else {
    feedback.push("Ít nhất 8 ký tự");
  }

  // Có chữ thường
  if (/[a-z]/.test(password)) {
    strength += 1;
  } else {
    feedback.push("Có chữ thường");
  }

  // Có chữ hoa
  if (/[A-Z]/.test(password)) {
    strength += 1;
  } else {
    feedback.push("Có chữ HOA");
  }

  // Có số
  if (/[0-9]/.test(password)) {
    strength += 1;
  } else {
    feedback.push("Có số");
  }

  // Có ký tự đặc biệt
  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 1;
  } else {
    feedback.push("Có ký tự đặc biệt (!@#$...)");
  }

  return { strength, feedback };
}

// === Hàm hiện Popup ===
function showPopup(message, duration = 2000) {
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popup-message");
  msg.textContent = message;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), duration);
}

// === Xử lý sự kiện đăng ký ===
const signUpForm = document.querySelector(".sign-up form");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Ngăn trang tải lại

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    showPopup("⚠️ Vui lòng điền đầy đủ thông tin!");
    return;
  }

  // Kiểm tra độ mạnh mật khẩu
  const passwordCheck = checkPasswordStrength(password);
  if (passwordCheck.strength < 4) {
    showPopup(`❌ Mật khẩu yếu! Cần: ${passwordCheck.feedback.join(", ")}`, 4000);
    return;
  }

  // Lấy danh sách users hiện có
  let users = JSON.parse(localStorage.getItem("admin_users")) || [];
  
  // Kiểm tra email đã tồn tại chưa
  if (users.find(u => u.email === email)) {
    showPopup("⚠️ Email này đã được đăng ký!");
    return;
  }

  // Thêm user mới
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  users.push({ 
    id: newId, 
    name, 
    email, 
    phone: "", 
    password, 
    active: true 
  });
  
  // Lưu vào localStorage
  localStorage.setItem("admin_users", JSON.stringify(users));
  
  // Giữ lại cách cũ để tương thích
  localStorage.setItem("user", JSON.stringify({ name, email, password }));
  
  showPopup("🎉 Đăng ký thành công! Hãy đăng nhập nhé 😎");

  // Tự động chuyển qua tab đăng nhập sau 2 giây.
  setTimeout(() => container.classList.remove("active"), 2000);
});


// === Xử lý sự kiện đăng nhập ===
const signInForm = document.querySelector(".sign-in form");
signInForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  // Lấy thông tin người dùng đã đăng ký từ localStorage
  const storedUserJSON = localStorage.getItem("user");
  
  if (!storedUserJSON) {
    showPopup("❌ Chưa có tài khoản nào được đăng ký!");
    return;
  }

  const storedUser = JSON.parse(storedUserJSON);

  // So sánh thông tin nhập vào với thông tin đã lưu
  if (email === storedUser.email && password === storedUser.password) {
    // Khi đăng nhập thành công
    showPopup("✅ Đăng nhập thành công! Chào mừng trở lại 💪");

    // Lưu thông tin phiên đăng nhập vào sessionStorage để trang chính sử dụng.
    sessionStorage.setItem('loggedInUser', JSON.stringify({ name: storedUser.name, email: storedUser.email }));

    // Chuyển hướng sang trang chủ sau 1.5 giây
    setTimeout(() => {
        window.location.href = "../main/index.html";
    }, 1500);

  } else {
    // Khi nhập sai
    showPopup("❌ Sai email hoặc mật khẩu rồi 😢");
  }
});

// === Xử lý Logic Quên Mật Khẩu ===

const forgotPassLink = document.getElementById("forgot-pass-link");
const forgotPassModal = document.getElementById("forgot-pass-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const resetPassForm = document.getElementById("reset-pass-form");

// Mở Modal
forgotPassLink.addEventListener("click", (e) => {
  e.preventDefault();
  forgotPassModal.classList.add("active");
});

// Đóng Modal
closeModalBtn.addEventListener("click", () => {
  forgotPassModal.classList.remove("active");
});

// Xử lý Reset
resetPassForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("reset-email").value.trim();
  const newPassword = document.getElementById("new-password").value.trim();

  const storedUserJSON = localStorage.getItem("user");
  if (!storedUserJSON) {
    showPopup("❌ Không tìm thấy thông tin người dùng!");
    return;
  }

  const storedUser = JSON.parse(storedUserJSON);

  // Kiểm tra email
  if (email === storedUser.email) {
    // Cập nhật mật khẩu
    storedUser.password = newPassword;
    localStorage.setItem("user", JSON.stringify(storedUser));
    
    // Đồng bộ lên admin_users nếu tồn tại
    try {
      const adminUsersKey = 'admin_users';
      const adminUsers = JSON.parse(localStorage.getItem(adminUsersKey)) || [];
      const idx = adminUsers.findIndex(u => u.email === email);
      if (idx !== -1) {
        adminUsers[idx].password = newPassword;
        localStorage.setItem(adminUsersKey, JSON.stringify(adminUsers));
      }
    } catch (err) {
      console.error('Failed to sync password to admin_users', err);
    }

    showPopup("✅ Mật khẩu đã được đặt lại! Vui lòng đăng nhập.");
    forgotPassModal.classList.remove("active"); // Đóng modal
  } else {
    showPopup("❌ Email không chính xác!");
  }
});

