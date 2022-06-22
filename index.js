import { ObjectId, MongoClient } from "mongodb";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;

const uri =
  "mongodb+srv://<user>:<password>@cluster0.2u9knzu.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
client
  .connect()
  .then(() => {
    console.log("connected!");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/blogs", async (req, res) => {
  const db = client.db("nfactorial");
  const collection = db.collection("nfactorial");

  const result = await collection.find({}).toArray();

  res.send(result);
});

app.post("/blogs", async (req, res) => {
  const { author, content, createdAt, title } = req.body;
  const db = client.db("nfactorial");
  const collection = db.collection("nfactorial");

  const response = await collection.insertOne({
    author,
    content,
    createdAt,
    title,
  });

  const result = {
    id: response.insertedId,
    author,
    content,
    createdAt,
    title,
  };

  res.send(result);
});

app.put("/blogs/:id", async (req, res) => {
  const { author, content, createdAt, title } = req.body;
  const { id } = req.params;

  const db = client.db("nfactorial");
  const collection = db.collection("nfactorial");

  await collection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        author,
        content,
        createdAt,
        title,
      },
    }
  );

  const result = {
    _id: id,
    author,
    content,
    createdAt,
    title,
  };

  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
