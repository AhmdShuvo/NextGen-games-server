const { MongoClient, Admin } = require("mongodb");
const Objectid=require('mongodb').ObjectId;
const express=require('express');
const cors=require('cors');
require("dotenv").config();


const app=(express())





const port =process.env.PORT || 9000;


app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0qtlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      console.log("Connected");
      const database = client.db('GameShop');
      const servicesCollection = database.collection('Games');
      const purchaseCollection = database.collection('purchases');
      const UsersCollection = database.collection('users');
      const ratingsCollection = database.collection('ratngs');


          

      //  Store Purchase Data ///
      app.post('/orders',async(req,res)=>{
           const order=req.body;

           const result=await purchaseCollection.insertOne(order);
res.send(result)
      });
       // get all Orders //

       app.get("/orders",async (req,res)=>{

        const cursor= purchaseCollection.find({});
        const result =await cursor.toArray()
        res.json(result)
      })



       
                    // Store Users ///


       app.post('/users',async (req,res)=>{
      
        const user=req.body;

        const result=await UsersCollection.insertOne(user);

        res.send(result)
       
       });

      //  Get Admins ///

    

 

      

      //  update Admin ROle ///

      app.put('/users',async(req,res)=>{

        const user=req.body;
        console.log(user);
        
        const filter={email:user.email}
       

        

        const updateDoc = {
          $set: {
            role: "admin"
          },
        };

        const result=await UsersCollection.updateOne(filter,updateDoc);

      res.json(result)
       
      })

      //  Update For Google USers///
      app.post('/users',async(req,res)=>{

        const user=req.body;

        const filter = { email:user.email};
       
        const options = { upsert: true };
        const updateDoc = {$set:user};
      const result= await  UsersCollection.updateOne(filter,updateDoc,options);

       res.json(result)
      })


                
                  // get Ratings ///

                  app.get('/reviews',async(req,res)=>{

                    const cursor=ratingsCollection.find({});

                    const result=await cursor.toArray()
                    res.json(result);
                    
                  })



      // GEt All games ///
                
         app.get('/games',async(req,res)=>{
            const cursor=servicesCollection.find({});

            const result=await cursor.toArray()

        res.json(result)
      })


    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);


 
  app.get('/',async(req,res)=>{
           
   res.send("server Running")
         

  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })