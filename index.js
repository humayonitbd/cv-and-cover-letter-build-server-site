const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
const port = process.env.PORT || 5000;
require('dotenv').config();

//middle ware
app.use(cors())
app.use(express.json())


app.get('/', async(req, res)=>{
    res.send('server is runing...')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.epqkzkd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {

        const allResumeCollection = client.db('CV_ResumeBuild').collection('allResume');
        const allCVCollection = client.db('CV_ResumeBuild').collection('allCV');
        const usersCollection = client.db('CV_ResumeBuild').collection('users');
        const coverLetterCategoryCollection = client.db('CV_ResumeBuild').collection('coverLetterCategory');
        const cvCategoryCollection = client.db('CV_ResumeBuild').collection('cvCategory');

         
        
        //post resume
        app.post('/resume', async(req, res)=>{
            const body = req.body;
            const products = await allResumeCollection.insertOne(body);
            res.send(products);
        })

        //get email user resume
        app.get('/myCoverLetter', async(req, res)=>{
            const email = req.query.email;
            // console.log(email)
            const query = {userEmail: email};
            const mycoverLetter = await allResumeCollection.find(query).toArray();
            res.send(mycoverLetter);
        })
        
         //get id download user resume
        app.get('/download/:id', async(req, res)=>{
            const id = req.params.id;
            // console.log(id)
            const query = {_id: new ObjectId(id)}
            const downloadCoverLetter = await allResumeCollection.findOne(query);
            res.send(downloadCoverLetter);
        })
         
        //get id delete user resume
        app.delete('/myCoverLetter/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const deleteCoverLetter = await allResumeCollection.deleteOne(query);
            res.send(deleteCoverLetter)
        })
        

        app.get('/allCoverLetter', async(req, res)=>{
            const query = {};
            const allResume = await allResumeCollection.find(query).toArray();
            res.send(allResume)
        })



        //post cv
        app.post('/cv', async(req, res)=>{
            const body = req.body;
            const cv = await allCVCollection.insertOne(body);
            res.send(cv);
        })
        
        ///get cv 
        app.get('/allCV', async(req, res)=>{
            const query = {};
            const allCV = await allCVCollection.find(query).toArray();
            res.send(allCV)
        })

        //get email user CV
        app.get('/myCV', async(req, res)=>{
            const email = req.query.email;
            // console.log(email)
            const query = {userEmail: email};
            const myCV = await allCVCollection.find(query).toArray();
            res.send(myCV);
        })

        //get id delete user resume
        app.delete('/myCV/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const deleteCV = await allCVCollection.deleteOne(query);
            res.send(deleteCV);
        })

        //get id download user cv
        app.get('/cv/download/:id', async(req, res)=>{
            const id = req.params.id;
            // console.log(id)
            const query = {_id: new ObjectId(id)}
            const downloadCoverLetter = await allCVCollection.findOne(query);
            res.send(downloadCoverLetter);
        })




        //users post method
        app.post('/users', async(req, res)=>{
            const body = req.body;
            const allUsers = await usersCollection.insertOne(body);
            res.send(allUsers)
        })
        //users gert method
        app.get('/allUsers', async(req, res)=>{
            const query = {};
            const allUsers = await usersCollection.find(query).toArray();
            res.send(allUsers)
        })
        //users delete method
        app.delete('/users/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const allUsers = await usersCollection.deleteOne(query);
            res.send(allUsers)
        })
        

        //coverLetterCategory get 
        app.get('/coverLetterCategory', async(req, res)=>{
            const result = await coverLetterCategoryCollection.find({}).toArray();
            res.send(result);
        })

        //coverLetterCategory get id 
        app.get('/coverLetterCategory/:id', async(req, res)=>{
            const id = req.params.id;
            console.log(id)
            const query = {_id: new ObjectId(id)}
            const result = await coverLetterCategoryCollection.findOne(query);
            res.send(result);
        })


        //cvCategory get 
        app.get('/cvCategory', async(req, res)=>{
            const result = await cvCategoryCollection.find({}).toArray();
            res.send(result);
        })

        //cvCategory get id 
        app.get('/cvCategory/:id', async(req, res)=>{
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await cvCategoryCollection.findOne(query);
            res.send(result);
        })
        

       ///admin role implement
       app.get('/admin/role', async(req, res)=>{
        const email = req.query.email;
        const filter = {email: email};
        const user = await usersCollection.findOne(filter);
        if(user){
           return res.send({admin: user.role});
        }
        return res.send();
       })
        
        
    } catch (error) {
        console.log(error.message)
    }
}
run().catch(console.log)



app.listen(port, () => {
    console.log(`server is running ${port}`)
  })