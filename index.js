const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;



const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.razkq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log('database connected');

    const database = client.db('ebike');
    const productsCollection = database.collection('products');
    const usersCollection = database.collection('users');
    const reviewsCollection = database.collection('reviews');
    const orderCollection = database.collection('orders');

    // GET ALL PRODUCTS API
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // POST PRODUCT API
    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.json(result);
    });
    // GET SINGLE productAPI
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.json(product);
    });

    //post users
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    // post user for google sign in
    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // API for make ADMIN
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // api for getting admin info
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // Post REVIEW
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.json(result);
    });

    // get all review
    app.get('/reviews', async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //  POST Order INFO
    app.post('/orders', async (req, res) => {
      const orders = req.body;
      const result = await orderCollection.insertOne(orders);
      res.json(result);
    });
    // GET MY ORDER
    app.get('/orders', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.json(orders);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('E-bike server running');
});
app.listen(port, () => {
  console.log('Running on port', port);
});
