require("dotenv").config({
  path: ".env",
});
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const usermodel = require("./model/usermodel");
const signusermodel = require("./model/signusermodel");
const jwt = require("jsonwebtoken");
const adminsignmodel = require("./model/adimsignmodel");
const favoritemodel = require("./model/favoritemodel");

const app = express();
app.use(
  cors({
    origin: "https://skycoupleadmin.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
const PORT = 7070;
const emptoken = "user888";

// mongoose.connect("mongodb://127.0.0.1:27017/userdb").then(() => {
//   console.log("MongoDb connect successfull..");
// });

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDb connect successfull..");
});

app.get("/", (req, res) => {
  res.send("Welcome SkyCouple Application");
});

app.post("/getfavorites", async (req, res) => {
  try {
    const { signid } = req.body;
    const favorites = await favoritemodel.find({ signid });
    const ids = favorites.map((f) => f.favoriteUserId);
    const users = await usermodel.find({ userid: { $in: ids } });
    res.send(users);
  } catch (err) {
    res.status(500).send("Server error in /getfavorites");
  }
});

app.post("/removefavorite", async (req, res) => {
  const { signid, favoriteUserId } = req.body;

  try {
    await favoritemodel.deleteOne({ signid, favoriteUserId });
    res.send("Removed from favorites.");
  } catch (err) {
    res.status(500).send("Error removing favorite.");
  }
});

app.post("/adduser", (req, res) => {
  const result = new usermodel(req.body);
  result.save();
  res.send(
    `${req.body.fullname} ${req.body.mobile} Profile submitted successfully !!!`
  );
});

app.post("/addfavorite", async (req, res) => {
  try {
    const { signid, favoriteUserId } = req.body;
    const favorite = new favoritemodel({ signid, favoriteUserId });
    await favorite.save();
    return res.status(200).json({ message: "Favorite added successfully" });
  } catch (error) {
    console.error("Error in /addfavorite:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// SHOW USER
app.get("/alluser", async (req, res) => {
  const result = await usermodel.find({});
  res.send(result);
});

app.post("/signup", async (req, res) => {
  const { mobile, fullname, aadhaar, password, confirmpassword, adminid } =
    req.body;

  try {
    const existingUserByMobile = await signusermodel.findOne({ mobile });

    const existingUserByAdhaar = await signusermodel.findOne({ aadhaar });

    if (existingUserByMobile) {
      return res.status(400).send("Mobile number already exists.");
    }

    if (existingUserByAdhaar) {
      return res.status(400).send("Adhaar number already exists.");
    }

    const newUser = new signusermodel({
      mobile,
      aadhaar,
      password,
      confirmpassword,
      adminid,
      fullname,
    });

    await newUser.save();
    res.send(
      `${fullname} ${mobile} your account has been successfully created.`
    );
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send("Server error");
  }
});

app.post("/adminsignup", async (req, res) => {
  const { mobile, username, adhaarno, password, confirmpassword } = req.body;

  const existingUserByEmail = await adminsignmodel.findOne({ mobile });
  const existingUserByMobile = await adminsignmodel.findOne({ adhaarno });

  if (existingUserByEmail || existingUserByMobile) {
    return res.send("mobile number already exists.");
  }
  const newUser = new adminsignmodel({
    mobile,
    adhaarno,
    password,
    confirmpassword,
    username,
  });
  await newUser.save();
  res.send(`${username} Admin account has been successfully created.`);
});

app.post("/adminlogin", async (req, res) => {
  const result = await adminsignmodel.find(req.body);
  if (result.length > 0) {
    const { adhaarno, mobile, password, confirmpassword, adminid } = result[0];
    const payload = { adhaarno, mobile, password, confirmpassword };
    const token = jwt.sign(payload, emptoken);
    res.json({ token: token, adminid: adminid });
  } else {
    res.status(401).json("Invalid user, please Register");
  }
});

app.post("/login", async (req, res) => {
  const result = await signusermodel.find(req.body);
  if (result.length > 0) {
    const { adhaarno, mobile, password, confirmpassword, signid } = result[0];
    const payload = { adhaarno, mobile, password, confirmpassword };
    const token = jwt.sign(payload, emptoken);
    res.json({ token: token, signid: signid });
  } else {
    res.status(401).json("Invalid user, please Register");
  }
});

//FIND DATA

app.post("/findsign", async (req, res) => {
  const { signid } = req.body;
  const result = await signusermodel.find({ signid });
  res.json(result);
});

app.post("/findsignadmin", async (req, res) => {
  const { adminid } = req.body;
  const result = await adminsignmodel.find({ adminid });
  res.json(result);
});
app.post("/finduser", async (req, res) => {
  const { signid } = req.body;

  const result = await usermodel.findOne({ signid }).select("userid -_id");

  res.json(result);
});

app.post("/findsignadminid", async (req, res) => {
  const { adminid } = req.body;
  const result = await signusermodel.find({ adminid });
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is up port no ${PORT} `);
});
