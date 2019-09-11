var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");
var path = require("path");
var crypto = require('crypto');
// var evercookie = require('evercookie');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');

var app = express();
var httpHeaders = {};
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(bodyParser.json({
  limit: '500mb'
}));

var check = "No post";
console.log(check);
app.use(express.static(__dirname +'/../Client_Server/Public'), {
	maxage: 0
});

app.post('/post', function(req, res){
	check = req.data;
	console.log(check);
});

var server = app.listen(3030, function(){
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
});
