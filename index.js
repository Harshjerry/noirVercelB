const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userRouter = require('./routes/user');
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const cartRouter = require('./routes/cart');
const orderRouter = require("./routes/order");
const cors = require('cors');

const razorRouter = require("./routes/payment");


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("db connection successful"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", razorRouter);
app.use("/", (req, res) => {
  return res.status(200).json(
    {
      success: true,
      message: "Everything fine"
    }
  )
})

app.listen(process.env.PORT||5000, () => {
  console.log("backend is running");
});
