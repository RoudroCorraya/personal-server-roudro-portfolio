const express = require('express');

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
//midleware 
app.use(cors());
app.use(express.json());


//username:"roudrocorraya307"
//password: "Za92dDD8Su4w2oQw"

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const letsTalkCollection = client.db('userQuery').collection('letsTalkQuery');
    const addSeerviceCollection = client.db('addService').collection('services');
    const addProjectCollection = client.db('AllProjects').collection('Projects');
    const addBlogCollection = client.db('AllBlogs').collection('Blogs');
    app.get('/', (req, res) => {
      res.send('userport is running');

    })
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log('newuser', user);
      const result = await userCollection.insertOne(user);
      res.send(result);

      
  })
  app.get('/users', async (req, res) => {
    const query = {};
    const cursor = userCollection.find(query);
    const users = await cursor.toArray();
    res.send(users);
  })
  app.get('/dashboard/users', async(req, res)=>{
    const query = {};
    const cursor = userCollection.find(query);
    const users = await cursor.toArray();
    res.send(users);
  })



  
    
    //lets talk server start
    app.post('/letstalk', async (req, res) => {
      const letsTalkQuery = req.body;
      console.log('letsTalkQuery', letsTalkQuery);
      const result = await letsTalkCollection.insertOne(letsTalkQuery);
      res.send(result);
    })
    app.get('/dashboard/letstalk', async(req, res) =>{
      const  query = {};
      const cursor = letsTalkCollection.find(query);
      const userQuery = await cursor.toArray();
      res.send(userQuery);
    })
    //lets talk server end


    //add service server start
    app.post('/dashboard/addservice', async(req, res)=>{
      const addService = req.body;
      console.log('addService data post', addService);
      const result = await addSeerviceCollection.insertOne(addService);
      res.send(result); 
    })
    app.get('/services', async(req, res)=>{
      const query = {};
      const cursor = addSeerviceCollection.find(query);
      const addedServices = await cursor.toArray();
      res.send(addedServices);
    })
    //add service server end



    //get single service start
    app.get('/servicedetails/:_id', async(req, res)=>{
      const _id = req.params._id;
      const query = {_id: new ObjectId(_id)};
      const getService = await addSeerviceCollection.findOne(query);
      res.send(getService);
    })
    //get single service end
    
    //add project start
    app.post('/dashboard/addproject', async(req, res)=>{
      const addProject = req.body;
      console.log('addProject', addProject);
      const result = await addProjectCollection.insertOne(addProject);
      res.send(result);
    })
    app.get('/allprojects', async(req, res)=>{
      const query = {};
      const cursor = addProjectCollection.find(query);
      const addProject = await cursor.toArray();
      res.send(addProject);
    })
    app.get('/allprojects/:projecttype', async(req, res)=>{
      const projectType = req.params.projecttype;
      const query = {projectType};
      const getPrjects = await addProjectCollection.find(query).toArray();
      res.send(getPrjects);
    })
    //add project end

    //add blog start
    app.post('/dashboard/addblog', async(req, res)=>{
      const blogs = req.body;
      console.log('blog added', blogs);
      const result = await addBlogCollection.insertOne(blogs);
      res.send(result);
    })
    app.get('/allblogs', async(req, res)=>{
      const query = {};
      const cursor = addBlogCollection.find(query);
      const allBlogs = await cursor.toArray();
      res.send(allBlogs);
    })
    app.get('/blogs/:_id', async(req, res)=>{
      const _id = req.params._id;
      const query = {_id: new ObjectId(_id)};
      const getBlog = await addBlogCollection.find(query).toArray();
      res.send(getBlog);
    })
    //add blog end

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`server is running on PORT: ${port}`)
})
