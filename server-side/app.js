const express = require("express");
const app = express();
const http = require("http").Server(app);
//const cors = require('cors'); // Remove in production !!!
const mongoose = require("mongoose");

// create server
const port = 3900;
http.listen(port, () => console.log(`Listening to port ${port}.`));

// create connection to MongoDB via mongoose
mongoose
	.connect("mongodb://localhost/hackeru_finel_project", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() =>
		console.log(
			'MongoDB connected. \nWorking on "hackeru_finel_project" DataBase.'
		)
	)
	.catch((err) => console.log(err));

//app.use(cors()); // Remove in production !!!

// set req/res to obj/json
app.use(express.json());

/* BUSSINESS REGISTRATION */
//all requests for 'domain/api/bizs' will be rout to this file
const bizs = require("./routs/bizs");
app.use("/api/bizs", bizs);

/* CLIENTS REGISTRATION */
// all requests for 'domain/api/clients' will be rout to this file
const clients = require("./routs/clients");
app.use("/api/clients", clients);

/* BUSSINESS & CLIENTS LOGIN */
// all requests for 'domain/api/auth' will be rout to this file
const auth = require("./routs/auth");
app.use("/api/auth", auth);
