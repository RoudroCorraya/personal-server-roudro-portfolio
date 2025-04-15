require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');



const app = express();
const port = process.env.PORT || 5000;
//midleware 
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
// }));

app.use(express.json());
app.use(cookieParser());

// app.use("http://localhost:5000/", require("./routes/userRoutes"));

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
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('authHeader from server veriyfy fiunctuiion', authHeader);

  if (!authHeader) {
    return res.status(401).send({ message: 'Unauthorized access, no token' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access, token invalid' });
    }

    req.user = decoded;
    next();
  });
};


// const verifyToken = (req, res, next) => {
//   console.log('req.cookie check', req.cookies);
//   const token = req?.cookies?.token;
//   console.log('ussers url hit got token',token);
//   if(!token){
//     return res.status(401).send({message: 'unauthorized access no token'})
//   }
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
//     if(err){
//       return res.status(403).send({message: 'forbiden access token not match'})
//     }
//     console.log('req.cookies check', req.cookie);

//     req.user = decoded;
//     next();
//   })
// }

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollection = client.db('UsersCollection').collection('user');
    const letsTalkCollection = client.db('userQuery').collection('letsTalkQuery');
    const addSeerviceCollection = client.db('addService').collection('services');
    const addProjectCollection = client.db('AllProjects').collection('Projects');
    const HomeContactCollection = client.db('HomeContact').collection('Contact');
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
    app.get('/users', verifyToken,  async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);

      const users = await cursor.toArray();
      
      res.send(users);
    })
    app.get('/dashboard/users',  async (req, res) => {
      
      const cookies = req.cookies.token;
      console.log('dashboard/users cookie', cookies);
    })





    //lets talk server start
    // app.post('/letstalk', async (req, res) => {
    //   const letsTalkQuery = req.body;
    //   console.log('letsTalkQuery', letsTalkQuery);
    //   const result = await letsTalkCollection.insertOne(letsTalkQuery);
    //   res.send(result);
    // })
    app.post('/letstalk', async (req, res) => {
      const letsTalkQuery = req.body;
    
      if (letsTalkQuery.preferredDate) {
        letsTalkQuery.preferredDate = new Date(letsTalkQuery.preferredDate);
      }
    
      console.log('letsTalkQuery', letsTalkQuery);
      const result = await letsTalkCollection.insertOne(letsTalkQuery);
      res.send(result);
    });
    
    app.get('/dashboard/letstalk', async (req, res) => {
      const query = {};
      const cursor = letsTalkCollection.find(query);
      const userQuery = await cursor.toArray();
      res.send(userQuery);
    })
    //lets talk server end


    //add service server start
    app.post('/dashboard/addservice', async (req, res) => {
      const addService = req.body;
      console.log('addService data post', addService);
      const result = await addSeerviceCollection.insertOne(addService);
      res.send(result);
    })
    app.get('/services',  async (req, res) => {
      const query = {};
      const cursor = addSeerviceCollection.find(query);
      const addedServices = await cursor.toArray();
      res.send(addedServices);
    })
    //add service server end



    //get single service start
    app.get('/servicedetails/:_id',  async (req, res) => {
      const _id = req.params._id;
      const query = { _id: new ObjectId(_id) };
      const getService = await addSeerviceCollection.findOne(query);
      res.send(getService);
    })
    //get single service end

    //add project start
    app.post('/dashboard/addproject', async (req, res) => {
      const addProject = req.body;
      console.log('addProject', addProject);
      const result = await addProjectCollection.insertOne(addProject);
      res.send(result);
    })
    app.get('/allprojects',   async (req, res) => {
      const query = {};
      const cursor = addProjectCollection.find(query);
      const addProject = await cursor.toArray();
      res.send(addProject);
    })
    app.get('/allprojects/:projecttype',  async (req, res) => {
      const projectType = req.params.projecttype;
      const query = { projectType };
      const getPrjects = await addProjectCollection.find(query).toArray();
      res.send(getPrjects);
    })
    //add project end

    //add blog start
    app.post('/dashboard/addblog', async (req, res) => {
      const blogs = req.body;
      console.log('blog added', blogs);
      const result = await addBlogCollection.insertOne(blogs);
      res.send(result);
    })
    app.get('/allblogs',  async (req, res) => {
      const query = {};
      const cursor = addBlogCollection.find(query);
      const allBlogs = await cursor.toArray();
      res.send(allBlogs);
    })
    app.get('/blogs/:_id',  async (req, res) => {
      const _id = req.params._id;
      const query = { _id: new ObjectId(_id) };
      const getBlog = await addBlogCollection.find(query).toArray();
      res.send(getBlog);
    })
    //add blog end

    //homeContact start
    app.post('/homecontact', async (req, res) => {
      const homeContact = req.body;
      console.log('home contact post', homeContact);
      const result = await HomeContactCollection.insertOne(homeContact);
      res.send(result);
    })
    app.get('/homecontact', async (req, res) => {
      const query = {};
      const cursor = HomeContactCollection.find(query);
      const contactInfo = await cursor.toArray();
      res.send(contactInfo);
    })
    //homeContact end

    // user make admin start
    app.patch('/user/admin/:_id', async (req, res) => {
      const _id = req.params._id;
      const filter = { _id: new ObjectId(_id) };
      const updateDoc = {
        $set: {
          role: 'admin'
        }
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })
    // app.get('/users/:email', async(req, res) =>{
    //   const email = req.params.email;
    //   console.log('server email cheak', email);
    //   const query = {email : email};
    //   const result = await userCollection.findOne(query);

    //   console.log('database check', result);
    //   res.send(result);
    // })
    app.get('/admin/users/:email',  async (req, res) => {
      const email = req.params.email;
      console.log('Fetching user with id:', email);

      const query = { "user.email": email };
      const result = await userCollection.findOne(query);

      res.send(result);

    });



    //user make admin end
    //call info funcution start

    app.put('/call/:id', async (req, res) => {
      const _id = req.params.id;
      const Callinfo = req.body;
      console.log('call info updated', _id, Callinfo);
      const filter = { _id: new ObjectId(_id) };
      const options = { upsert: true };
      const updateCallInfo = {
        $set: {
          callInfo: "done"
        }
      }
      const result = await letsTalkCollection.updateOne(filter, updateCallInfo, options);
      res.send(result);
    })


    //call info funcution end

    //jwt token start
    // app.post('/jwt', async (req, res) => {
    //   const user = req.body;
    //   const JWT_SECRET = process.env.JWT_SECRET;
    //   console.log("JWT_SECRET:", process.env.JWT_SECRET); 
    //   console.log("users req.body", user); 
    //   const token = jwt.sign(user, JWT_SECRET, { expiresIn: '6h' });

    //   res.cookie('token', token, {
    //       httpOnly: true,
    //       secure: false,
    //       sameSite: 'None'
          
          
    //     });
    //     console.log('cookei header sent', token);
    //     res.send({ success: true });
    // })
    //localstorege try jwt instead cookie start
    app.post('/jwt', async(req, res)=>{
      const user = req.body;
      const JWT_SECRET = process.env.JWT_SECRET;
      console.log('from jwt post url hit ', JWT_SECRET);
      const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '6h'});
      res.send({token});
    })
    //localstorege try jwt instead cookie end
    //jwt token end

    //jwt cookie remove start
    app.post('/logout', (req, res)=>{
      res.clearCookie('token', {httpOnly: true, secure: true})
      res.send({success: true});
    })
    //jwt cookie remove end

    //header user admin role start
    // app.get('/users/:email', async(req, res)=>{
    //   const email = req.params.email;

    //   const filter = { email};
    //   const result = await userCollection.findOne(filter);
    //   console.log('user admin role email,', result);
    //   res.send(result);

    // })
    // app.get('/users/:email', async (req, res) => {
    //   const email = req.params.email;
    //   console.log('Fetching user with email:', email); // Log to confirm which email is being used

    //   const filter = { email };
    //   const result = await userCollection.findOne(filter);
    //   console.log('User fetched from DB:', result);  // Log the result from MongoDB

    //   if (result) {
    //     res.send(result);  // Send the result to the frontend
    //   } else {
    //     res.status(404).send({ message: 'User not found' });  // Send a 404 if the user is not found
    //   }
    // });
    //header user admin role end

    //jwt token start
    // app.post('/jwt', async(req, res)=>{
    // const user = req.body;
    // const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn : '1h'});
    // res
    // .cookie('token', token, {
    //   httpOnly: true,
    //   secure: false

    // })
    // .send({success : true});
    // })
    //jwt token end

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
