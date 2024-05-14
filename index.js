const express=require('express')
const app=express()
const cors=require('cors')
const port=process.env.PORT||5000
const cookieParser=require('cookie-parser')
require('dotenv').config()
var jwt = require('jsonwebtoken');

const corsOption={
  origin:['http://localhost:5173'],
  credentials:true,
  optionSuccessStatus:200,
}
app.use(cors(corsOption))
app.use(express.json())
app.use(cookieParser())

//create meddleWare
const verifyToken=(req,res,next)=>{
  const token=req.cookies?.token
  // console.log(token);
  if(token){
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
      if(err){
        return res.status(401).send({message:'unAuthorized Access'})
      }
      // console.log(decoded)
      req.user=decoded
      next()

    })
  }
  if(!token){
    return res.status(401).send({message:'unAuthorized Access'})
  }
}
//connect mongoDB
// console.log(process.env.DB_PASS);
// console.log(process.env.DB_USER);
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { emit } = require('nodemon')
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
const submittedCollection=client.db('studyHub').collection('submitedData')
async function run() {
  try {
//create jwt to token
    app.post('/jwt',async(req,res)=>{
          const user=req.body
          // console.log(user);
          const token=jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'3d'})
          res.cookie('token',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:process.env.NODE_ENV==='production'?'none':'strict'})
          .send({success:true})
        })
//logout and delete the token
app.get('/logOut',async(req,res)=>{
  res.clearCookie('token',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:process.env.NODE_ENV==='production'?'none':'strict',
    maxAge:0
  })
  .send({success:true})
})
    app.get('/teacher',async(req,res)=>{
      const result=await teacherCollection.find().toArray()
      res.send(result)    
  })

   //post an assignment
  app.post('/assignment',async(req,res)=>{
    const assignment=req.body
    // console.log(assignment);
    const result=await assignmentCollection.insertOne(assignment)
    res.send(result)
  })

//read the data count
app.get('/assignmentCount',async(req,res)=>{
  const result=await assignmentCollection.estimatedDocumentCount()
  res.send({result})
})

  //get all assignment
  app.get('/allAssignment',async(req,res)=>{
    const size=parseInt(req.query.size)
    const page=parseInt(req.query.page)
    const filter=req.query.filter
    let query={}
    if(filter){
      query={category:filter}
      // console.log(query);
    }
    const result=await assignmentCollection.find(query)
    .skip(page*size)
    .limit(size)
    .toArray()
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
  app.get('/Assignment/:id',async(req,res)=>{
    const id=req.params.id
    const query={_id:new ObjectId(id)}
    const result=await assignmentCollection.findOne(query)
    res.send(result)
  })

  //update the assignment
  app.patch('/Assignment2/:id',async(req,res)=>{
    const assignment=req.body
    const id=req.params.id
    const query={_id:new ObjectId(id)}
    const options = { upsert: true };
    const updatedDoc={
      $set:{
        assign_title:assignment.assign_title,
        email:assignment.email,
        due_date:assignment.due_date,
        category:assignment.category,
        mark:assignment.mark,
        description:assignment.description,
        thumbnail_url:assignment.thumbnail_url
      }
    }
    const result=await assignmentCollection.updateOne(query,updatedDoc,options)
    res.send(result)
  })


  //create rest api for submit data
  app.post('/submits',async(req,res)=>{
    const data=req.body
    // console.log(data);
    const result=await submittedCollection.insertOne(data)
    res.send(result)
  })


  //get data by email
  app.get('/submitted/:email',verifyToken,async(req,res)=>{
    const tokenEmail=req.user.email
    const email=req.params.email
    // console.log(tokenEmail,email);
    if(tokenEmail!==email){
      return res.status(403).send({message:'forbidden access'})
    }
    // console.log(email);
    const query={email:email}
    const result=await submittedCollection.find(query).toArray()
    res.send(result)
  })


  //read all pending data
  app.get('/pending/:status',async(req,res)=>{
    const status=req.params.status
    // console.log(status);
    const query={status:status}
    const result=await submittedCollection.find(query).toArray()
    res.send(result)
  })
  //get pending data by id

  app.get('/mark/:id',async(req,res)=>{
    const id=req.params.id
    const query={_id:new ObjectId(id)}
    const result=await submittedCollection.findOne(query)
    res.send(result)
  })
  //update the pending assignment
  app.patch('/mark2/:id',async(req,res)=>{
    const TFeedBack=req.body
    const id=req.params.id
    const query={_id:new ObjectId(id)}
    const options = { upsert: true };
    const updatedDoc={
      $set:{
        obtain_mark:TFeedBack.obtain_mark,
        feedBack:TFeedBack.feedBack,
        status:TFeedBack.status
      }
    }
    const result=await submittedCollection.updateOne(query,updatedDoc,options)
    res.send(result)
  })


  //implement the jwt
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