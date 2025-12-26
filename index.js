// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// require("dotenv").config();
// app = express();
// const port = process.env.PORT || 8000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vhv77.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     const gameCollection = client.db("gameDB").collection("game");

//     // to store data at first post operation is needed = creating a review

//     app.post("/game", async (req, res) => {
//       const body = req.body;
//       console.log(body);
//       const newGame = {
//         userName: body.userName,
//         userPhoto: body.userPhoto,
//         uid: body.uid,
//         gameTitle: body.gameTitle,
//         reviewDescription: body.reviewDescription,
//         rating: body.rating || "",
//         publishingYear: body.publishingYear || "",
//         thumbnail: body.thumbnail || "",
//         genres: body.genres || "",
//         totalLikes: 0,
//         likedBy: [],
//         createdAt: new Date(),
//       };
//       console.log("New Game Review:", newGame);
//       const result = await gameCollection.insertOne(newGame);
//       res.send(result);
//     });

//     // Read the data  = get operation  = Get all reviews (or filter by uid)
//     // Get all reviews or filter by uid
//     app.get("/game", async (req, res) => {
//       try {
//         const { uid } = req.query;

//         // Only filter if uid exists, otherwise return all documents
//         const query = uid ? { uid: uid } : {};

//         const result = await gameCollection
//           .find(query)
//           .sort({ createdAt: -1 })
//           .toArray();

//         res.send(result);
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ error: "Failed to fetch reviews" });
//       }
//     });

//     //GET: Single review by id
//     app.get("/game/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await gameCollection.findOne(query);
//       res.send(result);
//     });

//     // Update
//     app.put("/game/:id", async (req, res) => {
//       const id = req.params.id;
//       const updateInfo = req.body;

//       try {
//         const result = await gameCollection.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: updateInfo } //
//         );
//         res.send(result);
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ error: "Failed to update game review" });
//       }
//     });

//     // delete ops
//     app.delete("/game/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await gameCollection.deleteOne(query);
//       res.send(result);
//     });

//     // Like or unlike
//     app.post("/game/:id/like", async (req, res) => {
//       const id = req.params.id;
//       const { uid } = req.body;

//       if (!uid) {
//         return res.status(400).send({ error: "missing UID!" });
//       }

//       const review = await gameCollection.findOne({ _id: new ObjectId(id) });
//       if (!review) {
//         return res.status(404).send({ error: "Review not found" });
//       }

//       let likedBy = review.likedBy || [];
//       let totalLikes = review.totalLikes || 0;

//       // if already liked ? ----> unlike
//       if (likedBy.includes(uid)) {
//         likedBy = likedBy.filter((u) => u !== uid);
//         totalLikes = Math.max(0, totalLikes - 1);
//       }

//       // if no like? ----> adding a like
//       else {
//         likedBy.push(uid);
//         totalLikes += 1;
//       }

//       // updating DB
//       const result = await gameCollection.updateOne(
//         { _id: new ObjectId(id) },
//         {
//           $set: { likedBy, totalLikes },
//         }
//       );
//       //  Return full info needed for frontend
//       res.send({
//         success: true,
//         totalLikes, //Total likes updated
//         likedBy, // Updated likedBy array
//       });
//     });

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Chill-Gamer server is running");
// });

// app.listen(port, () => {
//   console.log(`Chill Gamer server is running on port ${port}`);
// });




const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000; // UPPERCASE PORT

// Middleware
app.use(cors());
app.use(express.json());

// Request logger middleware (debugging এর জন্য)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vhv77.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const gameCollection = client.db("gameDB").collection("game");

    // POST /game
    app.post("/game", async (req, res) => {
      try {
        const body = req.body;
        const newGame = {
          userName: body.userName,
          userPhoto: body.userPhoto,
          uid: body.uid,
          gameTitle: body.gameTitle,
          reviewDescription: body.reviewDescription,
          rating: body.rating || "",
          publishingYear: body.publishingYear || "",
          thumbnail: body.thumbnail || "",
          genres: body.genres || "",
          totalLikes: 0,
          likedBy: [],
          createdAt: new Date(),
        };
        const result = await gameCollection.insertOne(newGame);
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // GET /game
    app.get("/game", async (req, res) => {
      try {
        console.log("GET /game called with query:", req.query);
        const { uid } = req.query;
        const query = uid ? { uid: uid } : {};
        const result = await gameCollection
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();
        console.log(`Found ${result.length} games`);
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch reviews" });
      }
    });

    // GET /game/:id
    app.get("/game/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log(`GET /game/${id} called`);
        const query = { _id: new ObjectId(id) };
        const result = await gameCollection.findOne(query);
        if (!result) {
          return res.status(404).send({ error: "Game not found" });
        }
        res.send(result);
      } catch (error) {
        res.status(400).send({ error: "Invalid ID format" });
      }
    });

    // PUT /game/:id
    app.put("/game/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updateInfo = req.body;
        const result = await gameCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateInfo }
        );
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to update game review" });
      }
    });

    // DELETE /game/:id
    app.delete("/game/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await gameCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(400).send({ error: "Invalid ID format" });
      }
    });

    // POST /game/:id/like
    app.post("/game/:id/like", async (req, res) => {
      try {
        const id = req.params.id;
        const { uid } = req.body;

        if (!uid) {
          return res.status(400).send({ error: "missing UID!" });
        }

        const review = await gameCollection.findOne({ _id: new ObjectId(id) });
        if (!review) {
          return res.status(404).send({ error: "Review not found" });
        }

        let likedBy = review.likedBy || [];
        let totalLikes = review.totalLikes || 0;

        if (likedBy.includes(uid)) {
          likedBy = likedBy.filter((u) => u !== uid);
          totalLikes = Math.max(0, totalLikes - 1);
        } else {
          likedBy.push(uid);
          totalLikes += 1;
        }

        const result = await gameCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { likedBy, totalLikes } }
        );

        res.send({
          success: true,
          totalLikes,
          likedBy,
        });
      } catch (error) {
        res.status(400).send({ error: "Invalid request" });
      }
    });

    console.log("✅ All routes are set up");

  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Server তবুও চলবে, শুধু database operations fail হবে
  }
}

run().catch(err => {
  console.error("Failed to run server:", err);
});

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "Chill-Gamer server is running",
    endpoints: [
      "GET /game",
      "GET /game/:id", 
      "POST /game",
      "PUT /game/:id",
      "DELETE /game/:id",
      "POST /game/:id/like"
    ]
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    requested: req.originalUrl,
    available: ["/", "/game", "/game/:id"]
  });
});

// Render এর জন্য শুধু app.listen
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📡 URL: http://localhost:${port}`);
});