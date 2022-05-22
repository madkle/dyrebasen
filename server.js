const express = require("express");
const routes = require("./routes/routing.js")
const server = express();
const auth = require("./modules/auth.js");
const PORT = process.env.PORT || 8080;
server.set("port", PORT);

// middleware ---------------------------
server.use(express.static("public"));
server.use(express.json({limit: '2mb'}));
server.use(routes);
//general error handlogig----------------
server.use(function(err, req, res, next){
	res.status(500).json({
		error: "something went wrong on the server!",
		descr: err
	}).end();
});
server.listen(server.get("port"), function(){
	console.log("server running", server.get("port"));
});