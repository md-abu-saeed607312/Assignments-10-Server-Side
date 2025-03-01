const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion,ObjectId } = require("mongodb"); //copy to website

// MiddleWare
app.use(cors());
app.use(express.json()); //Body তে Json Data পাঠাতে

app.get("/", (req, res) => {
  res.send("Sports Equipment Store Running");
});

// bHxUKg9oYXFQDf8D
// admin

const uri =
  "mongodb+srv://admin:bHxUKg9oYXFQDf8D@cluster0.dblis.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  // Connect the client to the server	(optional starting in v4.7)
  await client.connect();
  console.log("MongoDB Connected Successfully!");

  const database = client.db("Sports-Equipment-Store").collection("Sport-Data");

  // POST API Data Add
  app.post("/datastor", async (req, res) => {
    const data = req.body;
    const result = await database.insertOne(data);
    res.send(result);
  });

  // Data Read
  app.get("/all-data", async (req, res) => {
    const result = await database.find().toArray();
    res.send(result);
  });

  app.get("/product/:id", async (req, res) => {
    const id = req.params.id;
    const product = await  database.findOne({ _id: new ObjectId(id) });
    res.send(product)
  });
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is Running:${port}`);
});

