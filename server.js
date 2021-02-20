const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(express.static("."));

app.get("/catalog", (req, res) => {
  fs.readFile("./data/catalogData.json", "utf-8", (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.error(err);
      res.send(JSON.stringify({}));
    }
  });
});

app.post("/catalog", (req, res) => {
  const item = req.body;
  fs.readFile("./data/catalogData.json", "utf-8", (err, data) => {
    const goods = JSON.parse(data);
    goods.push(item);
    fs.writeFile("./data/catalogData.json", JSON.stringify(goods), (err) => {
      if (!err) {
        res.json({ res: true });
      } else {
        res.json({ res: false, err });
      }
    });
  });
});

app.get("/cart", (req, res) => {
  fs.readFile("./data/cart.json", "utf-8", (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.error(err);
      res.send(JSON.stringify({}));
    }
  });
});

app.post("/addToCart", (req, res) => {
  fs.readFile("cart.json", "utf-8", (err, data) => {
    const cart = JSON.parse(data);
    const item = req.body;

    cart.push(item);

    fs.writeFile("./data/cart.json", JSON.stringify(cart), (err) => {
      if (!err) {
        res.json({ res: true });
      } else {
        res.json({ res: false, err });
      }
    });
  });
});

app.listen(3000, () => {
  console.log("Server start on port 3000");
});
