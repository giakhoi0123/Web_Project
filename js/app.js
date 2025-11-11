// Chú thích: File này chịu trách nhiệm chính cho việc hiển thị nội dung trang chủ.

// Lấy phần tử main để chèn nội dung vào.
const mainContent = document.getElementById("main-content");
// Số lượng sản phẩm hiển thị ban đầu cho mỗi danh mục.
const PRODUCTS_PER_PAGE_HOME = 4; // Đổi tên để tránh trùng lặp

// Đối tượng này ánh xạ (maps) key của danh mục (vd: 'cpu') sang một tiêu đề tiếng Việt có dấu.
const categoryTitles = {
  pc: "PC - MÁY TÍNH BỘ",
  cpu: "CPU - VI XỬ LÝ",
  vga: "VGA - CARD ĐỒ HỌA",
  ram: "RAM - BỘ NHỚ TRONG",
  case: "CASE - VỎ MÁY TÍNH",
  "man-hinh": "MÀN HÌNH",
  gear: "GEAR - PHỤ KIỆN",
};

/**
 * Chú thích: Hàm chính để vẽ nên giao diện trang chủ.
 * Nó sẽ nhóm sản phẩm theo danh mục và tạo HTML cho từng danh mục.
 */
function renderHomepage() {
  // Chú thích: Hiển thị lại banner khi về trang chủ
  const banner = document.querySelector(".banner");
  if (banner) banner.style.display = "block";

  // 1. Nhóm các sản phẩm trong mảng `products` theo từng danh mục.
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  // 2. Tạo chuỗi HTML cho từng danh mục.
  let homepageHTML = "";
  for (const category in productsByCategory) {
    const categoryProducts = productsByCategory[category];
    const title = categoryTitles[category] || category.toUpperCase();

    homepageHTML += `
            <section class="category-section" id="category-${category}">
                <h2 class="category-title">${title}</h2>
                <div class="product-grid" data-category="${category}">
                    ${renderProductGrid(
                      categoryProducts.slice(0, PRODUCTS_PER_PAGE_HOME)
                    )}
                </div>
        `;

    // Chỉ hiển thị nút "Xem thêm" nếu số sản phẩm nhiều hơn số lượng hiển thị ban đầu.
    if (categoryProducts.length > PRODUCTS_PER_PAGE_HOME) {
      homepageHTML += `
                <div class="load-more-container">
                    <button class="load-more-btn" data-category="${category}" data-page="1">Xem thêm</button>
                </div>
            `;
    }

    homepageHTML += `</section>`;
  }

  // 3. Chèn HTML vào trang
  // XÓA BỎ: addEventListeners(); khỏi đây
  mainContent.innerHTML = homepageHTML;
}

/**
 * Chú thích: Hàm này gắn các trình nghe sự kiện (event listener) TOÀN CỤC.
 * Sử dụng kỹ thuật "event delegation" để tăng hiệu suất.
 */
function setupGlobalEventListeners() {
  mainContent.addEventListener("click", (event) => {
    // Sự kiện cho nút "Thêm vào giỏ" (BẮT TẤT CẢ CÁC NÚT)
    if (event.target.classList.contains("add-to-cart-btn")) {
      const productId = event.target.getAttribute("data-id");
      addToCart(productId);
    }

    // Sự kiện cho nút "Xem thêm" (chỉ ở trang chủ)
    if (event.target.classList.contains("load-more-btn")) {
      const button = event.target;
      const category = button.dataset.category;
      let page = parseInt(button.dataset.page, 10);

      const categoryProducts = products.filter((p) => p.category === category);
      const start = page * PRODUCTS_PER_PAGE_HOME;
      const end = start + PRODUCTS_PER_PAGE_HOME;

      const productGrid = mainContent.querySelector(
        `.product-grid[data-category="${category}"]`
      );
      productGrid.innerHTML += renderProductGrid(
        categoryProducts.slice(start, end)
      );

      page++;
      button.dataset.page = page;

      // Ẩn nút nếu đã tải hết sản phẩm
      if (end >= categoryProducts.length) {
        button.style.display = "none";
      }
    }
  });
}

