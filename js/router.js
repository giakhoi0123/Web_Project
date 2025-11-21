// Chú thích: File này định nghĩa và quản lý việc điều hướng trong ứng dụng trang đơn (SPA).

// Cập nhật: Số sản phẩm hiển thị trên mỗi trang
const PRODUCTS_PER_PAGE = 8;

/**
 * Helper: Lấy icon cho từng danh mục
 */
function getCategoryIcon(category) {
  const icons = {
    'cpu': '<i class="fa-solid fa-microchip"></i>',
    'vga': '<i class="fa-solid fa-display"></i>',
    'ram': '<i class="fa-solid fa-memory"></i>',
    'case': '<i class="fa-solid fa-computer"></i>',
    'monitor': '<i class="fa-solid fa-desktop"></i>',
    'pc': '<i class="fa-solid fa-tower-broadcast"></i>',
    'gear': '<i class="fa-solid fa-headset"></i>'
  };
  return icons[category] || '<i class="fa-solid fa-box"></i>';
}

const routes = {
  "": renderHomepage,
  "#home": renderHomepage,
  "#product": renderProductDetail,
  "#profile": renderProfile,
  "#cart": renderCart,
  "#search": renderSearchResults,
  "#advanced-search": renderAdvancedSearch,
  "#checkout": renderCheckout,
  "#order-confirmation": renderOrderConfirmation,
  "#order-history": renderOrderHistory,
  "#category": renderCategoryPage,
  "#policy": renderPolicyPage,
  "#warranty": renderWarrantyPage,
  "#build": renderBuildConfig,
  "#promotion": renderPromotionPage,
};

/**
 * Helper: Lấy thương hiệu từ tên sản phẩm
 */
function getProductBrand(product) {
  const name = product.name.toLowerCase();
  
  // CPU
  if (name.includes('intel') || name.includes('core i')) return 'Intel';
  if (name.includes('amd') || name.includes('ryzen')) return 'AMD';
  
  // VGA
  if (name.includes('nvidia') || name.includes('geforce') || name.includes('rtx') || name.includes('gtx')) return 'NVIDIA';
  if (name.includes('radeon') || name.includes('rx')) return 'AMD';
  if (name.includes('arc')) return 'Intel';
  
  // RAM
  if (name.includes('kingston')) return 'Kingston';
  if (name.includes('g.skill')) return 'G.Skill';
  if (name.includes('corsair')) return 'Corsair';
  if (name.includes('teamgroup') || name.includes('t-force')) return 'TeamGroup';
  if (name.includes('crucial')) return 'Crucial';
  if (name.includes('adata')) return 'ADATA';
  if (name.includes('samsung')) return 'Samsung';
  if (name.includes('klevv')) return 'KLEVV';
  if (name.includes('colorful')) return 'Colorful';
  if (name.includes('lexar')) return 'Lexar';
  
  // Case
  if (name.includes('cooler master')) return 'Cooler Master';
  if (name.includes('lian li')) return 'Lian Li';
  if (name.includes('nzxt')) return 'NZXT';
  if (name.includes('xigmatek')) return 'Xigmatek';
  if (name.includes('deepcool')) return 'DeepCool';
  if (name.includes('montech')) return 'Montech';
  if (name.includes('fractal')) return 'Fractal Design';
  if (name.includes('phanteks')) return 'Phanteks';
  if (name.includes('asus')) return 'ASUS';
  if (name.includes('segotep')) return 'Segotep';
  if (name.includes('sama')) return 'Sama';
  if (name.includes('thermaltake')) return 'Thermaltake';
  
  // Monitor
  if (name.includes('samsung')) return 'Samsung';
  if (name.includes('dell')) return 'Dell';
  if (name.includes('lg')) return 'LG';
  if (name.includes('viewsonic')) return 'ViewSonic';
  if (name.includes('acer')) return 'Acer';
  if (name.includes('msi')) return 'MSI';
  if (name.includes('aoc')) return 'AOC';
  if (name.includes('benq')) return 'BenQ';
  if (name.includes('hp')) return 'HP';
  if (name.includes('gigabyte')) return 'Gigabyte';
  if (name.includes('xiaomi')) return 'Xiaomi';
  if (name.includes('hkc')) return 'HKC';
  if (name.includes('e-dra')) return 'E-DRA';
  
  // Gear
  if (name.includes('akko')) return 'Akko';
  if (name.includes('logitech')) return 'Logitech';
  if (name.includes('dareu')) return 'DareU';
  if (name.includes('razer')) return 'Razer';
  if (name.includes('leopold')) return 'Leopold';
  if (name.includes('steelseries')) return 'SteelSeries';
  if (name.includes('hyperx')) return 'HyperX';
  if (name.includes('sony')) return 'Sony';
  if (name.includes('glorious')) return 'Glorious';
  if (name.includes('rapoo')) return 'Rapoo';
  if (name.includes('zowie')) return 'Zowie';
  
  return 'Chính hãng';
}

/**
 * Helper: Lấy thông số chi tiết theo từng loại sản phẩm
 */
function getDetailedSpecs(product) {
  const specs = {};
  
  switch(product.category) {
    case 'cpu':
      specs['Công nghệ sản xuất'] = '10nm / 7nm / 5nm';
      specs['TDP'] = '65W - 125W';
      specs['Hỗ trợ RAM'] = 'DDR4 / DDR5';
      specs['Đồ họa tích hợp'] = product.name.includes('F') ? 'Không' : 'Có';
      specs['Tản nhiệt kèm theo'] = product.name.includes('K') ? 'Không' : 'Có';
      specs['Khả năng ép xung'] = product.name.includes('K') || product.name.includes('X') ? 'Có' : 'Không';
      break;
      
    case 'vga':
      specs['Công nghệ'] = 'Ray Tracing, DLSS/FSR';
      specs['DirectX'] = 'DirectX 12 Ultimate';
      specs['Kết nối màn hình'] = 'HDMI 2.1, DisplayPort 1.4a';
      specs['Nguồn yêu cầu'] = '450W - 850W';
      specs['Kích thước'] = '2-3 slot, 250-320mm';
      specs['Tản nhiệt'] = '2-3 Fan';
      break;
      
    case 'ram':
      specs['Điện áp'] = product.specs['Loại'] === 'DDR5' ? '1.1V' : '1.2V - 1.35V';
      specs['Profile'] = 'XMP 3.0 / EXPO';
      specs['Tản nhiệt'] = 'Nhôm cao cấp';
      specs['Độ trễ (CL)'] = 'CL16 - CL40';
      specs['Chipset hỗ trợ'] = 'Intel/AMD mới nhất';
      break;
      
    case 'case':
      specs['Mainboard hỗ trợ'] = 'ATX, Micro-ATX, Mini-ITX';
      specs['VGA tối đa'] = '300-400mm';
      specs['Tản CPU tối đa'] = '165-170mm';
      specs['Số khe 2.5"'] = '2-4 khe';
      specs['Số khe 3.5"'] = '2-4 khe';
      specs['USB trước'] = 'USB 3.0, USB-C';
      specs['Vị trí nguồn'] = 'Dưới / Trên';
      specs['Chất liệu'] = 'Thép, Kính cường lực';
      break;
      
    case 'man-hinh':
      specs['Góc nhìn'] = '178°/178°';
      specs['Độ sáng'] = '250-400 cd/m²';
      specs['Độ tương phản'] = '1000:1 - 3000:1';
      specs['Thời gian phản hồi'] = '1ms - 5ms';
      specs['Cổng kết nối'] = 'HDMI, DisplayPort, USB-C';
      specs['Chân đế'] = 'Xoay, Nghiêng, Điều chỉnh độ cao';
      specs['HDR'] = product.price > 10000000 ? 'HDR10, HDR400' : 'Không';
      specs['FreeSync/G-Sync'] = 'Có';
      break;
      
    case 'gear':
      if (product.name.toLowerCase().includes('bàn phím')) {
        specs['Loại switch'] = 'Cơ học';
        specs['Keycap'] = 'PBT / ABS Double-shot';
        specs['Hot-swap'] = 'Có';
        specs['Pin'] = '4000mAh';
        specs['Thời gian sử dụng'] = '200+ giờ';
      } else if (product.name.toLowerCase().includes('chuột')) {
        specs['Độ phân giải'] = '100 - 30,000 DPI';
        specs['Tốc độ tracking'] = '400-650 IPS';
        specs['Gia tốc'] = '40-50G';
        specs['Nút bấm'] = '5-8 nút';
        specs['Pin'] = '70-100 giờ';
      } else if (product.name.toLowerCase().includes('tai nghe')) {
        specs['Driver'] = '40mm - 50mm';
        specs['Trở kháng'] = '32Ω';
        specs['Đáp ứng tần số'] = '20Hz - 20kHz';
        specs['Micro'] = 'Rời, chống ồn';
        specs['Pin'] = '20-30 giờ';
      }
      specs['Tương thích'] = 'Windows, Mac, Linux, Console';
      break;
      
    case 'pc':
      specs['Mainboard'] = 'Chính hãng';
      specs['RAM'] = '8GB - 32GB';
      specs['Ổ cứng'] = 'SSD 256GB - 1TB';
      specs['Nguồn'] = '450W - 750W 80+ Bronze';
      specs['Hệ điều hành'] = 'Windows 11 bản quyền';
      specs['Kết nối'] = 'WiFi, Bluetooth';
      break;
  }
  
  // Thông tin chung
  specs['Trọng lượng'] = 'Theo sản phẩm';
  specs['Phụ kiện đi kèm'] = 'Hướng dẫn, Cáp, Phụ kiện';
  
  return specs;
}

