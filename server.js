var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var index = require("./routes/index");
var tasks = require("./routes/tasks");
var port =3000;

var app = express();

//view Engine
app.set("views",path.join(__dirname,"views"));
app.set("view engine", path.join("ejs"));
app.engine("html",require("ejs").renderFile);

//set Static Folder
app.use(express.static(path.join(__dirname,"client")));

//Body Parser Middler ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use("/",index);
app.use("/api",tasks);

app.listen(port, function(){
    console.log("server started on port"+ port);
});



