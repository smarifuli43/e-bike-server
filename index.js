const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

/* 
// https://i.ibb.co/zRZLtQ5/Mountain-Bike-Semi-Electric.png
// https://i.ibb.co/2qgkfcC/Mountain-Bike-With-Middle-Single-Shock.png
// https://i.ibb.co/g3fB5Yk/Ultimate-Triathlon-Super-Bike.png
// https://i.ibb.co/xzW4T1L/Vintage-Classic-Duo-Rare.png
// https://i.ibb.co/Nty73wQ/Vintage-Classic-Green.png
// https://i.ibb.co/LRxBTZT/Vintage-Classic-With-Basket-Rare.png
// https://i.ibb.co/9tjpzrw/Vintage-Classic-With-Basket.png
// https://i.ibb.co/sJPYQ4Z/Adventure-White-Solid.png
// https://i.ibb.co/D7mSXFX/Classic-Green-Hi.png
 */

// const i = [
//   {
//     name: 'Vintage Classic With Basket',
//     img: 'https://i.ibb.co/9tjpzrw/Vintage-Classic-With-Basket.png',
//     price: 599,
//     description: ' This is a world class vintage bike, people like it for its vintage but smartest design. ',
    
//   },
// ];

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
  }
  finally {
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