const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "tramway.proxy.rlwy.net",
  user: "root",
  password: "uzMISYYHBNuvSvxwttxKYwGqvMMWniHe",
  database: "TCP_railway",
  port: 36807 
});

connection.connect(err => {
  if (err) {
    console.log("❌ Lỗi kết nối DB:", err);
  } else {
    console.log("✅ Kết nối MySQL thành công");
  }
});

module.exports = connection;