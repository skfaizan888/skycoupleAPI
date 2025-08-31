require("dotenv").config({
  path: ".env",
});
const moment = require("moment");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const usermodel = require("./model/usermodel");
const signusermodel = require("./model/signusermodel");
const jwt = require("jsonwebtoken");
const adminsignmodel = require("./model/adimsignmodel");
const favoritemodel = require("./model/favoritemodel");
const ChatModel = require("./model/chatmodel");
const conversationmodel = require("./model/conversationmodel");
const messagemodel = require("./model/messagemode");

const app = express();
app.use(cors());
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

// app.post("/api/conversation", async (req, res) => {
//   try {
//     const { senderId, receiverId } = req.body;
//     const newConversation = new conversationmodel({
//       members: [senderId, receiverId],
//     });
//     await newConversation.save();
//     res.status(200).send("Conversation Create Sucessfully");
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.get("/api/conversation/:userid", async (req, res) => {
//   try {
//     const userid = req.params.userid;
//     const conversations = await conversationmodel.find({
//       members: { $in: [userid] },
//     });
//     const conversationListUserData = await Promise.all(
//       conversations.map(async (item) => {
//         const receiverId = item.members.find((member) => member !== userid);

//         let userdata = null;
//         if (receiverId) {
//           userdata = await signusermodel.findOne(
//             { signid: receiverId },
//             { fullname: 1, signid: 1 }
//           );
//         }

//         return {
//           conversationId: item.conversationId,
//           userdata: userdata
//             ? {
//                 fullname: userdata.fullname,
//                 receiverId: userdata.signid,
//               }
//             : {
//                 fullname: "Unknown User",
//                 receiverId,
//               },
//         };
//       })
//     );

//     res.status(200).json(conversationListUserData);
//   } catch (error) {
//     console.error("Error in /api/conversation/:userid =>", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/api/message", async (req, res) => {
//   try {
//     let { conversationId, senderId, receiverId, message } = req.body;

//     if (!senderId || !receiverId || !message) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     if (conversationId === "new") {
//       let conversation = await conversationmodel.findOne({
//         members: { $all: [senderId, receiverId] },
//       });

//       if (!conversation) {
//         conversation = new conversationmodel({
//           members: [senderId, receiverId],
//         });
//         await conversation.save();
//       }

//       conversationId = conversation._id.toString();
//     }

//     const newMessage = new messagemodel({
//       conversationId,
//       senderId,
//       receiverId,
//       message,
//     });

//     await newMessage.save();

//     res.status(201).json({
//       conversationId,
//       senderId,
//       receiverId,
//       message,
//       time: newMessage.time,
//     });
//   } catch (error) {
//     console.error("Error saving message:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/api/sendmessage", async (req, res) => {
//   try {
//     const { conversationId, senderId, receiverId, message } = req.body;

//     let conversation;

//     if (!conversationId || conversationId === "new") {
//       conversation = new conversationmodel({
//         members: [senderId, receiverId],
//       });
//       await conversation.save();
//     } else {
//       conversation = await conversationmodel.findOne({ conversationId });
//       if (!conversation) {
//         return res.status(404).json({ error: "Conversation not found" });
//       }
//     }

//     const newMessage = new messagemodel({
//       conversationId: conversation.conversationId,
//       senderId,
//       receiverId,
//       message,
//     });

//     await newMessage.save();

//     const time = moment(newMessage.createdAt).format("hh:mm A");

//     res.status(201).json({
//       _id: newMessage._id,
//       conversationId: conversation.conversationId,
//       senderId,
//       receiverId,
//       message,
//       time,
//     });
//   } catch (error) {
//     console.error("Error in /api/sendmessage =>", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/api/message/:conversationId", async (req, res) => {
//   try {
//     const checkMessages = async (conversationId) => {
//       const messages = await messagemodel.find({ conversationId });

//       const messageUserData = await Promise.all(
//         messages.map(async (item) => {
//           const userdata = await signusermodel.findOne(
//             { signid: item.senderId },
//             { fullname: 1, signid: 1, _id: 0 }
//           );
//           return {
//             userdata,
//             message: item.message,
//             conversationId: item.conversationId,
//             time: moment(item.createdAt).format("hh:mm A"),
//           };
//         })
//       );

//       return res.status(200).json(messageUserData);
//     };

//     const conversationId = req.params.conversationId;

//     if (conversationId === "new") {
//       const checkConversation = await conversationmodel.findOne({
//         members: { $all: [req.query.senderId, req.query.receiverId] },
//       });

//       if (checkConversation) {
//         return checkMessages(checkConversation._id);
//       } else {
//         return res.status(200).json([]);
//       }
//     } else {
//       return checkMessages(conversationId);
//     }
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

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
  const admin = await adminsignmodel.findOne(req.body);
  if (!admin) return res.status(401).json("Invalid user, please Register");

  const { adhaarno, mobile, password, confirmpassword, adminid } = admin;
  const token = jwt.sign(
    { adhaarno, mobile, password, confirmpassword },
    emptoken
  );

  res.json({ token, adminid });
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

app.post("/findoppositeusers", async (req, res) => {
  try {
    const { currentGender } = req.body;
    const result = await usermodel.find({
      isActive: true,
      gender: { $ne: currentGender },
    });
    res.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

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