function router() {
  const banner = document.querySelector(".banner");
  const hash = window.location.hash;
  if (hash === "" || hash === "#home") {
    if (banner) banner.style.display = "block";
  } else {
    if (banner) banner.style.display = "none";
  }

  // Cập nhật: Logic đọc hash cho phân trang
  // Ví dụ: #category/cpu/page/2
  const parts = hash.split("/");
  let path = parts[0] || "#home";
  if (path === "") path = "#home";
  const param = parts[1];
  // Kiểm tra xem phần tử 'page' có tồn tại và lấy số trang
  const pageIndex = parts.indexOf("page");
  const page = pageIndex !== -1 ? parseInt(parts[pageIndex + 1], 10) : 1;

  if (routes[path]) {
    routes[path](param, page); // Truyền `page` vào hàm render
  } else {
    mainContent.innerHTML = "<h2>404 - Không tìm thấy trang</h2>";
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

// ==================================================
// HÀM MỚI: VẼ PHÂN TRANG
// ==================================================
/**
 * Chú thích: Hàm này tạo HTML cho các nút điều khiển phân trang.
 * @param {number} currentPage - Trang hiện tại
 * @param {number} totalPages - Tổng số trang
 * @param {string} baseUrl - URL cơ sở (vd: #category/cpu)
 */
function renderPaginationControls(currentPage, totalPages, baseUrl) {
  const container = mainContent.querySelector(".pagination-controls");
  if (!container) return;

  let html = "";

  // Nút Previous
  if (currentPage > 1) {
    html += `<a href="${baseUrl}/page/${
      currentPage - 1
    }" class="page-arrow">&lt;</a>`;
  }

  // Hiển thị tối đa 5 nút trang
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage - 2 < 1) {
    endPage = Math.min(totalPages, 5);
  }
  if (currentPage + 2 > totalPages) {
    startPage = Math.max(1, totalPages - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      html += `<span class="page-num active">${i}</span>`;
    } else {
      html += `<a href="${baseUrl}/page/${i}" class="page-num">${i}</a>`;
    }
  }

  // Nút Next
  if (currentPage < totalPages) {
    html += `<a href="${baseUrl}/page/${
      currentPage + 1
    }" class="page-arrow">&gt;</a>`;
  }

  container.innerHTML = html;
}

// ==================================================
// CÁC HÀM UTILITY DÙNG CHUNG
// ==================================================

/**
 * Chú thích: Hàm render lưới sản phẩm.
 */
function renderProductGrid(productList) {
  if (!productList || productList.length === 0) {
    return '<p class="no-results">Không tìm thấy sản phẩm nào phù hợp.</p>';
  }
  return productList
    .map(
      (product) => `
        <div class="product-card">
            <a href="#product/${product.id}" class="product-link">
                <img src="${product.image}" alt="${
        product.name
      }" class="product-image">
                <h3 class="product-name">${product.name}</h3>
            </a>
            <p class="product-price">${parseInt(
              product.price
            ).toLocaleString("vi-VN")}đ</p>
            <button class="add-to-cart-btn" data-id="${
              product.id
            }">Thêm vào giỏ</button>
        </div>
    `
    )
    .join("");
}

// ==================================================
// CÁC HÀM HIỂN THỊ VIEW (GIAO DIỆN)
// ==================================================

/**
 * Chú thích: Hiển thị trang danh mục
 * Cập nhật: Thêm logic phân trang
 */
function renderCategoryPage(categoryName, page = 1) {
  const allCategoryProducts = products.filter(
    (p) => p.category === categoryName
  );
  const title = categoryTitles[categoryName] || "Danh mục không xác định";

  // BỘ LỌC THÔNG MINH (LOGIC TỪ TRƯỚC)
  const importantFilters = {
    cpu: ["Hãng", "Socket", "Phân khúc"],
    vga: ["Hãng", "VRAM", "Độ phân giải"],
    ram: ["Loại", "Dung lượng", "Tốc độ"],
    case: ["Loại", "Màu sắc", "Mặt trước"],
    "man-hinh": ["Kích thước", "Độ phân giải", "Tấm nền", "Tần số quét"],
    gear: ["Loại", "Kết nối"],
    pc: ["Nhu cầu", "CPU", "VGA"],
  };
  const nhuCauMap = {
    "Gaming Cơ Bản": "Gaming",
    "Gaming 1080p": "Gaming",
    "Gaming 2K": "Gaming",
    "Gaming 4K": "Gaming",
    "Gaming & Stream": "Gaming",
    "Đồ Họa 2D": "Đồ Họa / Sáng tạo",
    "Edit Video": "Đồ Họa / Sáng tạo",
    "3D & Render": "Đồ Họa / Sáng tạo",
    "Văn Phòng": "Văn Phòng",
  };
  const productsToFilter = allCategoryProducts.map((product) => {
    if (categoryName === "pc" && product.specs["Nhu cầu"]) {
      const originalNhuCau = product.specs["Nhu cầu"];
      const normalizedNhuCau = nhuCauMap[originalNhuCau] || originalNhuCau;
      return {
        ...product,
        specs: { ...product.specs, "Nhu cầu": normalizedNhuCau },
      };
    }
    if (categoryName === "gear") {
      let normalizedLoai = product.specs["Loại"];
      const name = product.name.toLowerCase();
      if (name.includes("bàn phím")) normalizedLoai = "Bàn phím";
      else if (name.includes("chuột")) normalizedLoai = "Chuột";
      else if (name.includes("tai nghe")) normalizedLoai = "Tai nghe";
      else if (name.includes("mousepad") || name.includes("lót chuột"))
        normalizedLoai = "Lót chuột";
      else if (name.includes("webcam")) normalizedLoai = "Webcam";
      return {
        ...product,
        specs: { ...product.specs, "Loại": normalizedLoai },
      };
    }
    return product;
  });
  // KẾT THÚC BỘ LỌC THÔNG MINH

  const filters = {};
  const filterKeys =
    importantFilters[categoryName] ||
    Object.keys(productsToFilter[0]?.specs || {});
  productsToFilter.forEach((product) => {
    for (const key of filterKeys) {
      if (product.specs[key]) {
        if (!filters[key]) {
          filters[key] = new Set();
        }
        filters[key].add(product.specs[key]);
      }
    }
  });

  let filterHTML = '<div class="filter-controls">';
  filterHTML += '<div class="filter-container">';
  for (const key of filterKeys) {
    if (filters[key]) {
      filterHTML += `<div class="filter-group"><label>${key}</label><select data-filter-key="${key}"><option value="">Tất cả</option>`;
      const sortedOptions = Array.from(filters[key]).sort();
      sortedOptions.forEach((value) => {
        filterHTML += `<option value="${value}">${value}</option>`;
      });
      filterHTML += `</select></div>`;
    }
  }
  filterHTML += "</div>";
  filterHTML +=
    '<div class="sort-container"><label>Sắp xếp</label><select id="sort-by"><option value="default">Mặc định</option><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option></select></div>';
  filterHTML += "</div>";

  mainContent.innerHTML = `
        <div class="category-page-container">
            <div class="category-hero">
                <div class="breadcrumb">
                    <a href="#home"><i class="fa-solid fa-house"></i> Trang chủ</a> 
                    <i class="fa-solid fa-chevron-right"></i>
                    <span>${title}</span>
                </div>
                <div class="category-header">
                    <div class="category-icon">
                        ${getCategoryIcon(categoryName)}
                    </div>
                    <div class="category-title-wrapper">
                        <h1 class="category-title">${title}</h1>
                        <p class="category-subtitle">Khám phá ${productsToFilter.length} sản phẩm chất lượng cao</p>
                    </div>
                </div>
            </div>
            ${filterHTML}
            <div class="products-section">
                <div class="section-header">
                    <h3><i class="fa-solid fa-grid-2"></i> Danh sách sản phẩm</h3>
                    <span class="product-count" id="product-count-badge">${productsToFilter.length} sản phẩm</span>
                </div>
                <div class="product-grid"></div>
            </div>
            <div class="pagination-controls"></div>
        </div>
    `;

  const productGridContainer = mainContent.querySelector(".product-grid");
  const controlsContainer = mainContent.querySelector(".filter-controls");

  function applyFiltersAndSorting() {
    const activeFilters = {};
    controlsContainer
      .querySelectorAll("select[data-filter-key]")
      .forEach((select) => {
        if (select.value) {
          activeFilters[select.dataset.filterKey] = select.value;
        }
      });
    let filteredProducts = productsToFilter.filter((product) => {
      for (const key in activeFilters) {
        if (!product.specs[key] || product.specs[key] !== activeFilters[key])
          return false;
      }
      return true;
    });
    const sortBy = controlsContainer.querySelector("#sort-by").value;
    if (sortBy === "price-asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    // CẬP NHẬT LOGIC PHÂN TRANG
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const productsForPage = filteredProducts.slice(start, end);

    productGridContainer.innerHTML = renderProductGrid(productsForPage);

    // Vẽ phân trang
    renderPaginationControls(page, totalPages, `#category/${categoryName}`);
  }

  controlsContainer.addEventListener("change", applyFiltersAndSorting);
  
  // XÓA BỎ: productGridContainer.addEventListener('click', ...)

  applyFiltersAndSorting();
}

/**
 * Chú thích: Hiển thị trang chi tiết sản phẩm - NÂNG CẤP
 */
function renderProductDetail(id) {
  const productId = parseInt(id, 10);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    mainContent.innerHTML = `
      <div class="error-404">
        <i class="fa-solid fa-box-open"></i>
        <h2>404 - Không tìm thấy sản phẩm</h2>
        <p>Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <a href="#home" class="btn-back-home">Về trang chủ</a>
      </div>
    `;
    return;
  }

  // Tạo danh sách thông số kỹ thuật CHI TIẾT
  let specsHTML = '<div class="specs-grid">';
  
  // Thêm thông số từ product.specs
  for (const key in product.specs) {
    specsHTML += `
      <div class="spec-item">
        <div class="spec-label">${key}</div>
        <div class="spec-value">${product.specs[key]}</div>
      </div>
    `;
  }
  
  // Thêm các thông số chung
  const commonSpecs = {
    "Mã sản phẩm": `SP${String(product.id).padStart(5, '0')}`,
    "Tình trạng": "Còn hàng",
    "Bảo hành": product.category === 'cpu' || product.category === 'vga' || product.category === 'ram' ? "36 tháng" : 
                product.category === 'pc' ? "24 tháng" : "12 tháng",
    "Xuất xứ": "Nhập khẩu chính hãng",
    "Thương hiệu": getProductBrand(product),
  };
  
  for (const key in commonSpecs) {
    specsHTML += `
      <div class="spec-item">
        <div class="spec-label">${key}</div>
        <div class="spec-value">${commonSpecs[key]}</div>
      </div>
    `;
  }
  
  // Thêm thông số kỹ thuật chi tiết theo từng loại sản phẩm
  const detailedSpecs = getDetailedSpecs(product);
  for (const key in detailedSpecs) {
    specsHTML += `
      <div class="spec-item">
        <div class="spec-label">${key}</div>
        <div class="spec-value">${detailedSpecs[key]}</div>
      </div>
    `;
  }
  
  specsHTML += "</div>";

  // Tìm sản phẩm liên quan (cùng danh mục, khác ID)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const categoryName = categoryTitles[product.category] || product.category;
  
  mainContent.innerHTML = `
    <div class="product-detail-container">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <a href="#home"><i class="fa-solid fa-house"></i> Trang chủ</a> 
        <i class="fa-solid fa-chevron-right"></i>
        <a href="#category/${product.category}">${categoryName}</a> 
        <i class="fa-solid fa-chevron-right"></i>
        <span>${product.name}</span>
      </div>

      <!-- Phần chính -->
      <div class="product-detail-main">
        <!-- Ảnh sản phẩm - ĐƠN GIẢN HÓA -->
        <div class="product-detail-gallery">
          <div class="main-image-single">
            <img src="${product.image}" alt="${product.name}">
            <div class="image-badge">
              <i class="fa-solid fa-shield-halved"></i> Bảo hành chính hãng
            </div>
          </div>
        </div>

        <!-- Thông tin sản phẩm -->
        <div class="product-detail-info">
          <h1 class="product-title">${product.name}</h1>
          
          <!-- Đánh giá -->
          <div class="product-rating">
            <div class="stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star-half-stroke"></i>
              <span class="rating-text">4.5/5 (128 đánh giá)</span>
            </div>
            <div class="product-status" id="stock-status">
              <i class="fa-solid fa-circle-check"></i> Đang tải...
            </div>
          </div>

          <!-- Giá -->
          <div class="product-pricing">
            <div class="main-price" id="product-total-price">${parseInt(product.price).toLocaleString("vi-VN")}đ</div>
            <div class="price-note">
              <i class="fa-solid fa-tag"></i> Giá đã bao gồm VAT
            </div>
          </div>

          <!-- Khuyến mãi -->
          <div class="product-promotions">
            <h3><i class="fa-solid fa-gift"></i> Ưu đãi đặc biệt</h3>
            <ul>
              <li><i class="fa-solid fa-circle-check"></i> Giảm 5% khi thanh toán qua VNPay</li>
              <li><i class="fa-solid fa-circle-check"></i> Tặng thêm 1 sản phẩm phụ kiện</li>
              <li><i class="fa-solid fa-circle-check"></i> Miễn phí vận chuyển toàn quốc</li>
            </ul>
          </div>

          <!-- Số lượng và nút -->
          <div class="product-actions">
            <div class="quantity-selector">
              <label>Số lượng:</label>
              <div class="quantity-controls">
                <button class="qty-btn minus"><i class="fa-solid fa-minus"></i></button>
                <input type="number" class="qty-input" value="1" min="1" max="99">
                <button class="qty-btn plus"><i class="fa-solid fa-plus"></i></button>
              </div>
            </div>
            
            <button class="add-to-cart-btn-large" data-id="${product.id}">
              <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ hàng
            </button>
            
            <button class="buy-now-btn" data-id="${product.id}">
              <i class="fa-solid fa-bolt"></i> Mua ngay
            </button>
          </div>

          <!-- Thông tin bảo hành -->
          <div class="warranty-info">
            <div class="warranty-item">
              <i class="fa-solid fa-shield-halved"></i>
              <div>
                <strong>Bảo hành chính hãng</strong>
                <p>24-36 tháng</p>
              </div>
            </div>
            <div class="warranty-item">
              <i class="fa-solid fa-rotate-left"></i>
              <div>
                <strong>Đổi trả miễn phí</strong>
                <p>Trong vòng 7 ngày</p>
              </div>
            </div>
            <div class="warranty-item">
              <i class="fa-solid fa-truck-fast"></i>
              <div>
                <strong>Giao hàng nhanh</strong>
                <p>1-3 ngày toàn quốc</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs thông tin chi tiết -->
      <div class="product-detail-tabs">
        <div class="tab-headers">
          <button class="tab-header active" data-tab="specs">
            <i class="fa-solid fa-microchip"></i> Thông số kỹ thuật
          </button>
          <button class="tab-header" data-tab="description">
            <i class="fa-solid fa-file-lines"></i> Mô tả sản phẩm
          </button>
          <button class="tab-header" data-tab="reviews">
            <i class="fa-solid fa-star"></i> Đánh giá (128)
          </button>
        </div>

        <div class="tab-contents">
          <!-- Tab Thông số kỹ thuật -->
          <div class="tab-content active" id="tab-specs">
            <h3>Thông số kỹ thuật chi tiết</h3>
            ${specsHTML}
          </div>

          <!-- Tab Mô tả -->
          <div class="tab-content" id="tab-description">
            <h3>Mô tả sản phẩm</h3>
            <p>${product.name} là sản phẩm chất lượng cao, được nhập khẩu chính hãng với đầy đủ giấy tờ và tem bảo hành. Sản phẩm được kiểm tra kỹ lưỡng trước khi giao đến tay khách hàng.</p>
            <ul>
              <li>✓ Sản phẩm chính hãng 100%</li>
              <li>✓ Bảo hành toàn quốc</li>
              <li>✓ Hỗ trợ kỹ thuật miễn phí</li>
              <li>✓ Đổi mới trong 30 ngày nếu có lỗi từ nhà sản xuất</li>
            </ul>
          </div>

          <!-- Tab Đánh giá -->
          <div class="tab-content" id="tab-reviews">
            <h3>Đánh giá từ khách hàng</h3>
            <div class="review-summary">
              <div class="review-score">
                <div class="score-number">4.5</div>
                <div class="stars">
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star-half-stroke"></i>
                </div>
                <p>128 đánh giá</p>
              </div>
              <div class="review-breakdown">
                <div class="review-bar">
                  <span>5 <i class="fa-solid fa-star"></i></span>
                  <div class="bar"><div class="fill" style="width: 75%"></div></div>
                  <span>96</span>
                </div>
                <div class="review-bar">
                  <span>4 <i class="fa-solid fa-star"></i></span>
                  <div class="bar"><div class="fill" style="width: 15%"></div></div>
                  <span>19</span>
                </div>
                <div class="review-bar">
                  <span>3 <i class="fa-solid fa-star"></i></span>
                  <div class="bar"><div class="fill" style="width: 6%"></div></div>
                  <span>8</span>
                </div>
                <div class="review-bar">
                  <span>2 <i class="fa-solid fa-star"></i></span>
                  <div class="bar"><div class="fill" style="width: 3%"></div></div>
                  <span>4</span>
                </div>
                <div class="review-bar">
                  <span>1 <i class="fa-solid fa-star"></i></span>
                  <div class="bar"><div class="fill" style="width: 1%"></div></div>
                  <span>1</span>
                </div>
              </div>
            </div>

            <div class="review-list">
              <div class="review-item">
                <div class="review-header">
                  <div class="reviewer-name">Nguyễn Văn A</div>
                  <div class="review-stars">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                  </div>
                </div>
                <div class="review-date">15/10/2024</div>
                <div class="review-text">Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận. Giá cả hợp lý, sẽ ủng hộ shop lâu dài!</div>
              </div>

              <div class="review-item">
                <div class="review-header">
                  <div class="reviewer-name">Trần Thị B</div>
                  <div class="review-stars">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-regular fa-star"></i>
                  </div>
                </div>
                <div class="review-date">12/10/2024</div>
                <div class="review-text">Chất lượng ok, giá hơi cao nhưng chấp nhận được. Hỗ trợ nhiệt tình.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sản phẩm liên quan -->
      ${relatedProducts.length > 0 ? `
        <div class="related-products">
          <h2><i class="fa-solid fa-layer-group"></i> Sản phẩm liên quan</h2>
          <div class="product-grid">
            ${renderProductGrid(relatedProducts)}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // Xử lý logic tabs
  const tabHeaders = mainContent.querySelectorAll('.tab-header');
  const tabContents = mainContent.querySelectorAll('.tab-content');

  tabHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const tabId = header.dataset.tab;
      
      tabHeaders.forEach(h => h.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      header.classList.add('active');
      mainContent.querySelector(`#tab-${tabId}`).classList.add('active');
    });
  });

  // Xử lý số lượng
  const qtyInput = mainContent.querySelector('.qty-input');
  const minusBtn = mainContent.querySelector('.qty-btn.minus');
  const plusBtn = mainContent.querySelector('.qty-btn.plus');
  const totalPriceEl = mainContent.querySelector('#product-total-price');
  const stockStatusEl = mainContent.querySelector('#stock-status');
  
  const basePrice = parseInt(product.price);
  
  function updateTotalPrice() {
    const qty = parseInt(qtyInput.value) || 1;
    const total = basePrice * qty;
    totalPriceEl.textContent = total.toLocaleString("vi-VN") + "đ";
  }
  
  // Kiểm tra tồn kho
  function checkInventory() {
    const adminInventory = JSON.parse(localStorage.getItem('admin_inventory')) || [];
    const inventoryItem = adminInventory.find(inv => Number(inv.productId) === Number(product.id));
    return inventoryItem ? inventoryItem.quantity : 0;
  }
  
  // Cập nhật hiển thị trạng thái kho
  function updateStockStatus() {
    const stock = checkInventory();
    if (stock <= 0) {
      stockStatusEl.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <span style="color: #ef4444;">Hết hàng</span>';
    } else if (stock < 5) {
      stockStatusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span style="color: #f59e0b;">Chỉ còn ${stock} sản phẩm</span>`;
    } else {
      stockStatusEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> Còn hàng (${stock} sản phẩm)`;
    }
  }
  
  // Cập nhật ngay khi load
  updateStockStatus();

  minusBtn.addEventListener('click', () => {
    const currentValue = parseInt(qtyInput.value);
    if (currentValue > 1) {
      qtyInput.value = currentValue - 1;
      updateTotalPrice();
    }
  });

  plusBtn.addEventListener('click', () => {
    const currentValue = parseInt(qtyInput.value);
    const availableStock = checkInventory();
    
    if (currentValue >= availableStock && availableStock > 0) {
      showPopup(`⚠️ Chỉ còn ${availableStock} sản phẩm trong kho!`, 2500);
      return;
    }
    
    if (currentValue < 99) {
      qtyInput.value = currentValue + 1;
      updateTotalPrice();
    }
  });
  
  qtyInput.addEventListener('change', () => {
    let value = parseInt(qtyInput.value) || 1;
    const availableStock = checkInventory();
    
    if (value < 1) value = 1;
    if (value > 99) value = 99;
    if (availableStock > 0 && value > availableStock) {
      value = availableStock;
      showPopup(`⚠️ Chỉ còn ${availableStock} sản phẩm trong kho!`, 2500);
    }
    
    qtyInput.value = value;
    updateTotalPrice();
  });

  // Xử lý nút Thêm vào giỏ
  mainContent.querySelector('.add-to-cart-btn-large').addEventListener('click', () => {
    const quantity = parseInt(qtyInput.value);
    const availableStock = checkInventory();
    
    // Kiểm tra tồn kho trước khi thêm
    if (availableStock <= 0) {
      showPopup("❌ Sản phẩm này hiện đã hết hàng!", 2500);
      return;
    }
    
    // Kiểm tra số lượng trong giỏ hiện tại
    const cart = getCart();
    const cartItem = cart.find(item => item.id === product.id);
    const currentCartQty = cartItem ? cartItem.quantity : 0;
    
    if (currentCartQty + quantity > availableStock) {
      showPopup(`⚠️ Không đủ hàng! Còn ${availableStock} sản phẩm, bạn đã có ${currentCartQty} trong giỏ`, 3000);
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id);
    }
  });

  // Xử lý nút Mua ngay
  mainContent.querySelector('.buy-now-btn').addEventListener('click', () => {
    const quantity = parseInt(qtyInput.value);
    const availableStock = checkInventory();
    
    // Kiểm tra tồn kho
    if (availableStock <= 0) {
      showPopup("❌ Sản phẩm này hiện đã hết hàng!", 2500);
      return;
    }
    
    const cart = getCart();
    const cartItem = cart.find(item => item.id === product.id);
    const currentCartQty = cartItem ? cartItem.quantity : 0;
    
    if (currentCartQty + quantity > availableStock) {
      showPopup(`⚠️ Không đủ hàng! Còn ${availableStock} sản phẩm, bạn đã có ${currentCartQty} trong giỏ`, 3000);
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id);
    }
    window.location.hash = '#cart';
  });
}

