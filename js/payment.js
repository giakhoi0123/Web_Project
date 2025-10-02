document
  .getElementById("payment-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    let method = document.querySelector('input[name="payment"]:checked').value;
    let infoDiv = document.getElementById("payment-info");

    if (method === "momo") {
      infoDiv.innerHTML = `
      <h3>Thanh toán qua Momo</h3>
      <p>Quét mã QR sau để thanh toán:</p>
      <img src="https://via.placeholder.com/200x200?text=QR+Momo" alt="QR Momo">
    `;
    } else if (method === "bank") {
      infoDiv.innerHTML = `
      <h3>Chuyển khoản Ngân hàng</h3>
      <p>Ngân hàng: ABC Bank</p>
      <p>Số tài khoản: 123456789</p>
      <p>Chủ TK: Shop Máy Tính</p>
    `;
    } else if (method === "cod") {
      infoDiv.innerHTML = `
      <h3>Thanh toán khi nhận hàng</h3>
      <p>Bạn sẽ thanh toán tiền mặt khi nhận sản phẩm.</p>
    `;
    }
  });
