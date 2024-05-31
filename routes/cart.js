const router=require("express").Router();
const Cart=require("./../models/Cart");
const {verifyToken,verifyTokenAndAuthentication,verifyTokenAndAdmin} =require("./verify");


router.post("/",verifyToken,async(req,res)=>{
const newCart=new Cart(req.body);
try{
  const savedCart=await newCart.save();
res.status(201).json(savedCart);
}catch(err){
  console.log(err);
  console.log("in pos");
}
});


router.put("/:id", verifyTokenAndAuthentication, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    console.log("in cart.js  put by id");
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAuthentication, async (req, res) => {
try{
  await Cart.findByIdAndDelete(req.params.id);
  res.status(200).json("cart deleted succesfully")
}catch(err){
  console.log(err);
}

}
);


router.get("/:userId",verifyTokenAndAuthentication, async (req, res) => {
try{
const cart =await Cart.findOne({userId:req.params.userId
});

  res.status(200).json(cart)
}catch(err){
  console.log(err);
  console.log("in product router get by id");
}

}
);


router.get("/",verifyTokenAndAdmin,async(req,res)=>{
  try{
const carts=await Cart.find();
res.status(201).json(carts)
  }catch(err){
    console.log(err);
    console.log("in get all cart.js");
  }
})


module.exports=router;
