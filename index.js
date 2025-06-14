const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l84br15.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
    tls: true,
    tlsAllowInvalidCertificates: true
});


async function run() {
    try {
        await client.connect();

        const ProjectsCollection = client.db("ProjectsDB").collection("Projects")  //databasename change as needed

        //curd operation start
        // CREATE/post
        app.post('/projects', async (req, res) => {
            const result = await ProjectsCollection.insertOne(req.body);
            res.send(result);
        });
        // READ/get
        app.get('/projects', async (req, res) => {
            const projects = await ProjectsCollection.find().toArray();
            res.send(projects);
        });
        // DELETE
        app.delete('/projects/:id', async (req, res) => {
            const { id } = req.params;
            const projects = await ProjectsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(projects);
        });



        //curd operation end

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});