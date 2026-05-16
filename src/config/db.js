const mysql=require('mysql2');  
const db=mysql.createConnection(
    {
        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME,
        port:process.env.DB_PORT
    }
);
db.connect((err)=>{
    if(err)
        {
            console.error('Lỗi kết nối cơ sở dữ liệu:', err);
        }
    else
        {
            console.log('Kết nối thành công đến cơ sở dữ liệu');
        }
});
module.exports=db;  