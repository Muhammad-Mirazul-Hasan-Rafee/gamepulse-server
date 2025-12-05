const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
app = express();
const port = process.env.port || 8000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.vhv77.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const gameCollection = client.db("gameDB").collection("game");

    // to store data at first post operation is needed = creating a review

    app.post("/game", async (req, res) => {
      const newGame = { ...req.body, userPhoto: req.body.userPhoto || "" , totalLikes: 0, likedBy: [] };
      console.log("New Game Review:", newGame);
      const result = await gameCollection.insertOne(newGame);
      res.send(result);
    });

    // Read the data  = get operation  = Get all reviews (or filter by uid)
    app.get("/game", async (req, res) => {
      const { uid } = req.query; // if query contains uid , only that specific user data will come
      let query = {};
      if (uid) {
        // filtering specific uid
        query.uid = uid;
      }
      const cursor = gameCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //GET: Single review by id
    app.get("/game/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gameCollection.findOne(query);
      res.send(result);
    });

    // Update
    app.put("/game/:id", async (req, res) => {
      const id = req.params.id;
      const updateInfo = req.body;

      try {
        const result = await gameCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateInfo } //
        );
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to update game review" });
      }
    });

    // delete ops
    app.delete("/game/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gameCollection.deleteOne(query);
      res.send(result);
    });

    // Like or unlike
    app.post("/game/:id/like", async (req, res) => {
      const id = req.params.id;
      const {uid} = req.body;

      if (!uid) {
        return res.status(400).send({ error: "missing UID!" });
      }



      const review = await gameCollection.findOne({ _id: new ObjectId(id) });
      if (!review) {
        return res.status(404).send({ error: "Review not found" });
      }



      let likedBy = review.likedBy || [];
      let totalLikes = review.totalLikes || 0;

      // if already liked ? ----> unlike
      if(likedBy.includes(uid)){
        likedBy = likedBy.filter((u)=> u !== uid);
        totalLikes = Math.max(0 , totalLikes - 1);
      }

      // if no like? ----> adding a like
      else{
        likedBy.push(uid);
        totalLikes += 1;
      }

      // updating DB
      const result = await gameCollection.updateOne(
        {_id: new ObjectId(id)},
        {
          $set: {likedBy , totalLikes,},
        }
      );

      res.send({message: "success" , result});







    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Chill-Gamer swever is running");
});

app.listen(port, () => {
  console.log(`Chill Gamer server is running on port ${port}`);
});
