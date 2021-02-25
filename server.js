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
  fs.readFile("./data/cart.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const cart = JSON.parse(data);
      const item = req.body;

      cart.contents.push(item);
      console.log(cart);

      fs.writeFile("./data/cart.json", JSON.stringify(cart), (err) => {
        if (!err) {
          console.log("Товар добавлен в корзину");
          res.json({ res: true });
        } else {
          res.json({ res: false, err });
        }
      });
    }
  });
});

app.post("/removeFromCart", (req, res) => {
  fs.readFile("./data/cart.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const cart = JSON.parse(data);
      console.log(cart);
      const itemId = req.body;
      const itemToRemove = cart.contents.findIndex((item) => item.id == itemId);
      cart.contents.splice(itemToRemove, 1);
      console.log(cart);

      fs.writeFile("./data/cart.json", JSON.stringify(cart), (err) => {
        if (!err) {
          console.log("товар удален из корзины");
          res.json({ res: true });
        } else {
          res.json({ res: false, err });
        }
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server start on port 3000");
});
