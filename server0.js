//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
const sql0 = require("mssql");
var app = express();
// app.use(express.bodyParser());
// var dx = require("dojo.js");

var db = require("./db");

// Setting Base directory
app.use(bodyParser.json()); // стандартный модуль, для парсинга JSON в запросах
app.use(bodyParser.urlencoded());

// app.use(express.logger('dev')); // выводим все запросы со статусами в консоль
// app.use(express.methodOverride()); // поддержка put и delete

//CORS Middleware
app.use(function (req, res, next) {
	//Enabling CORS 
	res.header("Access-Control-Allow-Origin", "http://localhost");
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept");
	// req.header("Access-Control-Allow-Origin", "*");
	// req.header("Access-Control-Allow-Credentials", true);
	next();
});

//Setting up server
var server = app.listen(process.env.PORT || 4000, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});

//Initiallising connection string
var config = {
	user: "111",
	password: "111",
	server: "HNBA101816\\SQLEXPRESS",
	database: "DashBoard"

};

//Function to connect to database and execute query
var executeQuery = function (res, query) {
	var request = new db.Request();
	request.query(query, function (err, rs) {
		if (err) {
			console.log("Error while querying database :- " + err);
			res.send(err);
		}
		else {
			res.send(rs);
		}
	});
};

sql0.close();
sql0.connect(config).then(pool => {
	// Query

	return pool.request()
		// .input('input_parameter', sql.Int, value)
		.query('select * FROM [dbo].[test_Data]')
}).then(result => {
	console.dir(result)
	res.send(result)
	// sql0.close();
	// Stored procedure

	// 	return pool.request()
	// 		.input('input_parameter', sql.Int, value)
	// 		.output('output_parameter', sql.VarChar(50))
	// 		.execute('procedure_name')
	// }).then(result => {
	// 	console.dir(result)
}).catch(err => {
	// ... error checks
	console.log(err);
})

sql0.on('error', err => {
	// ... error handler
	console.log(err);
})






app.get("/api/user", function (req, res) {
	var query = "select * FROM [dbo].[test_Data]";
	executeQuery(res, query);
});

//POST API
app.post("/api/userInsert", function (req, res) {
	let values = JSON.parse(req.body.values);
	var query = "INSERT INTO [dbo].[test_Data]([FirstName],[LastName]) VALUES ('" + values.FirstName + "','" + values.LastName + "')";
	executeQuery(res, query);
});

//PUT API
app.put("/api/userUpdate", function (req, res) {
	let values = JSON.parse(req.body.values);
	console.log(values.lenght)
	var query = "UPDATE [dbo].[test_Data] SET ";
	if (js.FirstName !== undefined) {
		query += "FirstName = '" + js.FirstName + "',"
	};
	if (js.LastName !== undefined) {
		query += "LastName = '" + js.LastName + "',"
	};
	query = query.slice(0, -1);
	query += " WHERE OrderID = " + req.query.key;
	executeQuery(res, query);
});

// DELETE API
app.delete("/api/userDelete", function (req, res) {
	console.log(req.body.key);
	var query = "DELETE FROM [dbo].[test_Data] WHERE OrderID = " + req.body.key;
	executeQuery(res, query);
});
