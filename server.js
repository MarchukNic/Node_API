//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
const sql = require("mssql");
var app = express();

// app.use(express.bodyParser());
// var dx = require("dojo.js");

// Setting Base directory
app.use(bodyParser.json()); // стандартный модуль, для парсинга JSON в запросах
app.use(bodyParser.urlencoded({ extended: true }));

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
var dbConfig = {
    user: "111",
    password: "111",
    server: "HNBA101816\\SQLEXPRESS",
    database: "DashBoard"
};

//Function to connect to database and execute query
var executeQuery = function (res, query) {
    let conn = new sql.ConnectionPool(dbConfig);
    conn.connect().then(function () {
        var req = new sql.Request(conn);
        req.query(query).then(function (recordset) {
            console.log(recordset);
            res.send(recordset.recordset);
            conn.close();
        })
        .catch(function (err) {
            console.log(err);
            res.send(err);
            conn.close();
        });        
    })
    .catch(function (err) {
        console.log(err);
        res.send(err);
    });
    // sql.connect(dbConfig, function (err) {
    //     if (err) {
    //         console.log("Error while connecting database :- " + err);
    //         console.log(res);
    //         res.send(err);
    //     }
    //     else {
    //         // create Request object
    //         var request = new sql.Request();
    //         // query to the database
    //         request.query(query, function (err, rs) {
    //             if (err) {
    //                 console.log("Error while querying database :- " + err);
    //                 console.log(rs.recordset);
    //                 res.send(err);
    //                 sql.close();
    //             }
    //             else {
    //                 console.log(rs);
    //                 res.send(rs.recordset);
    //                 sql.close();
    //             }
    //         });
    //     }
    // });
}

var executeQuery2 = function (res, query) {
    sql.connect(dbConfig, function (err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            console.log(res);
            res.send(err);
        }
        else {
            // create Request object
            var request = new sql.Request();
            // query to the database
            request.query(query, function (err, rs) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    console.log(rs.recordset);
                    res.send(err);
                    sql.close();
                }
                else {
                    console.log(rs);


                    sql.close();

                }
            })
                .done(res.send(rs.recordset));
        }
    });
}

var executeQuery3 = function (res, query) {
    new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query(query)
    }).then(result => {
        console.log(result);
        let rows = result.recordset
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).json(rows);
        res.send(rows);
        sql.close();
    }).catch(err => {
        res.status(500).send({ message: "${err}" })
        sql.close();
    });
}

app.get("/api/user", function (req, res) {
    var query = "select * FROM [dbo].[test_Data]";
    executeQuery(res, query);
});

//POST API
app.post("/api/userInsert", function (req, res) {
    let values = JSON.parse(req.body.values);
    var query = "INSERT INTO [dbo].[test_Data]([FirstName],[LastName]) VALUES ('" + values.FirstName + "','" + values.LastName + "')";
    console.log(values);
    console.log(query);
    executeQuery(res, query);

});

//PUT API
app.put("/api/userUpdate", function (req, res) {
    let values = JSON.parse(req.body.values);
    console.log(values)
    var query = "UPDATE [dbo].[test_Data] SET ";
    if (values.FirstName !== undefined) {
        query += "FirstName = '" + values.FirstName + "',"
    };
    if (values.LastName !== undefined) {
        query += "LastName = '" + values.LastName + "',"
    };
    query = query.slice(0, -1);
    query += " WHERE OrderID = " + req.body.key;
    executeQuery(res, query);
    console.log(query);
});

// DELETE API
app.delete("/api/userDelete", function (req, res) {
    console.log(req.body.key);
    var query = "DELETE FROM [dbo].[test_Data] WHERE OrderID = " + req.body.key;
    executeQuery(res, query);
});
