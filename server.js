var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override")

var app = express();
var port = 3000;


app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride("_method"));
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "quotes_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

app.get('/', function(req, res) {
	connection.query('SELECT * FROM `episode` JOIN `season` WHERE `episode`.`host` LIKE ?? AND `episode`.`sId` = `season`.`sid` ORDER BY `episode`.`sId`;', function (err, data) {
	if (err) {
		throw err;
	}
	
	res.render('index', {season: data});	
	})
	
});

app.delete("/:host", function(req, res) {
  connection.query("DELETE FROM quotes WHERE host = ?", [req.params.id], function(err, result) {
    if (err) {
      throw err;
    }
    res.redirect("/");
  });
});

app.put("/:host", function(req, res) {
  connection.query("UPDATE `episode` SET sId = ??, eId = ?? WHERE host = ??", [
    req.body.sid, req.body.eid, req.params.host
  ], function(err, result) {
    if (err) {
      throw err;
    }

    res.redirect("/");
  });
});