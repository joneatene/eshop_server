const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
};

app.get("/", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(`SELECT * FROM items`);

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "An error occured" });
  }
});

app.post("/", async (req, res) => {
  if (!req.body.title || !req.body.price) {
    return res.status(400).send({ error: "Incorrect data passed" });
  }

  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `INSERT INTO items (title, price) VALUES ('${req.body.title}', '${req.body.price}')`
    );

    res.send("item added");
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "An error occured" });
  }
});

app.post("/register", async (req, res) => {
  if (!req.body.email || !req.body.pass) {
    return res.status(400).send({ error: "Incorrect data passed" });
  }

  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `INSERT INTO users (email, pass) VALUES ('${req.body.email}', '${req.body.pass}')`
    );

    res.send({ status: "OK" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "An error occured" });
  }
});

app.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.pass) {
    return res.status(400).send({ error: "Incorrect data passed" });
  }

  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `SELECT * FROM users WHERE (email) IN ('${req.body.email}')`
    );

    if (req.body.pass === data[0].pass) {
      res.send({ status: "OK" });
    } else {
      res.send({ error: "Wrong email or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: "An error occured" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on ${port}`));