/**
 * Chú thích: Hiển thị trang giỏ hàng.
 */
function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    mainContent.innerHTML = `
            <div class="cart-container empty-cart-container">
                <i class="fa-solid fa-box-open empty-cart-icon"></i>
                <h2>Giỏ hàng của bạn đang trống</h2>
                <p>Hãy lấp đầy giỏ hàng bằng những sản phẩm tuyệt vời nhé!</p>
                <a href="#home" class="btn-primary-action">Tiếp tục mua sắm</a>
            </div>
        `;
    return;
  }
  let tableRows = "";
  let totalAmount = 0;
  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      tableRows += `
                <tr>
                    <td data-label="Sản phẩm">
                        <div class="cart-product-info">
                            <img src="${product.image}" alt="${product.name}">
                            <div>
                                <a href="#product/${product.id}">${
        product.name
      }</a>
                                <p>${parseInt(product.price).toLocaleString(
                                  "vi-VN"
                                )}đ</p>
                            </div>
                        </div>
                    </td>
                    <td data-label="Số lượng">
                        <input type="number" class="quantity-input" value="${
                          item.quantity
                        }" min="1" data-id="${product.id}">
                    </td>
                    <td data-label="Tổng cộng">${itemTotal.toLocaleString(
                      "vi-VN"
                    )}đ</td>
                    <td data-label="Xóa">
                        <button class="remove-btn" data-id="${
                          product.id
                        }">&times;</button>
                    </td>
                </tr>
            `;
    }
  });
  mainContent.innerHTML = `
        <div class="cart-container">
            <h2>Giỏ hàng của bạn</h2>
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Tổng cộng</th>
                        <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            <div class="cart-summary">
                <h3>Tổng tiền: ${totalAmount.toLocaleString("vi-VN")}đ</h3>
                <a href="#checkout" class="checkout-btn">Tiến hành thanh toán</a>
            </div>
        </div>
    `;
  addCartEventListeners();
}

