const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middlewere 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.m5oq2pz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const mlin_collection = client.db("mlin").collection("posts");



    // POST /post — Create a new post
    app.post("/post", async (req, res) => {
      const newPost = req.body;
      const result = await mlin_collection.insertOne(newPost);
      res.send(result);
    })



    // GET /posts?userEmail=xxx — Get posts by userEmail
    app.get('/posts', async (req, res) => {
      const userEmail = req.query.userEmail;
      if (!userEmail) {
        return res.status(400).json({ message: 'userEmail query parameter is required' });
      }
      const userPosts = await mlin_collection.find({ userEmail }).sort({ time: -1 }).toArray();
      res.json(userPosts);
    });

    app.get("/all-posts", async (req, res) => {
      const result = await mlin_collection.find().toArray();
      res.send(result);
    })








    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Simple CRUD server running')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