// THÊM MỚI: Chỉ gọi hàm này 1 LẦN DUY NHẤT khi trang tải xong
document.addEventListener("DOMContentLoaded", setupGlobalEventListeners);

// ==================================================
// LOGIC BẬT/TẮT MENU MOBILE
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const nav = document.querySelector("nav");
  const mainWrapper = document.querySelector(".main-wrapper");

  if (menuToggle && nav && mainWrapper) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("mobile-nav-active");
      mainWrapper.classList.toggle("menu-open");
    });
  }

  // Đóng menu khi bấm vào link
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("mobile-nav-active");
      mainWrapper.classList.remove("menu-open");
    }
  });
});

// ==================================================
// XỬ LÝ CHỨC NĂNG XÂY DỰNG CẤU HÌNH
// ==================================================
function handleBuildConfig(type) {
  const buildTemplates = {
    gaming: {
      title: "Cấu Hình Gaming",
      products: ["cpu", "vga", "ram"],
      description: "Cấu hình mạnh mẽ cho game thủ"
    },
    workstation: {
      title: "Cấu Hình Workstation",
      products: ["cpu", "ram", "case"],
      description: "Tối ưu cho công việc thiết kế, render"
    },
    budget: {
      title: "Cấu Hình Phổ Thông",
      products: ["pc"],
      description: "Giải pháp tiết kiệm cho văn phòng"
    }
  };

  const template = buildTemplates[type];
  if (!template) return;

  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="build-config-page">
      <h1>${template.title}</h1>
      <p class="description">${template.description}</p>
      <div class="config-builder">
        <div class="component-selector">
          <h2>Chọn linh kiện</h2>
          <!-- Render danh sách sản phẩm theo template.products -->
        </div>
        <div class="config-summary">
          <h2>Tổng quan cấu hình</h2>
          <div id="selected-components"></div>
          <div class="total-price">
            <strong>Tổng giá:</strong> <span id="config-total">0 ₫</span>
          </div>
          <button class="add-to-cart-btn">Thêm vào giỏ hàng</button>
        </div>
      </div>
    </div>
  `;
}

// ==================================================
// XỬ LÝ TRANG KHUYẾN MÃI
// ==================================================
function handlePromotionPage(type) {
  const promotions = {
    "flash-sale": {
      title: "Flash Sale - Giảm Giá Sốc",
      discount: 50
    },
    combo: {
      title: "Combo Giá Sốc",
      discount: 30
    },
    clearance: {
      title: "Thanh Lý Kho",
      discount: 40
    }
  };

  const promo = promotions[type];
  if (!promo) return;

  // Lọc sản phẩm giảm giá
  const discountedProducts = products.filter(p => Math.random() > 0.5).slice(0, 12);
  
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="promotion-page">
      <div class="promotion-header">
        <h1><i class="fa-solid fa-fire"></i> ${promo.title}</h1>
        <p class="promo-desc">Giảm đến ${promo.discount}% - Số lượng có hạn!</p>
      </div>
      <div class="product-grid">
        ${renderProductGrid(discountedProducts)}
      </div>
    </div>
  `;
}

// ==================================================
// CẬP NHẬT HASH ROUTER
// ==================================================
// Thêm vào hàm handleHashChange() hiện có
function handleHashChange() {
  const hash = window.location.hash.slice(1);
  const [route, param] = hash.split("/");

  if (route === "build") {
    handleBuildConfig(param);
  } else if (route === "promotion") {
    handlePromotionPage(param);
  } else if (route === "warranty" || route === "policy") {
    showInfoPage(route, param);
  }
  
}

function showInfoPage(route, param) {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="info-page">
      <h1>${route === "warranty" ? "Bảo Hành" : "Chính Sách"}</h1>
      <p>Nội dung trang ${param} sẽ được hiển thị tại đây.</p>
      <p>Đây là trang demo - bạn có thể thêm nội dung chi tiết sau.</p>
    </div>
  `;
}

window.addEventListener("hashchange", handleHashChange);