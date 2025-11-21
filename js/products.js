// File: products.js
// Chú thích: File này chứa toàn bộ dữ liệu sản phẩm của trang web.

// Load products added from admin panel
function loadAdminProducts() {
  const adminProducts = localStorage.getItem('main_site_products');
  if (adminProducts) {
    try {
      const parsedProducts = JSON.parse(adminProducts);
      // Merge with existing products, avoiding duplicates by ID
      const existingIds = new Set(baseProducts.map(p => p.id));
      const newProducts = parsedProducts.filter(p => !existingIds.has(p.id));
      return [...baseProducts, ...newProducts];
    } catch (e) {
      console.error('Error loading admin products:', e);
      return baseProducts;
    }
  }
  return baseProducts;
}

// Sync prices from admin pricing
function syncPricesFromAdmin(productsArray) {
  try {
    const updatedProducts = localStorage.getItem('user_site_products');
    if (updatedProducts) {
      const pricedProducts = JSON.parse(updatedProducts);
      
      // Create a map of updated prices
      const priceMap = {};
      pricedProducts.forEach(p => {
        if (p.id && p.price) {
          priceMap[p.id] = p.price;
        }
      });
      
      // Apply updated prices to products
      productsArray.forEach(product => {
        if (priceMap[product.id]) {
          product.price = priceMap[product.id];
        }
      });
      
      console.log('✅ Đã đồng bộ giá từ admin pricing');
    }
  } catch (e) {
    console.error('Lỗi khi sync giá từ admin:', e);
  }
  
  return productsArray;
}

