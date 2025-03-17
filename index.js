const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("Sports Equipment Store Running");
});

// MongoDB URI
const uri =
  "mongodb+srv://admin:bHxUKg9oYXFQDf8D@cluster0.dblis.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB Client Setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Main Function to Run the Server
async function run() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected Successfully!");

    // Database Collections
    const database = client
      .db("Sports-Equipment-Store")
      .collection("Sport-Data");
    const my_Equipment = client
      .db("Sports-Equipment-Store")
      .collection("my_Equipment_List");

    // ---------- Sports Equipment APIs ----------

    // POST API: নতুন স্পোর্টস ডাটা যোগ করা
    app.post("/datastor", async (req, res) => {
      const data = req.body;
      const result = await database.insertOne(data);
      res.send(result);
    });

    // GET API: সব স্পোর্টস ডাটা পড়া
    app.get("/all-data", async (req, res) => {
      const result = await database.find().toArray();
      res.send(result);
    });

    // GET API: নির্দিষ্ট প্রোডাক্টের তথ্য
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const product = await database.findOne({ _id: new ObjectId(id) });
      res.send(product);
    });

    // ---------- My Equipment List APIs ----------

    // POST API: নতুন ইকুইপমেন্ট যোগ করা
    app.post("/myequipment", async (req, res) => {
      const data = req.body;
      const result = await my_Equipment.insertOne(data);
      res.send(result);
    });

    // GET API: My Equipment List থেকে সব ডাটা পড়া
    app.get("/myequipment", async (req, res) => {
      const result = await database.find().toArray();
      res.send(result);
    });

    // DELETE API: নির্দিষ্ট একটি ইকুইপমেন্ট ডিলিট করা
    app.delete("/myequipment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await my_Equipment.deleteOne(query);
      res.send(result);
    });


    // Product Update 
    app.put("/UpdateProduct/:id", async (req, res) => {
      const id = req.params.id; // URL থেকে প্রোডাক্টের ID পাওয়া
      const updatedData = req.body; // Client থেকে আসা নতুন ডাটা
      console.log(updatedData);
      const filter = { _id:new ObjectId(id) }; // ID অনুযায়ী ফিল্টার তৈরি করা
      const updateDoc = {
        $set: updatedData, // নতুন ডাটা সেট করা
      };

      const result = await database.updateOne(filter, updateDoc);
      res.send(result);
    });



    
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}

run().catch(console.dir);

// সার্ভার চালু করা
app.listen(port, () => {
  console.log(`🚀 Server is Running on port ${port}`);
});
