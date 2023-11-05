const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@rahim.iilssri.mongodb.net/?retryWrites=true&w=majority`;

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

        const userCollection = client.db("RedChiliRestaurent").collection("users");
        const foodCollection = client.db("RedChiliRestaurent").collection("addFood");


        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // USER ADD
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        // ADD FOOD

        app.get('/addfood/:id', async(req, res) => {
            const id = req.params.id; 
            const query = {_id: new ObjectId(id)}
            const result = await foodCollection.findOne(query)
            res.send(result)
        })

        app.get('/addfood', async (req, res) => {
            let query = {};
            if(req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await foodCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/addfood', async (req, res) => {
            const food = req.body;
            const result = await foodCollection.insertOne(food)
            res.send(result)
        })

        app.put('/addFood/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const updatedFood = req.body;

            const options = {upsert: true}

            const food = {
                $set: {
                    name:updatedFood.name,
                    image:updatedFood.image,
                    category:updatedFood.category,
                    quantity:updatedFood.quantity,
                    price:updatedFood.price,
                    addedby:updatedFood.addedby,
                    country:updatedFood.country,
                    description:updatedFood.description,
                }
            }
            const result = await foodCollection.updateOne(filter, food, options)
            res.send(result)
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


app.get('/', (req, res) => {
    res.send('RedChili Running Now..')
})

app.listen(port, () => {
    console.log(`RedChili listenig on Port : ${port}`)
})