const baseProducts = [
  // ==================================================
  //           PC (MÁY TÍNH BỘ) - 12 sản phẩm
  // ==================================================
  {
    id: 701,
    name: "PC Gaming Starter E1",
    price: "12500000",
    image: "../img/pc/pc1.jpg",
    category: "pc",
    specs: {
      "Nhu cầu": "Gaming Cơ Bản",
      CPU: "Intel Core i3-12100F",
      VGA: "GTX 1650",
    },
  },
  {
    id: 702,
    name: "PC Gaming Vector S",
    price: "18990000",
    image: "../img/pc/pc2.jpg",
    category: "pc",
    specs: {
      "Nhu cầu": "Gaming 1080p",
      CPU: "Intel Core i5-12400F",
      VGA: "RTX 3050",
    },
  },
  {
    id: 703,
    name: "PC Gaming Dragon A",
    price: "28790000",
    image: "../img/pc/pc3.jpg",
    category: "pc",
    specs: { "Nhu cầu": "Gaming 2K", CPU: "AMD Ryzen 5 7600", VGA: "RTX 4060" },
  },
  {
    id: 704,
    name: "PC Gaming Titan X",
    price: "45500000",
    image: "../img/pc/pc4.jpg",
    category: "pc",
    specs: {
      "Nhu cầu": "Gaming 4K",
      CPU: "Intel Core i7-13700K",
      VGA: "RTX 4070 Ti",
    },
  },
  {
    id: 705,
    name: "PC Creator Lite C1",
    price: "15200000",
    image: "../img/pc/pc5.jpg",
    category: "pc",
    specs: {
      "Nhu cầu": "Đồ Họa 2D",
      CPU: "Intel Core i5-12400",
      VGA: "Onboard",
    },
  },
  {
    id: 706,
    name: "PC Creator Pro C2",
    price: "35800000",
    image: "../img/pc/pc6.jpg",
    category: "pc",
    specs: {
      "Nhu cầu": "Edit Video",
      CPU: "AMD Ryzen 7 7700X",
      VGA: "RTX 4060 Ti",
    },
  },
  {
    id: 707,
    name: "PC Creator Master C3",
    price: "62300000",
    image: "../img/pc/pc7.jpg",
    category: "pc",
    specs: {
      "Nhu cầu": "3D & Render",
      CPU: "Intel Core i9-13900K",
      VGA: "RTX 4080",
    },
  },
  {
    id: 708,
    name: "PC Office Basic O1",
    price: "8900000",
    image: "../img/pc/pc8.jpg",
    category: "pc",
    specs: {
      "Nhu cầu": "Văn Phòng",
      CPU: "Intel Core i3-12100",
      VGA: "Onboard",
    },
  },
  {
    id: 709,
    name: "PC Office Advanced O2",
    price: "11600000",
    image: "../img/pc/pc9.jpg",
    category: "pc",
    specs: {
      "Nhu cầu": "Văn Phòng",
      CPU: "Intel Core i5-12400",
      VGA: "Onboard",
    },
  },
  {
    id: 710,
    name: "PC AMD Gaming G1",
    price: "14990000",
    image: "../img/pc/pc10.jpg",
    category: "pc",
    specs: {
      "Nhu cầu": "Gaming 1080p",
      CPU: "AMD Ryzen 5 5600",
      VGA: "RX 6600",
    },
  },
  {
    id: 711,
    name: "PC White Gaming W1",
    price: "32100000",
    image: "../img/pc/pc11.jpg",
    category: "pc",
    specs: {
      "Nhu cầu": "Gaming 2K",
      CPU: "Intel Core i5-13600K",
      VGA: "RTX 4060",
    },
  },
  {
    id: 712,
    name: "PC Streamer S1",
    price: "41000000",
    image: "../img/pc/pc12.jpg",
    category: "pc",
    specs: {
      "Nhu cầu": "Gaming & Stream",
      CPU: "AMD Ryzen 7 7700X",
      VGA: "RTX 4070",
    },
  },

  // ==================================================
  //                 CPU (VI XỬ LÝ) - 15 sản phẩm
  // ==================================================
  {
    id: 101,
    name: "Intel Core i9-14900K",
    price: "16990000",
    image: "../img/cpu/i9-14900K.jpg",
    category: "cpu",
    specs: {
      Hãng: "Intel",
      Socket: "LGA 1700",
      "P-Cores": "8",
      "E-Cores": "16",
    },
  },
  {
    id: 102,
    name: "AMD Ryzen 9 7950X3D",
    price: "15590000",
    image: "../img/cpu/r9-7950X3D.jpg",
    category: "cpu",
    specs: {
      Hãng: "AMD",
      Socket: "AM5",
      "Nhân/Luồng": "16/32",
      "Công nghệ": "3D V-Cache",
    },
  },
  {
    id: 103,
    name: "Intel Core i7-14700K",
    price: "11590000",
    image: "../img/cpu/i7-14700K.jpg",
    category: "cpu",
    specs: {
      Hãng: "Intel",
      Socket: "LGA 1700",
      "P-Cores": "8",
      "E-Cores": "12",
    },
  },
  {
    id: 104,
    name: "AMD Ryzen 7 7800X3D",
    price: "8990000",
    image: "../img/cpu/r7-7800X3D.jpg",
    category: "cpu",
    specs: {
      Hãng: "AMD",
      Socket: "AM5",
      "Nhân/Luồng": "8/16",
      "Tối ưu": "Gaming",
    },
  },
  {
    id: 105,
    name: "Intel Core i5-14400F",
    price: "5490000",
    image: "../img/cpu/i5-14400F.jpg",
    category: "cpu",
    specs: {
      Hãng: "Intel",
      Socket: "LGA 1700",
      "Nhân/Luồng": "10/16",
      "Hiệu năng": "Tầm trung",
    },
  },
  {
    id: 106,
    name: "AMD Ryzen 5 7600X",
    price: "5290000",
    image: "../img/cpu/r5-7600X.jpg",
    category: "cpu",
    specs: {
      Hãng: "AMD",
      Socket: "AM5",
      "Nhân/Luồng": "6/12",
      "Bộ nhớ đệm": "32MB",
    },
  },
  {
    id: 107,
    name: "Intel Core i3-14100F",
    price: "2990000",
    image: "../img/cpu/i3-14100F.jpg",
    category: "cpu",
    specs: {
      Hãng: "Intel",
      Socket: "LGA 1700",
      "Nhân/Luồng": "4/8",
      "Phân khúc": "Phổ thông",
    },
  },
  {
    id: 108,
    name: "AMD Ryzen 5 5600",
    price: "2750000",
    image: "../img/cpu/r5-5600.jpg",
    category: "cpu",
    specs: {
      Hãng: "AMD",
      Socket: "AM4",
      "Nhân/Luồng": "6/12",
      "Hiệu năng": "Tầm trung",
    },
  },
  {
    id: 109,
    name: "Intel Core i9-13900K",
    price: "15590000",
    image: "../img/cpu/i9-13900K.jpg",
    category: "cpu",
    specs: {
      Hãng: "Intel",
      Socket: "LGA 1700",
      "P-Cores": "8",
      "E-Cores": "16",
    },
  },
  {
    id: 110,
    name: "AMD Ryzen 9 7950X",
    price: "14890000",
    image: "../img/cpu/r9-7950X.jpg",
    category: "cpu",
    specs: { Hãng: "AMD", Socket: "AM5", "Nhân/Luồng": "16/32" },
  },
  {
    id: 111,
    name: "Intel Core i5-12400F",
    price: "3490000",
    image: "../img/cpu/i5-12400F.jpg",
    category: "cpu",
    specs: {
      Hãng: "Intel",
      Socket: "LGA 1700",
      "Nhân/Luồng": "6/12",
      "Tối ưu": "Gaming",
    },
  },
  {
    id: 112,
    name: "AMD Ryzen 5 7500F",
    price: "3890000",
    image: "../img/cpu/r5-7500F.jpg",
    category: "cpu",
    specs: {
      Hãng: "AMD",
      Socket: "AM5",
      "Nhân/Luồng": "6/12",
      "Tích hợp": "Không iGPU",
    },
  },
  {
    id: 113,
    name: "Intel Core i3-12100",
    price: "2790000",
    image: "../img/cpu/i3-12100.jpg",
    category: "cpu",
    specs: {
      Hãng: "Intel",
      Socket: "LGA 1700",
      "Nhân/Luồng": "4/8",
      "Tích hợp": "iGPU",
    },
  },
  {
    id: 114,
    name: "AMD Ryzen 3 4100",
    price: "1490000",
    image: "../img/cpu/r3-4100.jpg",
    category: "cpu",
    specs: {
      Hãng: "AMD",
      Socket: "AM4",
      "Nhân/Luồng": "4/8",
      "Phân khúc": "Giá rẻ",
    },
  },
  {
    id: 115,
    name: "Intel Core i7-12700K",
    price: "7990000",
    image: "../img/cpu/i7-12700K.jpg",
    category: "cpu",
    specs: {
      Hãng: "Intel",
      Socket: "LGA 1700",
      "P-Cores": "8",
      "E-Cores": "4",
    },
  },

  // ==================================================
  //                 VGA (CARD ĐỒ HỌA) - 15 sản phẩm
  // ==================================================
  {
    id: 201,
    name: "NVIDIA GeForce RTX 4090 24GB",
    price: "45990000",
    image: "../img/vga/4090.jpg",
    category: "vga",
    specs: { Hãng: "NVIDIA", VRAM: "24GB GDDR6X", "Độ phân giải": "8K" },
  },
  {
    id: 202,
    name: "AMD Radeon RX 7900 XTX 24GB",
    price: "28990000",
    image: "../img/vga/7900XTX.jpg",
    category: "vga",
    specs: { Hãng: "AMD", VRAM: "24GB GDDR6", "Hiệu năng": "Cực cao" },
  },
  {
    id: 203,
    name: "NVIDIA GeForce RTX 4070 Ti SUPER 16GB",
    price: "22490000",
    image: "../img/vga/4070TiS.jpg",
    category: "vga",
    specs: { Hãng: "NVIDIA", VRAM: "16GB GDDR6X", "Độ phân giải": "2K/4K" },
  },
  {
    id: 204,
    name: "AMD Radeon RX 7700 XT 12GB",
    price: "12590000",
    image: "../img/vga/7700XT.jpg",
    category: "vga",
    specs: { Hãng: "AMD", VRAM: "12GB GDDR6", "Độ phân giải": "2K" },
  },
  {
    id: 205,
    name: "NVIDIA GeForce RTX 4060 Ti 8GB",
    price: "10990000",
    image: "../img/vga/4060Ti.jpg",
    category: "vga",
    specs: { Hãng: "NVIDIA", VRAM: "8GB GDDR6X", "Tối ưu": "DLSS 3" },
  },
  {
    id: 206,
    name: "AMD Radeon RX 6600 8GB",
    price: "5490000",
    image: "../img/vga/6600.jpg",
    category: "vga",
    specs: { Hãng: "AMD", VRAM: "8GB GDDR6", "Độ phân giải": "1080p" },
  },
  {
    id: 207,
    name: "NVIDIA GeForce RTX 3060 12GB",
    price: "7890000",
    image: "../img/vga/3060.jpg",
    category: "vga",
    specs: { Hãng: "NVIDIA", VRAM: "12GB GDDR6", "Hiệu năng": "Tốt" },
  },
  {
    id: 208,
    name: "NVIDIA GeForce RTX 4080 SUPER 16GB",
    price: "32990000",
    image: "../img/vga/4080s.jpg",
    category: "vga",
    specs: { Hãng: "NVIDIA", VRAM: "16GB GDDR6X", "Độ phân giải": "4K" },
  },
  {
    id: 209,
    name: "AMD Radeon RX 7600 XT 16GB",
    price: "8990000",
    image: "../img/vga/7600XT.jpg",
    category: "vga",
    specs: { Hãng: "AMD", VRAM: "16GB GDDR6", "Tối ưu": "VRAM" },
  },
  {
    id: 210,
    name: "NVIDIA GeForce GTX 1650 4GB",
    price: "3890000",
    image: "../img/vga/1650.jpg",
    category: "vga",
    specs: { Hãng: "NVIDIA", VRAM: "4GB GDDR6", "Phân khúc": "Phổ thông" },
  },
  {
    id: 211,
    name: "NVIDIA GeForce RTX 4060 8GB",
    price: "8290000",
    image: "../img/vga/4060.jpg",
    category: "vga",
    specs: { Hãng: "NVIDIA", VRAM: "8GB GDDR6", "Hiệu năng": "Mới" },
  },
  {
    id: 212,
    name: "AMD Radeon RX 6700 XT 12GB",
    price: "9990000",
    image: "../img/vga/6700XT.jpg",
    category: "vga",
    specs: { Hãng: "AMD", VRAM: "12GB GDDR6", "Tối ưu": "2K" },
  },
  {
    id: 213,
    name: "NVIDIA GeForce RTX 3050 8GB",
    price: "6490000",
    image: "../img/vga/3050.jpg",
    category: "vga",
    specs: { Hãng: "NVIDIA", VRAM: "8GB GDDR6", "Tối ưu": "Ray Tracing" },
  },
  {
    id: 214,
    name: "Intel Arc A750 8GB",
    price: "5990000",
    image: "../img/vga/A750.jpg",
    category: "vga",
    specs: { Hãng: "Intel", VRAM: "8GB GDDR6", "Tích hợp": "XeSS" },
  },
  {
    id: 215,
    name: "NVIDIA GeForce GT 1030 2GB",
    price: "1690000",
    image: "../img/vga/1030.jpg",
    category: "vga",
    specs: { Hãng: "NVIDIA", VRAM: "2GB GDDR5", "Phân khúc": "Văn phòng" },
  },

  // ==================================================
  //                     RAM (BỘ NHỚ) - 15 sản phẩm
  // ==================================================
  {
    id: 301,
    name: "Kingston Fury Renegade 32GB (2x16GB) DDR5 6400MHz",
    price: "3990000",
    image: "../img/ram/d5_6400.jpg",
    category: "ram",
    specs: {
      Loại: "DDR5",
      "Dung lượng": "32GB (Kit)",
      "Tốc độ": "6400MHz",
      LED: "Có",
    },
  },
  {
    id: 302,
    name: "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz",
    price: "3490000",
    image: "../img/ram/d5_6000.jpg",
    category: "ram",
    specs: {
      Loại: "DDR5",
      "Dung lượng": "32GB (Kit)",
      "Tốc độ": "6000MHz",
      "Tản nhiệt": "Cao cấp",
    },
  },
  {
    id: 303,
    name: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz",
    price: "1490000",
    image: "../img/ram/d4_3200.jpg",
    category: "ram",
    specs: {
      Loại: "DDR4",
      "Dung lượng": "16GB (Kit)",
      "Tốc độ": "3200MHz",
      "Độ trễ": "CL16",
    },
  },
  {
    id: 304,
    name: "TeamGroup T-Force Delta RGB 32GB (2x16GB) DDR4 3600MHz",
    price: "2190000",
    image: "../img/ram/d4_3600.jpg",
    category: "ram",
    specs: {
      Loại: "DDR4",
      "Dung lượng": "32GB (Kit)",
      "Tốc độ": "3600MHz",
      LED: "RGB",
    },
  },
  {
    id: 305,
    name: "Kingston Fury Beast 8GB DDR4 3200MHz",
    price: "690000",
    image: "../img/ram/d4_8gb.jpg",
    category: "ram",
    specs: {
      Loại: "DDR4",
      "Dung lượng": "8GB (Single)",
      "Tốc độ": "3200MHz",
      Giá: "Phổ thông",
    },
  },
  {
    id: 306,
    name: "Crucial Pro 48GB (2x24GB) DDR5 5600MHz",
    price: "4590000",
    image: "../img/ram/d5_48gb.jpg",
    category: "ram",
    specs: {
      Loại: "DDR5",
      "Dung lượng": "48GB (Kit)",
      "Tốc độ": "5600MHz",
      "Đặc biệt": "48GB",
    },
  },
  {
    id: 307,
    name: "ADATA XPG Lancer Blade 16GB (2x8GB) DDR5 6000MHz",
    price: "2190000",
    image: "../img/ram/d5_16gb.jpg",
    category: "ram",
    specs: {
      Loại: "DDR5",
      "Dung lượng": "16GB (Kit)",
      "Tốc độ": "6000MHz",
      "Thiết kế": "Mỏng",
    },
  },
  {
    id: 308,
    name: "Samsung 16GB DDR4 2666MHz (Non-ECC)",
    price: "1050000",
    image: "../img/ram/samsung_16gb.jpg",
    category: "ram",
    specs: {
      Loại: "DDR4",
      "Dung lượng": "16GB (Single)",
      "Tốc độ": "2666MHz",
      "Tối ưu": "Server/Office",
    },
  },
  {
    id: 309,
    name: "KLEVV CRAS X RGB 32GB (2x16GB) DDR4 4000MHz",
    price: "2990000",
    image: "../img/ram/d4_4000.jpg",
    category: "ram",
    specs: {
      Loại: "DDR4",
      "Dung lượng": "32GB (Kit)",
      "Tốc độ": "4000MHz",
      LED: "RGB Sáng",
    },
  },
  {
    id: 310,
    name: "Kingston FURY Impact 32GB (2x16GB) DDR5 SO-DIMM 5200MHz",
    price: "2990000",
    image: "../img/ram/sodimm.jpg",
    category: "ram",
    specs: {
      Loại: "DDR5",
      "Dung lượng": "32GB (Kit)",
      "Tốc độ": "5200MHz",
      Dạng: "Laptop",
    },
  },
  {
    id: 311,
    name: "Colorful Battle-Ax 16GB DDR4 3200MHz",
    price: "1250000",
    image: "../img/ram/colorful_16g.jpg",
    category: "ram",
    specs: {
      Loại: "DDR4",
      "Dung lượng": "16GB (Single)",
      "Tốc độ": "3200MHz",
      "Tản nhiệt": "Đỏ",
    },
  },
  {
    id: 312,
    name: "Kingston ValueRAM 4GB DDR3 1600MHz",
    price: "350000",
    image: "../img/ram/d3_4gb.jpg",
    category: "ram",
    specs: {
      Loại: "DDR3",
      "Dung lượng": "4GB (Single)",
      "Tốc độ": "1600MHz",
      "Phân khúc": "Cũ/Văn phòng",
    },
  },
  {
    id: 313,
    name: "G.Skill Flare X5 64GB (2x32GB) DDR5 6000MHz (AMD EXPO)",
    price: "6990000",
    image: "../img/ram/flarex5.jpg",
    category: "ram",
    specs: {
      Loại: "DDR5",
      "Dung lượng": "64GB (Kit)",
      "Tốc độ": "6000MHz",
      "Tối ưu": "AMD",
    },
  },
  {
    id: 314,
    name: "Lexar Ares RGB 32GB (2x16GB) DDR5 6800MHz",
    price: "4590000",
    image: "../img/ram/ares_6800.jpg",
    category: "ram",
    specs: {
      Loại: "DDR5",
      "Dung lượng": "32GB (Kit)",
      "Tốc độ": "6800MHz",
      "Tần số": "Siêu tốc",
    },
  },
  {
    id: 315,
    name: "TeamGroup T-Force XTREEM ARGB 16GB (2x8GB) DDR4 4000MHz",
    price: "2490000",
    image: "../img/ram/xtreem_argb.jpg",
    category: "ram",
    specs: {
      Loại: "DDR4",
      "Dung lượng": "16GB (Kit)",
      "Tốc độ": "4000MHz",
      "Thiết kế": "Gương",
    },
  },

  // ==================================================
  //                 CASE (VỎ MÁY TÍNH) - 15 sản phẩm
  // ==================================================
  {
    id: 401,
    name: "Case Cooler Master MasterBox TD500 Mesh V2 White",
    price: "2100000",
    image: "../img/case/td500.jpg",
    category: "case",
    specs: {
      Loại: "Mid Tower",
      "Mặt trước": "Mesh",
      "Màu sắc": "Trắng",
      "Fan đi kèm": "3 Fan ARGB",
    },
  },
  {
    id: 402,
    name: "Case Lian Li O11 Dynamic EVO Black",
    price: "3890000",
    image: "../img/case/o11evo.jpg",
    category: "case",
    specs: {
      Loại: "Mid Tower",
      "Mặt trước": "Kính",
      "Màu sắc": "Đen",
      "Đặc điểm": "Thiết kế đa năng",
    },
  },
  {
    id: 403,
    name: "Case NZXT H9 Flow White",
    price: "4200000",
    image: "../img/case/h9flow.jpg",
    category: "case",
    specs: {
      Loại: "Mid Tower",
      "Mặt trước": "Kính",
      "Màu sắc": "Trắng",
      "Tối ưu": "Tản nhiệt",
    },
  },
  {
    id: 404,
    name: "Case Xigmatek NYX 3F Mini Tower",
    price: "890000",
    image: "../img/case/nyx.jpg",
    category: "case",
    specs: {
      Loại: "Mini Tower",
      "Mặt trước": "Kính",
      "Màu sắc": "Đen",
      Giá: "Phổ thông",
    },
  },
  {
    id: 405,
    name: "Case DeepCool CH510 Mesh Digital",
    price: "1590000",
    image: "../img/case/ch510.jpg",
    category: "case",
    specs: {
      Loại: "Mid Tower",
      "Mặt trước": "Mesh",
      "Màu sắc": "Đen",
      "Đặc điểm": "Hiển thị nhiệt độ",
    },
  },
  {
    id: 406,
    name: "Case Montech AIR 903 MAX White",
    price: "1690000",
    image: "../img/case/903max.jpg",
    category: "case",
    specs: {
      Loại: "Mid Tower",
      "Mặt trước": "Mesh",
      "Màu sắc": "Trắng",
      "Fan đi kèm": "4 Fan",
    },
  },
  {
    id: 407,
    name: "Case Corsair 4000D Airflow Black",
    price: "1850000",
    image: "../img/case/4000d.jpg",
    category: "case",
    specs: {
      Loại: "Mid Tower",
      "Mặt trước": "Mesh",
      "Màu sắc": "Đen",
      "Thiết kế": "Sạch sẽ",
    },
  },
  {
    id: 408,
    name: "Case Fractal Design Meshify 2 XL",
    price: "5990000",
    image: "../img/case/meshify2xl.jpg",
    category: "case",
    specs: {
      Loại: "Full Tower",
      "Mặt trước": "Mesh",
      "Màu sắc": "Đen",
      "Đặc điểm": "Kích thước lớn",
    },
  },
  {
    id: 409,
    name: "Case Phanteks Eclipse G360A Black",
    price: "1790000",
    image: "../img/case/g360a.jpg",
    category: "case",
    specs: {
      Loại: "Mid Tower",
      "Mặt trước": "Mesh",
      "Màu sắc": "Đen",
      "Fan đi kèm": "3 Fan ARGB",
    },
  },
  {
    id: 410,
    name: "Case Cooler Master NR200P Max Mini ITX",
    price: "6590000",
    image: "../img/case/nr200p.jpg",
    category: "case",
    specs: {
      Loại: "Mini ITX",
      "Mặt trước": "Mesh",
      "Màu sắc": "Đen",
      "Tích hợp": "PSU & Tản AIO",
    },
  },
  {
    id: 411,
    name: "Case ASUS TUF Gaming GT502 White",
    price: "4590000",
    image: "../img/case/gt502.jpg",
    category: "case",
    specs: {
      Loại: "Mid Tower",
      "Mặt trước": "Kính",
      "Màu sắc": "Trắng",
      "Đặc điểm": "Thiết kế hai buồng",
    },
  },
  {
    id: 412,
    name: "Case Segotep Halo 6 Mid Tower",
    price: "690000",
    image: "../img/case/halo6.jpg",
    category: "case",
    specs: {
      Loại: "Mid Tower",
      "Mặt trước": "Kính",
      "Màu sắc": "Đen",
      Giá: "Siêu rẻ",
    },
  },
  {
    id: 413,
    name: "Case Sama JAX 3F White",
    price: "1050000",
    image: "../img/case/jax3f.jpg",
    category: "case",
    specs: {
      Loại: "Mid Tower",
      "Mặt trước": "Kính",
      "Màu sắc": "Trắng",
      "Fan đi kèm": "3 Fan LED",
    },
  },
  {
    id: 414,
    name: "Case Lian Li Lancool 216 RGB Black",
    price: "2590000",
    image: "../img/case/lancool216.jpg",
    category: "case",
    specs: {
      Loại: "Mid Tower",
      "Mặt trước": "Mesh",
      "Màu sắc": "Đen",
      "Đặc điểm": "Lưới siêu lớn",
    },
  },
  {
    id: 415,
    name: "Case Thermaltake Core P3 Black",
    price: "2990000",
    image: "../img/case/corep3.jpg",
    category: "case",
    specs: {
      Loại: "Open Frame",
      "Mặt trước": "Mở",
      "Màu sắc": "Đen",
      "Đặc điểm": "Trưng bày",
    },
  },

  // ==================================================
  //                  MÀN HÌNH - 15 sản phẩm
  // ==================================================
  {
    id: 501,
    name: "Màn hình Samsung Odyssey G9 OLED 49 inch",
    price: "32900000",
    image: "../img/monitor/g9oled.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "49 inch",
      "Độ phân giải": "5120x1440",
      "Tấm nền": "OLED",
      "Tần số quét": "240Hz",
    },
  },
  {
    id: 502,
    name: "Màn hình Dell UltraSharp U2723QE 27 inch",
    price: "15500000",
    image: "../img/monitor/u2723qe.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "27 inch",
      "Độ phân giải": "4K (3840x2160)",
      "Tấm nền": "IPS",
      "Tối ưu": "Đồ họa",
    },
  },
  {
    id: 503,
    name: "Màn hình LG UltraGear 27GN650-B 27 inch",
    price: "6490000",
    image: "../img/monitor/27gn650.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "27 inch",
      "Độ phân giải": "Full HD (1920x1080)",
      "Tấm nền": "IPS",
      "Tần số quét": "144Hz",
    },
  },
  {
    id: 504,
    name: "Màn hình ASUS TUF Gaming VG27AQ 27 inch",
    price: "8990000",
    image: "../img/monitor/vg27aq.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "27 inch",
      "Độ phân giải": "2K (2560x1440)",
      "Tấm nền": "IPS",
      "Tần số quét": "165Hz",
    },
  },
  {
    id: 505,
    name: "Màn hình ViewSonic VA2447-MH 24 inch",
    price: "3190000",
    image: "../img/monitor/va2447.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "24 inch",
      "Độ phân giải": "Full HD (1920x1080)",
      "Tấm nền": "VA",
      "Tối ưu": "Văn phòng",
    },
  },
  {
    id: 506,
    name: "Màn hình Acer Predator XB323QK 32 inch",
    price: "25990000",
    image: "../img/monitor/xb323qk.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "32 inch",
      "Độ phân giải": "4K (3840x2160)",
      "Tấm nền": "IPS",
      "Tần số quét": "144Hz",
    },
  },
  {
    id: 507,
    name: "Màn hình MSI MAG 325CQRF-QD 32 inch",
    price: "12590000",
    image: "../img/monitor/mag325.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "32 inch",
      "Độ phân giải": "2K (2560x1440)",
      "Tấm nền": "VA",
      "Tần số quét": "170Hz",
      "Đặc điểm": "Quantum Dot",
    },
  },
  {
    id: 508,
    name: "Màn hình AOC 24G2SPU/BK 24 inch",
    price: "4590000",
    image: "../img/monitor/24g2spu.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "24 inch",
      "Độ phân giải": "Full HD (1920x1080)",
      "Tấm nền": "IPS",
      "Tần số quét": "165Hz",
    },
  },
  {
    id: 509,
    name: "Màn hình BenQ MOBIUZ EX2710Q 27 inch",
    price: "9990000",
    image: "../img/monitor/ex2710q.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "27 inch",
      "Độ phân giải": "2K (2560x1440)",
      "Tấm nền": "IPS",
      "Tần số quét": "144Hz",
      "Âm thanh": "Loa TreVolo",
    },
  },
  {
    id: 510,
    name: "Màn hình HP P24v G5 24 inch",
    price: "2890000",
    image: "../img/monitor/p24vg5.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "24 inch",
      "Độ phân giải": "Full HD (1920x1080)",
      "Tấm nền": "IPS",
      "Tối ưu": "Văn phòng",
    },
  },
  {
    id: 511,
    name: "Màn hình Gigabyte M32U 32 inch",
    price: "17990000",
    image: "../img/monitor/m32u.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "32 inch",
      "Độ phân giải": "4K (3840x2160)",
      "Tấm nền": "IPS",
      "Tần số quét": "144Hz",
      "Kết nối": "KVM",
    },
  },
  {
    id: 512,
    name: "Màn hình Xiaomi Redmi 1A 23.8 inch",
    price: "2490000",
    image: "../img/monitor/redmi1a.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "23.8 inch",
      "Độ phân giải": "Full HD (1920x1080)",
      "Tấm nền": "IPS",
      "Thiết kế": "Viền mỏng",
    },
  },
  {
    id: 513,
    name: "Màn hình ASUS ROG Swift PG42UQ 42 inch",
    price: "45900000",
    image: "../img/monitor/pg42uq.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "42 inch",
      "Độ phân giải": "4K (3840x2160)",
      "Tấm nền": "OLED",
      "Tần số quét": "138Hz OC",
    },
  },
  {
    id: 514,
    name: "Màn hình HKC MB27V13 27 inch",
    price: "4200000",
    image: "../img/monitor/mb27v13.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "27 inch",
      "Độ phân giải": "2K (2560x1440)",
      "Tấm nền": "IPS",
      "Tần số quét": "75Hz",
    },
  },
  {
    id: 515,
    name: "Màn hình E-DRA EGM27F180 27 inch",
    price: "4790000",
    image: "../img/monitor/egm27f180.jpg",
    category: "man-hinh",
    specs: {
      "Kích thước": "27 inch",
      "Độ phân giải": "Full HD (1920x1080)",
      "Tấm nền": "Fast IPS",
      "Tần số quét": "180Hz",
    },
  },

  // ==================================================
  //                  GEAR (THIẾT BỊ NGOẠI VI) - 20 sản phẩm
  // ==================================================
  // --- Bàn phím ---
  {
    id: 601,
    name: "Bàn phím Akko 3098B Plus Black & Pink (Switch Akko V3 Pro)",
    price: "2190000",
    image: "../img/gear/akko3098.jpg",
    category: "gear",
    specs: {
      Loại: "Cơ",
      "Kết nối": "3 Mode",
      Switch: "Akko Pro",
      "Kích thước": "98%",
    },
  },
  {
    id: 602,
    name: "Bàn phím Logitech G Pro X TKL Lightspeed (GX Blue)",
    price: "3890000",
    image: "../img/gear/gprox_tkl.jpg",
    category: "gear",
    specs: {
      Loại: "Cơ",
      "Kết nối": "Không dây",
      Switch: "GX Blue",
      "Kích thước": "TKL",
    },
  },
  {
    id: 603,
    name: "Bàn phím DareU EK87 Black (Brown Switch)",
    price: "690000",
    image: "../img/gear/dareuek87.jpg",
    category: "gear",
    specs: { Loại: "Cơ", "Kết nối": "Có dây", Switch: "D", Giá: "Giá rẻ" },
  },
  {
    id: 604,
    name: "Bàn phím Razer BlackWidow V4 Pro (Green Switch)",
    price: "5290000",
    image: "../img/gear/bwv4pro.jpg",
    category: "gear",
    specs: {
      Loại: "Cơ",
      "Kết nối": "Có dây",
      Switch: "Razer Green",
      "Đặc điểm": "Media Bar",
    },
  },
  {
    id: 605,
    name: "Bàn phím Leopold FC900R PD Ash Yellow (Cherry MX Red)",
    price: "3200000",
    image: "../img/gear/fc900r.jpg",
    category: "gear",
    specs: {
      Loại: "Cơ",
      "Kết nối": "Có dây",
      Switch: "Cherry MX",
      "Thiết kế": "Cổ điển",
    },
  },

  // --- Chuột ---
  {
    id: 606,
    name: "Chuột Logitech G Pro X Superlight 2 (Black)",
    price: "3690000",
    image: "../img/gear/gprox2.jpg",
    category: "gear",
    specs: {
      Loại: "Gaming",
      "Kết nối": "Không dây",
      "Cảm biến": "HERO 25K",
      "Trọng lượng": "Nhẹ (~60g)",
    },
  },
  {
    id: 607,
    name: "Chuột Razer Viper V2 Pro (White)",
    price: "3290000",
    image: "../img/gear/viperv2.jpg",
    category: "gear",
    specs: {
      Loại: "Gaming",
      "Kết nối": "Không dây",
      "Cảm biến": "Focus Pro 30K",
      "Trọng lượng": "58g",
    },
  },
  {
    id: 608,
    name: "Chuột SteelSeries Aerox 3 Wireless (2022)",
    price: "1990000",
    image: "../img/gear/aerox3.jpg",
    category: "gear",
    specs: {
      Loại: "Gaming",
      "Kết nối": "Không dây",
      "Thiết kế": "Lưới tổ ong",
      "Trọng lượng": "68g",
    },
  },
  {
    id: 609,
    name: "Chuột Corsair Harpoon RGB Pro",
    price: "790000",
    image: "../img/gear/harpoon.jpg",
    category: "gear",
    specs: {
      Loại: "Gaming",
      "Kết nối": "Có dây",
      "Cảm biến": "12000 DPI",
      Giá: "Phổ thông",
    },
  },
  {
    id: 610,
    name: "Chuột Logitech MX Master 3S (Graphite)",
    price: "2890000",
    image: "../img/gear/mxmaster3s.jpg",
    category: "gear",
    specs: {
      Loại: "Văn phòng",
      "Kết nối": "Không dây",
      "Cảm biến": "8K DPI",
      "Tối ưu": "Đồ họa/Code",
    },
  },

  // --- Tai nghe ---
  {
    id: 611,
    name: "Tai nghe HyperX Cloud Alpha S (Blue)",
    price: "2490000",
    image: "../img/gear/cloudalpha.jpg",
    category: "gear",
    specs: {
      Loại: "Chụp tai",
      "Âm thanh": "7.1 Surround",
      "Kết nối": "Có dây",
      "Chất liệu": "Kim loại",
    },
  },
  {
    id: 612,
    name: "Tai nghe Sony WH-1000XM5 (Black)",
    price: "7990000",
    image: "../img/gear/xm5.jpg",
    category: "gear",
    specs: {
      Loại: "Chụp tai",
      "Kết nối": "Không dây",
      "Tính năng": "Chống ồn ANC",
      "Tối ưu": "Di động",
    },
  },
  {
    id: 613,
    name: "Tai nghe Razer Barracuda X (2022)",
    price: "2350000",
    image: "../img/gear/barracuda.jpg",
    category: "gear",
    specs: {
      Loại: "Gaming",
      "Kết nối": "Không dây 3 Mode",
      "Tối ưu": "Đa nền tảng",
      "Trọng lượng": "Nhẹ",
    },
  },
  {
    id: 614,
    name: "Tai nghe DareU EH722S USB 7.1",
    price: "590000",
    image: "../img/gear/eh722s.jpg",
    category: "gear",
    specs: {
      Loại: "Chụp tai",
      "Âm thanh": "7.1 Giả lập",
      "Kết nối": "USB",
      Giá: "Giá rẻ",
    },
  },
  {
    id: 615,
    name: "Tai nghe SteelSeries Arctis Nova Pro Wireless",
    price: "9490000",
    image: "../img/gear/novapro.jpg",
    category: "gear",
    specs: {
      Loại: "Chụp tai",
      "Kết nối": "Không dây",
      "Tính năng": "ANC",
      "Đặc điểm": "Base Station",
    },
  },

  // --- Lót chuột/Webcam ---
  {
    id: 616,
    name: "Mousepad Glorious PC Gaming Race XXL",
    price: "790000",
    image: "../img/gear/mousepad_xxl.jpg",
    category: "gear",
    specs: {
      Loại: "Lót chuột",
      "Kích thước": "XXL (91x43cm)",
      "Bề mặt": "Vải tốc độ",
    },
  },
  {
    id: 617,
    name: "Webcam Logitech StreamCam (Graphite)",
    price: "2590000",
    image: "../img/gear/streamcam.jpg",
    category: "gear",
    specs: {
      Loại: "Webcam",
      "Độ phân giải": "1080p/60fps",
      "Kết nối": "USB-C",
      "Tối ưu": "Stream",
    },
  },
  {
    id: 618,
    name: "Mousepad Razer Goliathus Extended Chroma",
    price: "1290000",
    image: "../img/gear/goliathus.jpg",
    category: "gear",
    specs: {
      Loại: "Lót chuột",
      "Kích thước": "Extended",
      "Tính năng": "LED RGB",
    },
  },
  {
    id: 619,
    name: "Webcam Rapoo C280 2K",
    price: "690000",
    image: "../img/gear/rapooc280.jpg",
    category: "gear",
    specs: {
      Loại: "Webcam",
      "Độ phân giải": "2K (2560x1440)",
      "Kết nối": "USB-A",
      Giá: "Phổ thông",
    },
  },
  {
    id: 620,
    name: "Mousepad Zowie G-SR-SE DEEP BLUE",
    price: "890000",
    image: "../img/gear/gsrse.jpg",
    category: "gear",
    specs: {
      Loại: "Lót chuột",
      "Kích thước": "Lớn",
      "Bề mặt": "Vải kiểm soát",
    },
  },
];

// Initialize products with admin additions and pricing sync
let products = loadAdminProducts();
products = syncPricesFromAdmin(products);
