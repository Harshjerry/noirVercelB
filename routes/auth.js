const router=require("express").Router();
const User=require("./../models/User");
const cryptoJS=require("crypto-js");
const jwt=require("jsonwebtoken");
//Register api

router.post("/register",async(req,res)=>{
const newUser=new User({
  username:req.body.username,
  email:req.body.email,
  password:cryptoJS.AES.encrypt(req.body.password,process.env.PASS_P).toString(),
  isAdmin:req.body.isAdmin
});
try{
  const savedUser=await newUser.save();
res.status(201).json(savedUser);
}catch(err){
  console.log(err);
}
});


//Login api

router.post("/login",async(req,res)=>{
  try{
const user=await User.findOne({username:req.body.username});

!user&&res.status(401).json("wrong Credentials");
const HashedPassword= cryptoJS.AES.decrypt(user.password,process.env.PASS_P);
const originalPassword=HashedPassword.toString(cryptoJS.enc.Utf8);
 originalPassword!==req.body.password &&res.status(401).json("wrong Credentials");

 
 const accessToken= jwt.sign({
id:user._id,
isAdmin:user.isAdmin,
},process.env.JWT_KEY,{expiresIn:"3d"});

const{password,...others}=user._doc;// _doc beacuse mongoDB save our credential in _odc and other info are also there so to not show that un necessary info we suse it
res.status(201).json({...others,accessToken});
}catch(err){
  console.log(err);
}
});








module.exports=router;
