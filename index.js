const bodyParser = require('body-parser')
const express = require('express');
const ObjectId = require('mongodb').MongoClient;
const app = express();
const cors = require("cors");
const port = 5055;
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.66pkv.mongodb.net/buyNow?retryWrites=true&w=majority`;

const pass= '8iuFITVJf0p5GFH3';

app.use(cors());
app.use(bodyParser.json());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("buyNow").collection("products");
  const orderCollection = client.db("buyNow").collection("orderedProducts");
  // perform actions on the collection object
  console.log("Connected Successfully")
  
  app.get('/products', (req, res) =>{
    collection.find({})
    .toArray((err, result) =>{
      
      res.send(result)
    });

   
  })

  app.post('/addProducts', (req, res) =>{
    const newProducts = req.body;
    console.log(newProducts)
    collection.insertOne(newProducts).then((result) => {
      res.send(result.insertedCount > 0);
    })
    
  })

  app.patch('/update/:id', (req, res) => {
    const user = req.body;
    collection.replaceOne({_id: ObjectId(req.params.id)},
    {
      user
    })


  });

  app.delete('/delete/:id', (req,res) =>{
    console.log(req.params.id);
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) =>{
        console.log(result)
        res.send(result.deletedCount > 0)
    })
  })

  app.post('/orderItem', (req, res) =>{
    const Item = req.body;
    console.log(Item)
    orderCollection.insertOne(Item).then((result) => {
      res.send(result.insertedCount > 0);
    })
    
  });

  app.get("/order", (req, res) => {
    // console.log(bearer);
      // console.log({idToken});
     
      orderCollection.find({email: req.query.email})
          .toArray((err, document) => {
              res.send(document)
          })
        
        // console.log(uid)
        // ...
      });
      
    

  
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)