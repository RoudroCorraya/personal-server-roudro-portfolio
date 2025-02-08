const express = require('express');

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
//midleware 
app.use(cors());
app.use(express.json());


//username:"roudrocorraya307"
//password: "Za92dDD8Su4w2oQw"

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://roudrocorraya307:Za92dDD8Su4w2oQw@cluster0.ggrhl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollection = client.db('UsersCollection').collection('user');
    app.get('/', (req, res)=>{
      res.send('userport is running');
  
  })
    app.post('/users', async(req, res)=>{
      const user = req.body;
      console.log('newuser', user);
      const result = await userCollection.insertOne(user);
      res.send(result);
      
  })
  app.get('/dashboard/users', async(req, res)=>{
    const query = {};
    const cursor = userCollection.find(query);
    const users = await cursor.toArray();
    res.send(users);
  })

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, ()=>{
    console.log(`server is running on PORT: ${port}`)
})
