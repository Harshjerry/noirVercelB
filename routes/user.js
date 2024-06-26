const router=require("express").Router();
const {verifyToken,verifyTokenAndAuthentication,verifyTokenAndAdmin} =require("./verify");
const User=require("./../models/User");
const cryptoJS=require("crypto-js");

router.put("/:id", verifyTokenAndAuthentication, async (req, res) => {
  if (req.body.password) {
    req.body.password = cryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_P
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("in user.js  put by id");
    console.log(err);
    res.status(500).json(err);
  }
});



router.delete("/:id", verifyTokenAndAuthentication, async (req, res) => {

try{
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json("user deleted succesfully")
}catch(err){
  console.log(err);
}

}
);

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/:id", verifyTokenAndAdmin, async (req, res) => {

try{
const user =await User.findById(req.params.id);
const{password,...others}=user._doc;
  res.status(200).json(others)
}catch(err){
  console.log(err);
  console.log("in router get by id");
}

}
);


router.get("/", verifyTokenAndAdmin, async (req, res) => {
const query=req.query.new;
try{
const users = query?await User.find().sort({_id:-1}).limit(5):await User.find();
  res.status(200).json(users)
}catch(err){
  console.log(err);
  console.log("in router get all");
}
}
);


module.exports=router;
