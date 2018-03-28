// db.js 
var mssql = require("mssql"); 
var dbConfig = {
    user: '111',
    password: '111',
    server: 'HNBA101816\\SQLEXPRESS',
    database: 'DashBoard'   
};

var connection = mssql.connect(dbConfig, function (err) {
    if (err)
        throw err; 
});

module.exports = connection; 