/**
 * Chú thích: Gắn sự kiện cho các nút trong giỏ hàng.
 * (Lưu ý: listener này vẫn cần thiết vì nó xử lý nút "Xóa" và "Số lượng")
 */
function addCartEventListeners() {
  mainContent.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const productId = parseInt(e.target.dataset.id, 10);
      let cart = getCart();
      cart = cart.filter((item) => item.id !== productId);
      saveCart(cart);
      renderCart();
    }
  });
  mainContent.addEventListener("change", (e) => {
    if (e.target.classList.contains("quantity-input")) {
      const productId = parseInt(e.target.dataset.id, 10);
      const newQuantity = parseInt(e.target.value, 10);
      
      // Kiểm tra tồn kho
      const adminInventory = JSON.parse(localStorage.getItem('admin_inventory')) || [];
      const inventoryItem = adminInventory.find(inv => Number(inv.productId) === productId);
      const availableStock = inventoryItem ? inventoryItem.quantity : 0;
      
      let cart = getCart();
      const item = cart.find((i) => i.id === productId);
      
      if (item && newQuantity > 0) {
        if (newQuantity > availableStock && availableStock > 0) {
          showPopup(`⚠️ Chỉ còn ${availableStock} sản phẩm trong kho!`, 2500);
          item.quantity = availableStock;
        } else if (availableStock <= 0) {
          showPopup("❌ Sản phẩm này hiện đã hết hàng!", 2500);
          item.quantity = 0;
        } else {
          item.quantity = newQuantity;
        }
      }
      saveCart(cart);
      renderCart();
    }
  });
}

/**
 * Chú thích: Hiển thị trang kết quả tìm kiếm.
 */
function renderSearchResults(encodedQuery, page = 1) {
  const query = decodeURIComponent(encodedQuery || "").toLowerCase();
  const results = products.filter((p) =>
    p.name.toLowerCase().includes(query)
  );

  // CẬP NHẬT LOGIC PHÂN TRANG
  const totalProducts = results.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const productsForPage = results.slice(start, end);

  mainContent.innerHTML = `
        <div class="search-results-container">
            <h2>Kết quả tìm kiếm cho: "${query}"</h2>
            <div class="product-grid">
                ${renderProductGrid(productsForPage)}
            </div>
            <div class="pagination-controls"></div> </div>
    `;

  // Vẽ phân trang
  renderPaginationControls(page, totalPages, `#search/${encodedQuery}`);

  // XÓA BỎ: mainContent.querySelector('.product-grid').addEventListener('click', ...)
}

/**
 * Chú thích: Hiển thị trang tìm kiếm nâng cao.
 */
