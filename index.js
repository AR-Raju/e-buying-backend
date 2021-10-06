const express = require("express");
require("dotenv").config();

const cors = require("cors");

const app = express();

app.use(require("body-parser").json());
app.use(cors());
const port = 5000;

const { MongoClient } = require("mongodb");

console.log(process.env.DB_User);

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.ryx6s.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

app.get("/", (req, res) => {
  res.send("Hello e-buying!");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("eBuyingStore").collection("products");
  const ordersCollection = client.db("eBuyingStore").collection("orders");

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    console.log(product);
    productsCollection.insertOne(product).then((result) => {
      console.log(result);
      res.send(result);
    });
  });

  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/product/:key", (req, res) => {
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.post("/productByKeys", (req, res) => {
    const productKyes = req.body;
    productsCollection
      .find({ key: { $in: productKyes } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log(order);
    ordersCollection.insertOne(order).then((result) => {
      console.log(result);
      res.send(result);
    });
  });
});

app.listen(process.env.PORT || port);
