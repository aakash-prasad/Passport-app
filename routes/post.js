const express = require('express');
const router = express.Router();
const User = require('../models/User');
const post = require('../models/post');
const jwt = require('jsonwebtoken');
const jwt_decode = require("jwt-decode");

//Authorization -->  bearer<token>


const checkToken = (req, res, next)=>{
    const header = req.headers['authorization'];
    if(typeof header== undefined) res.sendStatus(401);
    const bearer = header.split(' ');
    const token = bearer[1];
    req.token = token;
    //return res.json({message: "Successfull"})
    next();
}


router.post('/newposts', checkToken, async(req, res)=>{    
        jwt.verify(req.token, 'shhh', async (err, authData)=>{
        if(err) console.log(`Error in verification ${err}`)        
        console.log(`Connected to the protected route`);
        //Create Post
        const decoded = jwt_decode(req.token);
        const userId = decoded.userdbData._id;        
        const {text} = req.body;
        const newPost = new post({
            text: text,
            userId: userId
        });
        try{
        	const saving = await newPost.save();
        	 res.json({message:"A new Post created"})
        }catch(err){console.log(`Error in saving ${err}`)}            
    		      
    })
 })


router.put('/deleteposts', async (req, res)=>{
	const userObject = await User.findOne({email: req.body.email});
    posts.findByIdAndRemove(userObject.id, req.body,text, (err, posts)=>{
        if(err) return res.json({message: "error while deleting your post"});
        res.json(posts);
    })
 })


 router.delete('/updateposts', async(req, res)=>{
 	const userObject = await User.findOne({email: req.body.email});
    posts.findIdAndUpdate(userObject.id, (err,posts)=>{
        if(err) res.json({message: "There was an error while updating your post"});
        res.json(posts  )
    })
 })

 router.post('/getUserPost',checkToken, async(req,res)=>{
 	
 		const decodedToken = jwt_decode(req.token)
 		const userId = decodedToken.userdbData._id;
 		try{
 		const getPostObject= await post.findOne({userId:userId})
 		console.log(getPostObject)
 		const userPost = getPostObject.text;
 		res.json({Post: userPost})
 	}catch(err){console.log(`The error is ${err}`)}
 })

 router.post('/getAllUsers' ,async (req,res)=>{
 	const allUser = await User.find({})
 	res.json({allUser});
 })

 router.post('/getAllPosts', async(req,res)=>{
 	const allPost = await post.find({})
 	res.json({allPost});
 })

router.post('/userWithPosts', async (req,res)=>{
	let total = await User.find({}).count();
	const userData = await User.find({})
	let test = [];
	for(let j=0; j<total; j++){
		const userPostArray = [];
		const firstName= userData[j].firstName;
		const email = userData[j].email;
		const allPost = await post.find({userId:userData[j].id})
		for(let i =0; i<allPost.length; i++){
			userPostArray.push({text:allPost[i].text})
			
		}
		const userWithPost = {
		username : firstName,
		email: email,
		Post: userPostArray
		}
		test.push(userWithPost)
	}	
	res.json({test})
	//res.sendStatus(200);	
})
 

 module.exports = router;