function renderAdvancedSearch() {
  // Build category sidebar
  let categorySidebar = '';
  for (const key in categoryTitles) {
    const icon = getCategoryIcon(key);
    categorySidebar += `
      <div class="category-sidebar-item" data-category="${key}">
        <div class="category-icon">${icon}</div>
        <span class="category-name">${categoryTitles[key]}</span>
      </div>
    `;
  }

  mainContent.innerHTML = `
    <div class="advanced-search-page">
      <!-- Header -->
      <div class="advanced-search-header">
        <div class="search-header-content">
          <h1 class="search-title">
            <i class="fas fa-search-plus"></i>
            Tìm Kiếm Nâng Cao
          </h1>
          <p class="search-subtitle">Tìm sản phẩm hoàn hảo với bộ lọc chi tiết</p>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="advanced-search-layout">
        <!-- Left Sidebar: Categories -->
        <aside class="category-sidebar">
          <div class="sidebar-header">
            <i class="fas fa-layer-group"></i>
            <h3>Danh Mục</h3>
          </div>
          <div class="category-sidebar-item active" data-category="">
            <div class="category-icon">🏠</div>
            <span class="category-name">TẤT CẢ</span>
          </div>
          ${categorySidebar}
        </aside>

        <!-- Right Content: Search & Results -->
        <div class="search-main-content">
          <!-- Search Filters -->
          <div class="search-filters-card">
            <div class="filters-header">
              <i class="fas fa-sliders-h"></i>
              <h3>Bộ Lọc</h3>
            </div>
            <form id="advanced-search-form">
              <div class="filter-row">
                <div class="filter-item">
                  <label>
                    <i class="fas fa-dollar-sign"></i>
                    Giá từ (VNĐ)
                  </label>
                  <input type="number" id="search-price-min" placeholder="Tối thiểu" min="0" step="100000">
                </div>
                <div class="filter-item">
                  <label>
                    <i class="fas fa-dollar-sign"></i>
                    Giá đến (VNĐ)
                  </label>
                  <input type="number" id="search-price-max" placeholder="Tối đa" min="0" step="100000">
                </div>
              </div>
              <div class="filter-actions">
                <button type="submit" class="btn-apply-filter">
                  <i class="fas fa-check-circle"></i>
                  Áp Dụng Bộ Lọc
                </button>
                <button type="button" class="btn-reset-filter" id="reset-filters">
                  <i class="fas fa-redo"></i>
                  Đặt Lại
                </button>
              </div>
            </form>
          </div>

          <!-- Results Summary -->
          <div class="results-summary">
            <div class="summary-info">
              <i class="fas fa-box"></i>
              <span id="results-count">Chưa có kết quả</span>
            </div>
            <div class="sort-options">
              <label><i class="fas fa-sort"></i> Sắp xếp:</label>
              <select id="sort-select">
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="name-asc">Tên: A → Z</option>
              </select>
            </div>
          </div>

          <!-- Search Results -->
          <div id="advanced-search-results" class="product-grid">
            <div class="empty-results">
              <i class="fas fa-search"></i>
              <p>Chọn danh mục và áp dụng bộ lọc để tìm sản phẩm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // State management
  let selectedCategory = '';
  let currentSort = 'default';
  
  // Category selection
  const categoryItems = mainContent.querySelectorAll('.category-sidebar-item');
  categoryItems.forEach(item => {
    item.addEventListener('click', function() {
      // Update active state
      categoryItems.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
      // Update selected category
      selectedCategory = this.dataset.category;
      
      // Auto-search with current filters
      performSearch();
    });
  });

  // Sort selection
  const sortSelect = mainContent.querySelector('#sort-select');
  sortSelect.addEventListener('change', function() {
    currentSort = this.value;
    performSearch();
  });

  // Form submit
  const form = mainContent.querySelector('#advanced-search-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    performSearch();
  });

  // Reset filters
  mainContent.querySelector('#reset-filters').addEventListener('click', function() {
    mainContent.querySelector('#search-price-min').value = '';
    mainContent.querySelector('#search-price-max').value = '';
    categoryItems.forEach(c => c.classList.remove('active'));
    categoryItems[0].classList.add('active');
    selectedCategory = '';
    currentSort = 'default';
    sortSelect.value = 'default';
    
    // Clear results
    const resultsDiv = mainContent.querySelector('#advanced-search-results');
    resultsDiv.innerHTML = `
      <div class="empty-results">
        <i class="fas fa-search"></i>
        <p>Chọn danh mục và áp dụng bộ lọc để tìm sản phẩm</p>
      </div>
    `;
    mainContent.querySelector('#results-count').textContent = 'Chưa có kết quả';
  });

  // Search function
  function performSearch() {
    const priceMin = parseFloat(mainContent.querySelector('#search-price-min').value) || 0;
    const priceMax = parseFloat(mainContent.querySelector('#search-price-max').value) || Infinity;

    // Validate price range
    if (priceMin > priceMax && priceMax !== Infinity) {
      showPopup("❌ Giá từ không được lớn hơn giá đến!", 2500);
      return;
    }

    // Filter products
    let results = products;
    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory);
    }
    results = results.filter((p) => {
      const price = parseFloat(p.price);
      return price >= priceMin && price <= priceMax;
    });

    // Sort results
    if (currentSort === 'price-asc') {
      results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (currentSort === 'price-desc') {
      results.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (currentSort === 'name-asc') {
      results.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    // Update results count
    mainContent.querySelector('#results-count').textContent = 
      `Tìm thấy ${results.length} sản phẩm`;

    // Display results
    const resultsDiv = mainContent.querySelector('#advanced-search-results');
    if (results.length === 0) {
      resultsDiv.innerHTML = `
        <div class="empty-results">
          <i class="fas fa-inbox"></i>
          <p>Không tìm thấy sản phẩm phù hợp</p>
        </div>
      `;
    } else {
      resultsDiv.innerHTML = renderProductGrid(results);
    }
  }
}


/**
 * Chú thích: Hiển thị trang thông tin cá nhân.
 */
function renderProfile() {
  if (!isUserLoggedIn()) {
    showPopup("Vui lòng đăng nhập để xem thông tin.", 2000);
    window.location.hash = "#home";
    return;
  }
  const user = getLoggedInUser();
  
  // Lấy thông tin đầy đủ từ admin_users (nếu có)
  const adminUsers = JSON.parse(localStorage.getItem('admin_users')) || [];
  const fullUserData = adminUsers.find(u => u.email === user.email) || user;
  const userPhone = fullUserData.phone || '';
  const userAddress = fullUserData.address || '';
  
  mainContent.innerHTML = `
        <div class="profile-container">
            <h2>Thông tin tài khoản</h2>
            <a href="#order-history" class="btn-order-history">Xem lịch sử đơn hàng</a>
            <form id="profile-form">
                <div class="form-group">
                    <label for="profile-email">Email</label>
                    <input type="email" id="profile-email" value="${user.email}" disabled>
                </div>
                <div class="form-group">
                    <label for="profile-name">Họ và tên</label>
                    <input type="text" id="profile-name" value="${user.name}">
                </div>
                <div class="form-group">
                    <label for="profile-phone">Số điện thoại</label>
                    <input type="tel" id="profile-phone" placeholder="Chưa cập nhật" value="${userPhone}">
                </div>
                <div class="form-group">
                    <label for="profile-address">Địa chỉ</label>
                    <input type="text" id="profile-address" placeholder="Chưa cập nhật" value="${userAddress}">
                </div>
                <button type="submit" class="btn-update-profile">Cập nhật thông tin</button>
            </form>
            <hr style="margin: 40px 0;">
            <h2>Đổi Mật Khẩu</h2>
            <form id="change-password-form">
                <div class="form-group">
                    <label for="old-password">Mật khẩu cũ</label>
                    <input type="password" id="old-password" required>
                </div>
                <div class="form-group">
                    <label for="new-password">Mật khẩu mới</label>
                    <input type="password" id="new-password-profile" required>
                </div>
                <div class="form-group">
                    <label for="confirm-new-password">Xác nhận mật khẩu mới</label>
                    <input type="password" id="confirm-new-password" required>
                </div>
                <button type="submit" class="btn-update-profile">Đổi Mật Khẩu</button>
            </form>
        </div>
    `;
    
  // XỬ LÝ CẬP NHẬT THÔNG TIN
  mainContent.querySelector("#profile-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const newName = document.getElementById("profile-name").value.trim();
    const newPhone = document.getElementById("profile-phone").value.trim();
    const newAddress = document.getElementById("profile-address").value.trim();
    
    // Validate phone (nếu có nhập)
    if (newPhone && !/^[0-9]{10,11}$/.test(newPhone)) {
        showPopup("❌ Số điện thoại phải có 10-11 chữ số!", 2500);
        return;
    }
    
    // Cập nhật sessionStorage (user hiện tại)
    user.name = newName;
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    
    // Cập nhật vào admin_users (để lưu phone và address)
    const adminUsers = JSON.parse(localStorage.getItem('admin_users')) || [];
    const userIndex = adminUsers.findIndex(u => u.email === user.email);
    
    if (userIndex !== -1) {
        // User đã có trong admin_users → Cập nhật
        adminUsers[userIndex].name = newName;
        adminUsers[userIndex].phone = newPhone;
        adminUsers[userIndex].address = newAddress;
    } else {
        // User chưa có trong admin_users → Thêm mới
        adminUsers.push({
            id: adminUsers.length + 1,
            name: newName,
            email: user.email,
            phone: newPhone,
            address: newAddress,
            password: user.password,
            active: true
        });
    }
    
    localStorage.setItem('admin_users', JSON.stringify(adminUsers));
    
    showPopup("✅ Đã cập nhật thông tin!", 2000);
    
    // Cập nhật header hiển thị tên mới
    updateUserDisplay();
  });
  
  mainContent
    .querySelector("#change-password-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const oldPass = document.getElementById("old-password").value;
      const newPass = document.getElementById("new-password-profile").value;
      const confirmNewPass = document.getElementById(
        "confirm-new-password"
      ).value;
      if (newPass !== confirmNewPass) {
        showPopup("❌ Mật khẩu mới không khớp!");
        return;
      }
      const storedUserJSON = localStorage.getItem("user");
      if (!storedUserJSON) {
        showPopup("❌ Lỗi: Không tìm thấy dữ liệu người dùng.");
        return;
      }
      const storedUser = JSON.parse(storedUserJSON);
      if (oldPass === storedUser.password) {
        storedUser.password = newPass;
        localStorage.setItem("user", JSON.stringify(storedUser));
        
        // Cập nhật password trong admin_users
        const adminUsers = JSON.parse(localStorage.getItem('admin_users')) || [];
        const userIndex = adminUsers.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            adminUsers[userIndex].password = newPass;
            localStorage.setItem('admin_users', JSON.stringify(adminUsers));
        }
        
        showPopup("✅ Đổi mật khẩu thành công!");
        document.getElementById("old-password").value = "";
        document.getElementById("new-password-profile").value = "";
        document.getElementById("confirm-new-password").value = "";
      } else {
        showPopup("❌ Mật khẩu cũ không chính xác!");
      }
    });
}

/**
 * Chú thích: Hiển thị trang thanh toán.
 */
function renderCheckout() {
  if (!isUserLoggedIn()) {
    showPopup("Vui lòng đăng nhập để thanh toán.", 2500);
    window.location.href = "../login/index.html";
    return;
  }
  const cart = getCart();
  if (cart.length === 0) {
    showPopup("Giỏ hàng rỗng, không thể thanh toán.", 2000);
    window.location.hash = "#cart";
    return;
  }
  const user = getLoggedInUser();
  
  // Lấy thông tin đầy đủ từ admin_users (bao gồm phone và address)
  const adminUsers = JSON.parse(localStorage.getItem('admin_users')) || [];
  const fullUserData = adminUsers.find(u => u.email === user.email) || user;
  const userPhone = fullUserData.phone || '';
  const userAddress = fullUserData.address || '';
  
  let summaryHTML = "";
  let totalAmount = 0;
  let ShipCod = 30000;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      summaryHTML += `
        <div class="item">
          <div>
            <div class="product">${product.name}</div>
            <div class="qty">Số Lượng: ${item.quantity}</div>
          </div>
          <div class="money">${itemTotal.toLocaleString("vi-VN")}đ</div>
        </div>
      `;
    }
  });
  mainContent.innerHTML = `
<div class="checkout-pages">
    <div class="checkout-container">
        <div class="box">

                <a href="#home" class="close"><i class="fa-solid fa-xmark"></i></a>

            <section class="checkout-left">
                <h1>Thông Tin Đơn Hàng</h1>
                <p class="subtitle">Kiểm tra lại thông tin và địa chỉ giao hàng. Các trường có dấu * là bắt buộc.</p>
                <form id="checkout-form">
                    <div class="form-grid">
                        <div>
                            <label for="checkout-name">Họ Tên*</label>
                            <input type="text" id="checkout-name" value="${
                              user.name
                            }" placeholder="VD: Nguyen Văn A" required >
                        </div>
                        <div>
                            <label for="checkout-phone">Số Điện Thoại*</label>
                            <input type="tel" id="checkout-phone" value="${userPhone}" placeholder="VD: 0123456789" pattern="[0-9]{10,11}" title="Nhập 10-11 chữ số" required>
                        </div>
                        <div>
                            <label for="checkout-email">Email*</label>
                            <input type="email" id="checkout-email" value="${
                              user.email
                            }" placeholder="VD: example@domain.com" required>
                        </div>   
                        <div>
                            <label for="checkout-city">Tỉnh Thành</label>
                            <select id="checkout-city" required>
                              <option value="hanoi">Hà Nội</option>
                              <option value="hochiminh">Hồ Chí Minh</option>
                              <option value="haiphong">Hải Phòng</option>
                              <option value="hue">Huế</option>
                              <option value="danang">Đà Nẵng</option>
                              <option value="cantho">Cần Thơ</option>
                              <option value="ang">An Giang</option>
                              <option value="bacninh">Bắc Ninh</option>
                              <option value="bacninh_alt">Bắc Ninh (sáp nhập)</option> <!-- nếu bạn muốn phân biệt -->
                              <option value="bacnang">Cà Mau</option>
                              <option value="caomung">Cao Bằng</option>
                              <option value="daklak">Đắk Lắk</option>
                              <option value="dienbien">Điện Biên</option>
                              <option value="dongnai">Đồng Nai</option>
                              <option value="dongthap">Đồng Tháp</option>
                              <option value="gialai">Gia Lai</option>
                              <option value="hatinh">Hà Tĩnh</option>
                              <option value="hungyen">Hưng Yên</option>
                              <option value="khanhhoa">Khánh Hòa</option>
                              <option value="laichau">Lai Châu</option>
                              <option value="lamdong">Lâm Đồng</option>
                              <option value="langson">Lạng Sơn</option>
                              <option value="laocai">Lào Cai</option>
                              <option value="nghean">Nghệ An</option>
                              <option value="ninhbinh">Ninh Bình</option>
                              <option value="phutho">Phú Thọ</option>
                              <option value="quangngai">Quảng Ngãi</option>
                              <option value="quangninh">Quảng Ninh</option>
                              <option value="quangtri">Quảng Trị</option>
                              <option value="sonla">Sơn La</option>
                              <option value="tayninh">Tây Ninh</option>
                              <option value="thainguyen">Thái Nguyên</option>
                              <option value="thanhoa">Thanh Hóa</option>
                              <option value="vinhlong">Vĩnh Long</option>
                              <option value="cantho_alt">Vĩnh Long (sáp nhập)</option>
                            </select>

                        </div>
                        <div class="full-row">
                            <label for="checkout-address">Địa Chỉ</label>
                            <input type="text" id="checkout-address" value="${userAddress}" placeholder="VD: 273 An Dương Vương, Phường Chợ Quán" required>
                        </div>
                        <div class="full-row">
                            <label for="note">Ghi Chú</label>
                            <input type="text" id="note" placeholder="Ghi Chú (Không Bắt Buộc)">
                        </div>
                    </div>

                    <div>
                        <label style="margin-top: 20px; cursor: default;">Hình Thức Thanh Toán</label>
                        <div class="box-payment">
                            <div class="payment-option">
                                <input type="radio" name="payment" value="COD" id="payment-cod" checked>
                                <label for="payment-cod">
                                    <i class="fa-solid fa-money-check-dollar"></i>
                                    <span>COD</span>
                                </label>
                            </div>
                            <div class="payment-option">
                                <input type="radio" name="payment" value="PayPal" id="payment-paypal">
                                <label for="payment-paypal">
                                    <i class="fa-brands fa-paypal"></i>
                                    <span>PayPal</span>
                                </label>
                            </div>
                            <div class="payment-option">
                                <input type="radio" name="payment" value="Apple Pay" id="payment-apple">
                                <label for="payment-apple">
                                    <i class="fa-brands fa-apple-pay" style="font-size: 1.5em;"></i>
                                    <span>Apple Pay</span>
                                </label>
                            </div>
                            <div class="payment-option">
                                <input type="radio" name="payment" value="Thẻ Tín Dụng" id="payment-card">
                                <label for="payment-card">
                                    <i class="fa-solid fa-credit-card"></i>
                                    <span>Thẻ</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
            </section>

            <section class="checkout-right">
                <div class="card">
                    <div>
                        <h1 class="title">Đơn Hàng</h1>                   
                        <div class="items">
                            ${summaryHTML}
                        </div>
                        <div class="divine"></div>
                        <div class="summary">
                            <div class="total">Tổng Tiền Hàng</div>
                            <div class="total-money">${totalAmount.toLocaleString(
                              "vi-VN"
                            )}đ</div>                           
                        </div>
                        <div class="summary">
                            <div class="total">Tổng Vận Chuyển</div>
                            <div class="total-money">30.000đ</div>
                        </div>
                        <div class="divine"></div>
                        <div class="total-summary">
                            <div class="last-total">Tổng</div>
                            <div class="last-total">${(
                              totalAmount + ShipCod
                            ).toLocaleString("vi-VN")}đ</div>
                        </div>
                    </div>

                    <div style="margin-top: 12px;">
                        <button type="submit" form="checkout-form" class="check-btn">Thanh Toán</button>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>
    `;
  mainContent
    .querySelector("#checkout-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Validate phone number
      const phoneInput = mainContent.querySelector("#checkout-phone");
      const phoneValue = phoneInput.value.trim();
      if (!/^[0-9]{10,11}$/.test(phoneValue)) {
        showPopup("❌ Số điện thoại phải có 10-11 chữ số!", 2500);
        phoneInput.focus();
        return;
      }
      
      // Thu thập dữ liệu đơn hàng
      const cartItems = getCart();
      const city = mainContent.querySelector("#checkout-city").value;
      const cityText = mainContent.querySelector("#checkout-city option:checked").textContent;
      const address = mainContent.querySelector("#checkout-address").value.trim();
      const fullAddress = `${address}, ${cityText}`;
      
      // Lấy phương thức thanh toán được chọn
      const selectedPayment = mainContent.querySelector('input[name="payment"]:checked');
      const paymentMethod = selectedPayment ? selectedPayment.value : 'COD';
      
      const orderData = {
        customer: mainContent.querySelector("#checkout-name").value.trim(),
        phone: phoneValue,
        email: mainContent.querySelector("#checkout-email").value.trim(),
        address: address,
        fullAddress: fullAddress,
        note: mainContent.querySelector("#note").value.trim(),
        paymentMethod: paymentMethod,
        items: cartItems,
        total: totalAmount + ShipCod
      };
      
      // Hiển thị modal xác nhận thay vì submit trực tiếp
      showOrderConfirmationModal(orderData);
    });
}

/**
 * Chú thích: Hiển thị trang xác nhận đơn hàng.
 */
function renderOrderConfirmation(orderId) {
  mainContent.innerHTML = `
        <div class="order-confirmation-container">
            <h2>Đặt hàng thành công!</h2>
            <p>Cảm ơn bạn đã mua hàng. Mã đơn hàng của bạn là: <strong>#${orderId}</strong></p>
            <p>Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.</p>
            <a href="#home" class="checkout-btn" style="background-color: #007bff;">Về trang chủ</a>
        </div>
    `;
}

/**
 * Chú thích: Hiển thị lịch sử đơn hàng.
 */
function renderOrderHistory() {
  if (!isUserLoggedIn()) {
    showPopup("Vui lòng đăng nhập để xem lịch sử.", 2000);
    window.location.hash = "#home";
    return;
  }
  const user = getLoggedInUser();
  const orderHistoryKey = `order-history_${user.email}`;
  const history = JSON.parse(localStorage.getItem(orderHistoryKey)) || [];
  let historyHTML = "";
  if (history.length === 0) {
    historyHTML = "<p>Bạn chưa có đơn hàng nào.</p>";
  } else {
    history.sort((a, b) => b.id - a.id);
    history.forEach((order) => {
      let itemsHTML = "";
      order.items.forEach((item) => {
        const product = products.find((p) => p.id === item.id);
        if (product) {
          itemsHTML += `
            <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" onerror="this.src='../img/no-image.png'">
              <span>${product.name} (x${item.quantity}) - ${(parseInt(product.price) * item.quantity).toLocaleString("vi-VN")}đ</span>
            </li>
          `;
        }
      });
      historyHTML += `
                <div class="order-card">
                    <div class="order-header">
                        <strong>Đơn hàng #${order.id}</strong>
                        <span>Ngày đặt: ${order.date}</span>
                    </div>
                    <div class="order-body">
                        <p><strong>Tổng tiền:</strong> ${order.total.toLocaleString(
                          "vi-VN"
                        )}đ</p>
                        <p><strong>Địa chỉ:</strong> ${order.address}</p>
                        <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod || 'COD'}</p>
                        <p><strong>Sản phẩm:</strong></p>
                        <ul style="list-style: none; padding: 0;">${itemsHTML}</ul>
                    </div>
                </div>
            `;
    });
  }
  mainContent.innerHTML = `
        <div class="order-history-container">
            <h2>Lịch sử đơn hàng</h2>
            <a href="#profile" style="display: block; margin-bottom: 20px;">Quay lại thông tin tài khoản</a>
            ${historyHTML}
        </div>
    `;
}

/**
 * Chú thích: Hiển thị trang chính sách
 */
function renderPolicyPage(type) {
  const policyContent = {
    warranty: {
      title: "Chính Sách Bảo Hành",
      icon: "fa-shield-halved",
      content: `
        <h3>1. Thời gian bảo hành</h3>
        <p>• Sản phẩm PC, Laptop: Bảo hành 24 tháng</p>
        <p>• Linh kiện (CPU, VGA, RAM): Bảo hành 36 tháng</p>
        <p>• Phụ kiện (Gear): Bảo hành 12 tháng</p>
        
        <h3>2. Điều kiện bảo hành</h3>
        <p>• Sản phẩm còn trong thời gian bảo hành</p>
        <p>• Có tem bảo hành, hóa đơn mua hàng</p>
        <p>• Lỗi do nhà sản xuất</p>
        
        <h3>3. Trường hợp không được bảo hành</h3>
        <p>• Sản phẩm bị rơi vỡ, vào nước, cháy nổ</p>
        <p>• Tự ý sửa chữa, thay đổi phần cứng</p>
        <p>• Tem bảo hành bị rách, mờ hoặc không còn</p>
        
        <h3>4. Liên hệ bảo hành</h3>
        <p><i class="fa-solid fa-phone"></i> Hotline: 0909180825</p>
        <p><i class="fa-solid fa-envelope"></i> Email: warranty@pcstore.vn</p>
      `
    },
    return: {
      title: "Chính Sách Đổi Trả",
      icon: "fa-rotate-left",
      content: `
        <h3>1. Thời gian đổi trả</h3>
        <p>• Đổi trả trong vòng 7 ngày kể từ ngày mua hàng</p>
        <p>• Sản phẩm lỗi do nhà sản xuất: Đổi mới trong 30 ngày</p>
        
        <h3>2. Điều kiện đổi trả</h3>
        <p>• Sản phẩm còn nguyên seal, chưa qua sử dụng</p>
        <p>• Đầy đủ hộp, phụ kiện đi kèm</p>
        <p>• Có hóa đơn mua hàng</p>
        
        <h3>3. Quy trình đổi trả</h3>
        <p><strong>Bước 1:</strong> Liên hệ bộ phận CSKH qua hotline hoặc email</p>
        <p><strong>Bước 2:</strong> Gửi sản phẩm về cửa hàng hoặc đợi nhân viên đến lấy</p>
        <p><strong>Bước 3:</strong> Kiểm tra sản phẩm và xử lý đổi trả</p>
        
        <h3>4. Phí đổi trả</h3>
        <p>• Lỗi từ nhà sản xuất: Miễn phí hoàn toàn</p>
        <p>• Đổi ý không muốn mua: Khách hàng chịu phí vận chuyển 2 chiều</p>
        
        <h3>5. Liên hệ</h3>
        <p><i class="fa-solid fa-phone"></i> Hotline: 0909180825</p>
        <p><i class="fa-solid fa-envelope"></i> Email: support@pcstore.vn</p>
      `
    },
    shipping: {
      title: "Chính Sách Vận Chuyển",
      icon: "fa-truck-fast",
      content: `
        <h3>1. Thời gian giao hàng</h3>
        <p>• Nội thành Hà Nội, TP.HCM: 1-2 ngày</p>
        <p>• Các tỉnh thành khác: 2-5 ngày</p>
        <p>• Vùng xa, vùng sâu: 5-7 ngày</p>
        
        <h3>2. Phí vận chuyển</h3>
        <p>• Đơn hàng từ 5 triệu: Miễn phí vận chuyển</p>
        <p>• Đơn hàng dưới 5 triệu: 30.000đ (nội thành), 50.000đ (ngoại thành)</p>
        
        <h3>3. Đơn vị vận chuyển</h3>
        <p>• Giao Hàng Nhanh (GHN)</p>
        <p>• J&T Express</p>
        <p>• Viettel Post</p>
        
        <h3>4. Kiểm tra hàng khi nhận</h3>
        <p>• Khách hàng được kiểm tra sản phẩm trước khi thanh toán</p>
        <p>• Nếu phát hiện lỗi, từ chối nhận hàng và liên hệ ngay với chúng tôi</p>
        
        <h3>5. Liên hệ</h3>
        <p><i class="fa-solid fa-phone"></i> Hotline: 0909180825</p>
        <p><i class="fa-solid fa-envelope"></i> Email: shipping@pcstore.vn</p>
      `
    },
    privacy: {
      title: "Chính Sách Bảo Mật",
      icon: "fa-lock",
      content: `
        <h3>1. Thu thập thông tin</h3>
        <p>Chúng tôi thu thập các thông tin sau:</p>
        <p>• Thông tin cá nhân: Họ tên, email, số điện thoại</p>
        <p>• Thông tin giao dịch: Lịch sử mua hàng, đơn hàng</p>
        <p>• Thông tin kỹ thuật: IP, trình duyệt, cookies</p>
        
        <h3>2. Mục đích sử dụng</h3>
        <p>• Xử lý đơn hàng và giao hàng</p>
        <p>• Chăm sóc khách hàng</p>
        <p>• Gửi thông tin khuyến mãi (nếu khách hàng đồng ý)</p>
        <p>• Cải thiện dịch vụ</p>
        
        <h3>3. Bảo mật thông tin</h3>
        <p>• Mã hóa dữ liệu bằng SSL/TLS</p>
        <p>• Lưu trữ trên server bảo mật</p>
        <p>• Chỉ nhân viên được ủy quyền mới truy cập</p>
        
        <h3>4. Chia sẻ thông tin</h3>
        <p>Chúng tôi <strong>KHÔNG</strong> chia sẻ thông tin cá nhân với bên thứ 3, trừ:</p>
        <p>• Đơn vị vận chuyển (chỉ địa chỉ giao hàng)</p>
        <p>• Cơ quan pháp luật (khi có yêu cầu)</p>
        
        <h3>5. Quyền của khách hàng</h3>
        <p>• Yêu cầu xem, sửa, xóa thông tin cá nhân</p>
        <p>• Từ chối nhận email quảng cáo</p>
        
        <h3>6. Liên hệ</h3>
        <p><i class="fa-solid fa-phone"></i> Hotline: 0909180825</p>
        <p><i class="fa-solid fa-envelope"></i> Email: privacy@pcstore.vn</p>
      `
    }
  };

  const policy = policyContent[type] || {
    title: "Chính Sách",
    icon: "fa-file-lines",
    content: "<p>Nội dung đang được cập nhật...</p>"
  };

  mainContent.innerHTML = `
    <div class="policy-page">
      <div class="policy-header">
        <i class="fa-solid ${policy.icon}"></i>
        <h1>${policy.title}</h1>
      </div>
      <div class="policy-content">
        ${policy.content}
      </div>
      <div class="policy-footer">
        <p><strong>Lưu ý:</strong> Chính sách có thể thay đổi theo thời gian. Vui lòng kiểm tra thường xuyên để cập nhật thông tin mới nhất.</p>
        <a href="#home" class="btn-back-home">Về trang chủ</a>
      </div>
    </div>
  `;
}

/**
 * Chú thích: Hiển thị trang tra cứu bảo hành
 */
function renderWarrantyPage(type) {
  if (type === "check") {
    mainContent.innerHTML = `
      <div class="warranty-page">
        <div class="warranty-header">
          <i class="fa-solid fa-search"></i>
          <h1>Tra Cứu Bảo Hành</h1>
        </div>
        <div class="warranty-form">
          <p>Nhập thông tin để tra cứu tình trạng bảo hành của sản phẩm</p>
          <form id="warranty-check-form">
            <div class="form-group">
              <label for="serial-number">Số Serial/IMEI</label>
              <input type="text" id="serial-number" placeholder="Nhập số serial trên sản phẩm" required>
            </div>
            <div class="form-group">
              <label for="phone-number">Số điện thoại</label>
              <input type="tel" id="phone-number" placeholder="Số điện thoại khi mua hàng" required>
            </div>
            <button type="submit" class="btn-check-warranty">Tra cứu</button>
          </form>
          <div id="warranty-result"></div>
        </div>
      </div>
    `;
    
    mainContent.querySelector("#warranty-check-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const resultDiv = mainContent.querySelector("#warranty-result");
      resultDiv.innerHTML = `
        <div class="warranty-result-box">
          <i class="fa-solid fa-circle-check" style="color: #28a745; font-size: 50px;"></i>
          <h3>Sản phẩm còn trong thời gian bảo hành</h3>
          <p><strong>Thời gian còn lại:</strong> 18 tháng</p>
          <p><strong>Ngày mua:</strong> 15/04/2024</p>
          <p><strong>Ngày hết hạn:</strong> 15/04/2026</p>
          <p class="note">Đây là dữ liệu demo. Trong thực tế sẽ tra cứu từ database.</p>
        </div>
      `;
    });
  } else if (type === "policy") {
    renderPolicyPage("warranty");
  } else if (type === "center") {
    mainContent.innerHTML = `
      <div class="warranty-page">
        <div class="warranty-header">
          <i class="fa-solid fa-location-dot"></i>
          <h1>Trung Tâm Bảo Hành</h1>
        </div>
        <div class="warranty-centers">
          <div class="center-card">
            <h3><i class="fa-solid fa-building"></i> Trung Tâm Hà Nội</h3>
            <p><i class="fa-solid fa-location-dot"></i> 123 Đường Láng, Đống Đa, Hà Nội</p>
            <p><i class="fa-solid fa-phone"></i> 024.1234.5678</p>
            <p><i class="fa-solid fa-clock"></i> T2-T6: 8:00 - 18:00, T7: 8:00 - 12:00</p>
          </div>
          
          <div class="center-card">
            <h3><i class="fa-solid fa-building"></i> Trung Tâm TP.HCM</h3>
            <p><i class="fa-solid fa-location-dot"></i> 456 Điện Biên Phủ, Quận 3, TP.HCM</p>
            <p><i class="fa-solid fa-phone"></i> 028.9876.5432</p>
            <p><i class="fa-solid fa-clock"></i> T2-T6: 8:00 - 18:00, T7: 8:00 - 12:00</p>
          </div>
          
          <div class="center-card">
            <h3><i class="fa-solid fa-building"></i> Trung Tâm Đà Nẵng</h3>
            <p><i class="fa-solid fa-location-dot"></i> 789 Lê Duẩn, Hải Châu, Đà Nẵng</p>
            <p><i class="fa-solid fa-phone"></i> 0236.1234.567</p>
            <p><i class="fa-solid fa-clock"></i> T2-T6: 8:00 - 18:00, T7: 8:00 - 12:00</p>
          </div>
        </div>
        <div class="policy-footer">
          <a href="#home" class="btn-back-home">Về trang chủ</a>
        </div>
      </div>
    `;
  }
}

/**
 * Chú thích: Hiển thị trang xây dựng cấu hình
 */
function renderBuildConfig(type) {
  const buildTemplates = {
    gaming: {
      title: "Cấu Hình Gaming",
      icon: "fa-gamepad",
      description: "Cấu hình mạnh mẽ cho game thủ, chơi game mượt mà ở mọi độ phân giải",
      categories: ["cpu", "vga", "ram", "case"]
    },
    workstation: {
      title: "Cấu Hình Workstation",
      icon: "fa-desktop",
      description: "Tối ưu cho công việc thiết kế, render 3D, edit video chuyên nghiệp",
      categories: ["cpu", "ram", "vga", "case"]
    },
    budget: {
      title: "Cấu Hình Phổ Thông",
      icon: "fa-laptop",
      description: "Giải pháp tiết kiệm cho văn phòng, học tập, làm việc hàng ngày",
      categories: ["pc"]
    }
  };

  const template = buildTemplates[type];
  if (!template) {
    mainContent.innerHTML = "<h2>404 - Không tìm thấy trang</h2>";
    return;
  }

  // Lọc sản phẩm theo danh mục
  const availableProducts = {};
  template.categories.forEach(cat => {
    availableProducts[cat] = products.filter(p => p.category === cat).slice(0, 12);
  });

  let productsHTML = "";
  for (const cat in availableProducts) {
    const title = categoryTitles[cat] || cat.toUpperCase();
    productsHTML += `
      <div class="config-category">
        <h3>${title}</h3>
        <div class="config-product-grid">
          ${availableProducts[cat].map(p => `
            <div class="config-product-card" data-id="${p.id}" data-category="${cat}">
              <img src="${p.image}" alt="${p.name}">
              <h4>${p.name}</h4>
              <p class="price">${parseInt(p.price).toLocaleString("vi-VN")}đ</p>
              <button class="btn-select-component">Chọn</button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  mainContent.innerHTML = `
    <div class="build-config-page">
      <div class="config-header">
        <i class="fa-solid ${template.icon}"></i>
        <h1>${template.title}</h1>
        <p>${template.description}</p>
      </div>
      
      <div class="config-builder">
        <div class="component-selector">
          <h2><i class="fa-solid fa-microchip"></i> Chọn Linh Kiện</h2>
          ${productsHTML}
        </div>
        
        <div class="config-summary">
          <h2><i class="fa-solid fa-list-check"></i> Cấu Hình Của Bạn</h2>
          <div id="selected-components">
            <p class="empty-config">Chưa có linh kiện nào được chọn</p>
          </div>
          <div class="total-price">
            <strong>Tổng giá:</strong> <span id="config-total">0 ₫</span>
          </div>
          <button class="btn-add-config-to-cart" disabled>Thêm vào giỏ hàng</button>
          <a href="#home" class="btn-back-home">Về trang chủ</a>
        </div>
      </div>
    </div>
  `;

  // Lưu trữ các sản phẩm đã chọn (có thể nhiều sản phẩm cùng loại)
  const selectedComponents = [];
  const selectedDiv = mainContent.querySelector("#selected-components");
  const totalSpan = mainContent.querySelector("#config-total");
  const addCartBtn = mainContent.querySelector(".btn-add-config-to-cart");

  mainContent.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-select-component")) {
      const card = e.target.closest(".config-product-card");
      const productId = parseInt(card.dataset.id);
      const product = products.find(p => p.id === productId);

      if (product) {
        selectedComponents.push(product);
        updateConfigSummary();
        showPopup(`✅ Đã thêm ${product.name}`, 1500);
      }
    }
  });

  function updateConfigSummary() {
    let html = "";
    let total = 0;

    selectedComponents.forEach((p, index) => {
      total += parseInt(p.price);
      html += `
        <div class="selected-item">
          <img src="${p.image}" alt="${p.name}">
          <div>
            <h4>${p.name}</h4>
            <p>${parseInt(p.price).toLocaleString("vi-VN")}đ</p>
          </div>
          <button class="btn-remove-component" data-index="${index}">&times;</button>
        </div>
      `;
    });

    if (html === "") {
      selectedDiv.innerHTML = '<p class="empty-config">Chưa có linh kiện nào được chọn</p>';
      addCartBtn.disabled = true;
    } else {
      selectedDiv.innerHTML = html;
      addCartBtn.disabled = false;
    }

    totalSpan.textContent = total.toLocaleString("vi-VN") + " ₫";
  }

  mainContent.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-remove-component")) {
      const index = parseInt(e.target.dataset.index);
      selectedComponents.splice(index, 1);
      updateConfigSummary();
    }
  });

  addCartBtn.addEventListener("click", () => {
    selectedComponents.forEach(product => {
      addToCart(product.id);
    });
    showPopup(`✅ Đã thêm ${selectedComponents.length} sản phẩm vào giỏ hàng!`, 2000);
    window.location.hash = "#cart";
  });
}

/**
 * Chú thích: Hiển thị trang khuyến mãi
 */
function renderPromotionPage(type) {
  const promotions = {
    "flash-sale": {
      title: "Flash Sale - Giảm Giá Sốc",
      icon: "fa-bolt",
      discount: 50,
      description: "Giảm đến 50% cho các sản phẩm chọn lọc. Số lượng có hạn!"
    },
    combo: {
      title: "Combo Giá Sốc",
      icon: "fa-gift",
      discount: 30,
      description: "Mua combo linh kiện - Giảm ngay 30%. Tiết kiệm hơn khi mua nhiều!"
    },
    clearance: {
      title: "Thanh Lý Kho - Giá Cực Rẻ",
      icon: "fa-fire",
      discount: 40,
      description: "Giảm đến 40% để giải phóng hàng tồn kho. Cơ hội không thể bỏ lỡ!"
    }
  };

  const promo = promotions[type];
  if (!promo) {
    mainContent.innerHTML = "<h2>404 - Không tìm thấy trang</h2>";
    return;
  }

  // Lọc sản phẩm ngẫu nhiên để tạo khuyến mãi (demo)
  const discountedProducts = products
    .sort(() => Math.random() - 0.5)
    .slice(0, 12);

  mainContent.innerHTML = `
    <div class="promotion-page">
      <div class="promotion-header">
        <i class="fa-solid ${promo.icon}"></i>
        <h1>${promo.title}</h1>
        <p class="promo-desc">${promo.description}</p>
        <div class="promo-timer">
          <i class="fa-solid fa-clock"></i> Kết thúc sau: 
          <span id="countdown">23:59:59</span>
        </div>
      </div>
      <div class="product-grid">
        ${renderProductGrid(discountedProducts)}
      </div>
      <div class="promotion-footer">
        <a href="#home" class="btn-back-home">Về trang chủ</a>
      </div>
    </div>
  `;

  // Đếm ngược giả (demo)
  let hours = 23, minutes = 59, seconds = 59;
  setInterval(() => {
    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
    }
    if (minutes < 0) {
      minutes = 59;
      hours--;
    }
    if (hours < 0) {
      hours = 23;
      minutes = 59;
      seconds = 59;
    }
    const countdownEl = mainContent.querySelector("#countdown");
    if (countdownEl) {
      countdownEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }, 1000);
}

// ========================================
// MODAL XÁC NHẬN ĐƠN HÀNG
// ========================================

/**
 * Hiển thị modal xác nhận đơn hàng trước khi submit
 */
function showOrderConfirmationModal(orderData) {
    const modal = document.createElement('div');
    modal.className = 'order-confirmation-modal';
    modal.id = 'order-confirm-modal';
    
    const productsHTML = orderData.items.map(item => {
        const product = products.find(p => p.id === item.id);
        const itemTotal = parseInt(product.price) * item.quantity;
        return `
            <div class="confirm-product-item">
                <div class="confirm-product-name">
                    <strong>${product.name}</strong>
                    <div class="product-details">
                        ${parseInt(product.price).toLocaleString('vi-VN')}đ × ${item.quantity}
                    </div>
                </div>
                <div class="confirm-product-price">
                    ${itemTotal.toLocaleString('vi-VN')}đ
                </div>
            </div>
        `;
    }).join('');
    
    modal.innerHTML = `
        <div class="order-confirm-content">
            <h2>📋 Xác nhận đơn hàng</h2>
            
            <div class="order-confirm-section">
                <h3>🛒 Sản phẩm</h3>
                ${productsHTML}
            </div>
            
            <div class="order-confirm-section">
                <h3>📦 Thông tin giao hàng</h3>
                <p><strong>Người nhận:</strong> ${orderData.customer}</p>
                <p><strong>Số điện thoại:</strong> ${orderData.phone}</p>
                <p><strong>Email:</strong> ${orderData.email}</p>
                <p><strong>Địa chỉ:</strong> ${orderData.fullAddress}</p>
                ${orderData.note ? `<p><strong>Ghi chú:</strong> ${orderData.note}</p>` : ''}
            </div>
            
            <div class="order-confirm-section">
                <h3>💳 Thanh toán</h3>
                <p><strong>Phương thức:</strong> ${orderData.paymentMethod || 'COD'}</p>
                <div class="confirm-total">
                    Tổng cộng: ${orderData.total.toLocaleString('vi-VN')}đ
                </div>
            </div>
            
            <div class="order-confirm-actions">
                <button class="btn-cancel-order" onclick="closeOrderConfirmModal()">
                    ← Quay lại sửa
                </button>
                <button class="btn-confirm-order" onclick="confirmOrderSubmit()">
                    ✓ Xác nhận đặt hàng
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Lưu data để submit sau
    window.pendingOrderData = orderData;
}

/**
 * Đóng modal xác nhận
 */
function closeOrderConfirmModal() {
    const modal = document.getElementById('order-confirm-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * Xác nhận và thực hiện submit đơn hàng
 */
function confirmOrderSubmit() {
    const orderData = window.pendingOrderData;
    if (!orderData) return;
    
    closeOrderConfirmModal();
    
    // XỬ LÝ SUBMIT ĐƠN HÀNG (Logic từ submit handler cũ)
    const user = getLoggedInUser();
    const orderId = new Date().getTime();
    
    const cartItems = getCart();
    const adminItems = cartItems.map((it) => {
        const prod = products.find((p) => p.id === it.id) || {};
        return {
            productId: it.id,
            productName: prod.name || (it.name || "Unknown"),
            qty: it.quantity,
            price: prod.price ? Number(prod.price) : 0,
        };
    });
    
    const newOrder = {
        id: orderId,
        date: new Date().toLocaleDateString("vi-VN"),
        items: cartItems,
        total: orderData.total,
        customer: orderData.customer,
        address: orderData.fullAddress,
        paymentMethod: orderData.paymentMethod || 'COD',
    };
    
    // Lưu vào order history của user
    const orderHistoryKey = `order-history_${user.email}`;
    const history = JSON.parse(localStorage.getItem(orderHistoryKey)) || [];
    history.push(newOrder);
    localStorage.setItem(orderHistoryKey, JSON.stringify(history));
    
    // Sync to admin
    try {
        const adminOrdersKey = 'admin_orders';
        const adminOrders = JSON.parse(localStorage.getItem(adminOrdersKey)) || [];
        const adminUsers = JSON.parse(localStorage.getItem('admin_users')) || [];
        const matched = adminUsers.find(u => u.email === user.email);
        const adminCustomerId = matched ? matched.id : null;
        
        const adminOrder = {
            id: `DH${orderId}`,
            date: new Date().toLocaleDateString("vi-VN"),
            customer: orderData.customer,
            customerId: adminCustomerId,
            total: orderData.total,
            status: 'Mới đặt',
            items: adminItems,
            paymentMethod: orderData.paymentMethod || 'COD',
            phone: orderData.phone,
            email: orderData.email,
            address: orderData.fullAddress,
            note: orderData.note,
        };
        
        adminOrders.push(adminOrder);
        localStorage.setItem(adminOrdersKey, JSON.stringify(adminOrders));
        
        // Cập nhật doanh thu
        const revenueKey = 'admin_revenue';
        let revenue = JSON.parse(localStorage.getItem(revenueKey)) || {
            total: 0, byDate: {}, byMonth: {}, byYear: {}
        };
        
        const orderDate = new Date().toLocaleDateString('vi-VN');
        const orderMonth = new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit' });
        const orderYear = new Date().getFullYear().toString();
        
        revenue.total += orderData.total;
        revenue.byDate[orderDate] = (revenue.byDate[orderDate] || 0) + orderData.total;
        revenue.byMonth[orderMonth] = (revenue.byMonth[orderMonth] || 0) + orderData.total;
        revenue.byYear[orderYear] = (revenue.byYear[orderYear] || 0) + orderData.total;
        
        localStorage.setItem(revenueKey, JSON.stringify(revenue));
        
        // Cập nhật tồn kho
        const inventoryKey = 'admin_inventory';
        const adminInventory = JSON.parse(localStorage.getItem(inventoryKey)) || [];
        
        adminItems.forEach((it) => {
            const inv = adminInventory.find(i => Number(i.productId) === Number(it.productId));
            if (inv) {
                inv.quantity = Math.round((Number(inv.quantity) || 0) - Number(it.qty));
            } else {
                adminInventory.push({
                    productId: it.productId,
                    productName: it.productName,
                    type: (products.find(p => p.id === it.productId)?.category || '').toUpperCase(),
                    quantity: 0 - Number(it.qty),
                });
            }
        });
        
        localStorage.setItem(inventoryKey, JSON.stringify(adminInventory));
    } catch (err) {
        console.error('Error syncing order', err);
    }
    
    // Clear cart
    saveCart([]);
    updateCartCounter();
    window.location.hash = `#order-confirmation/${orderId}`;
}
