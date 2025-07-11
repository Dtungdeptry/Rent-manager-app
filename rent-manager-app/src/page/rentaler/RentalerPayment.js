import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
//   const [transactionCode, setTransactionCode] = useState("");
//   const [note, setNote] = useState("");
  const navigate = useNavigate();
  const [transferContent, setTransferContent] = useState("TT RENTAL 250531_6941");
  const qrUrl = `https://img.vietqr.io/image/TPB-0586540730-qr_only.png?amount=200000&addInfo=${encodeURIComponent(transferContent)}&accountName=Duong%20Xuan%20Hoang%20Tung`;

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!transactionCode.trim()) {
    //   alert("Vui lòng nhập mã giao dịch.");
    //   return;
    // }

    // Gửi dữ liệu xác nhận về backend nếu có
    console.log("Transfer Content:", transferContent);
    // console.log("Transaction Code:", transactionCode);
    // console.log("Note:", note);

    alert("Cảm ơn bạn! Giao dịch đang được xác nhận. Trong vòng 4 giờ chúng tôi sẽ xử lí tài khoản của bạn. Nếu bạn vẫn không đăng nhập được vui lòng contact qua Email: dtung6898@gmail.com");
    // setTransactionCode("");
    // setNote("");
    setTimeout(() => {
      navigate("/");
    },1500);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Thanh toán nâng cấp tài khoản</h2>

      <img
        src={qrUrl}
        alt="QR ngân hàng"
        style={styles.qr}
      />

      <div style={styles.info}>
        <p><strong>Người nhận:</strong> Dương Xuân Hoàng Tùng</p>
        <p><strong>Ngân hàng:</strong> TP Bank</p>
        <p><strong>Số tài khoản:</strong> 0586540730</p>
        <p><strong>Số tiền:</strong> 200.000 VND</p>

        <label><strong>Nội dung chuyển khoản: (Vui lòng nhập email tài khoản của bạn, không bao gồm gmail.com)</strong></label>
        <input
          type="text"
          value={transferContent}
          onChange={(e) => setTransferContent(e.target.value)}
          style={styles.input}
        />
      </div>

      <form onSubmit={handleSubmit}>
        {/* <label>Mã giao dịch (nếu có):</label>
        <input
          type="text"
          value={transactionCode}
          onChange={(e) => setTransactionCode(e.target.value)}
          style={styles.input}
        />

        <label>Ghi chú (tuỳ chọn):</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={styles.textarea}
        ></textarea> */}

        <button type="submit" style={styles.button}>Tôi đã chuyển khoản</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 0 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    color: "#333",
    marginBottom: "16px",
  },
  qr: {
    width: "300px",
    display: "block",
    margin: "0 auto 16px auto",
  },
  info: {
    marginBottom: "20px",
    fontSize: "16px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    minHeight: "80px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "16px",
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default PaymentPage;
