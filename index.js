const express=require('express')
const app=express()
const cors=require('cors')
const port=process.env.PORT||5000
require('dotenv').config()

app.use(cors())
app.use(express.json())

//connect mongoDB
console.log(process.env.DB_PASS);
console.log(process.env.DB_USER);
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnsxsk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
app.get('/teacher',async(req,res)=>{
        const result=await teacherCollection.find().toArray()
        res.send(result)
        
    })


const teacherCollection=client.db('studyHub').collection('teachers')
const assignmentCollection=client.db('studyHub').collection('assignments')
async function run() {
  try {

    app.get('/teacher',async(req,res)=>{
      const result=await teacherCollection.find().toArray()
      res.send(result)    
  })

   //post an assignment
  app.post('/assignment',async(req,res)=>{
    const assignment=req.body
    console.log(assignment);
    const result=await assignmentCollection.insertOne(assignment)
    res.send(result)
  })

  //get all assignment
  app.get('/allAssignment',async(req,res)=>{
    const result=await assignmentCollection.find().toArray()
    res.send(result)
  })

  //delete item with id
  app.delete('/allAssignment/:id',async(req,res)=>{
    const id=req.params.id
    const query={_id:new ObjectId(id)}
    const result=await assignmentCollection.deleteOne(query)
    res.send(result)
  })
  //get a single Item by id
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
   
  }
}
run().catch(console.dir);



app.get('/',async(req,res)=>{
    res.send('Study hub backend running')
})

app.listen(port)