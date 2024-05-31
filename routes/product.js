const router=require("express").Router();
const Product=require("./../models/Product");
const {verifyToken,verifyTokenAndAuthentication,verifyTokenAndAdmin} =require("./verify");


router.post("/",verifyTokenAndAdmin,async(req,res)=>{
const newProduct=new Product(req.body);
try{
  const savedProduct=await newProduct.save();
res.status(201).json(savedProduct);
}catch(err){
  console.log(err);
  console.log("error is posting product");
}
});


router.put("/:id", verifyTokenAndAuthentication, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log("in product.js  put by id");
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
try{
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json("Product deleted succesfully")
}catch(err){
  console.log(err);
}

}
);


router.get("/:id", async (req, res) => {

try{
const product =await Product.findById(req.params.id);
const{password,...others}=product._doc;
  res.status(200).json(others)
}catch(err){
  console.log(err);
  console.log("in product router get by id");
}

}
);


router.get("/", async (req, res) => {
const queryProd=req.query.new;
const queryCat=req.query.category;
try{

let products;
if(queryProd){products=  await Product.find().sort({createdAt:-1}).limit(2)
}else if(queryCat){
  products=await Product.find({categories:{$in:[queryCat]}})
}else{
  products=await Product.find();
}

  res.status(200).json(products)
}catch(err){
  console.log(err);
  console.log("in product router get all");
}
}
);


module.exports=router;
