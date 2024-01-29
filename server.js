const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const _ = require("lodash");
let loginusername;
let loginuseremail;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "pokedexgame01@gmail.com",
    pass: "wqpi wlnd cbwh hwox",
  },
});

mongoose.connect("mongodb://localhost:27017/userdata");
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  dataArray: Array,
});

const User = mongoose.model("User", userSchema);

app.use(bodyParser.json());

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

// files from the public folder
app.use(express.static(path.join(__dirname, "public")));

app.post("/submitUserData", async (req, res) => {
  const userData = req.body;
  userData.password = simpleHash(userData.password);
  // console.log("User Data:", userData);

  try {
    const existingUser = await User.findOne({
      $or: [{ username: userData.username }, { email: userData.email }],
    });

    if (existingUser) {
      res.status(400).json({ error: "Username or email already exists." });
    } else {
      const newUser = new User(userData);
      await newUser.save();
      loginusername = userData.username;
      loginuseremail = userData.email;
      res.json({ message: "User data received and saved successfully!" });
    }
  } catch (error) {
    // console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/submitloginUserData", async (req, res) => {
  const loginuserData = req.body;
  loginuserData.password = simpleHash(loginuserData.password);
  // console.log("User Data:", loginuserData);

  try {
    const existingUser = await User.findOne({
      $or: [
        { username: loginuserData.nameorEmail },
        { email: loginuserData.nameorEmail },
      ],
      password: loginuserData.password,
    });

    if (existingUser) {
      loginusername = existingUser.username;
      loginuseremail = existingUser.email;

      res.json({ message: "User found" });
    } else {
      res.status(400).json({ error: "usernot found" });
      // console.log("user not found");
    }
  } catch (error) {
    // console.log("error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
let matcheduseremail;

app.post("/searchUser", async (req, res) => {
  const searchUser = req.body;
  // console.log("Account to search:", searchUser);

  try {
    const userMatched = await User.findOne({
      $or: [
        { username: searchUser.searchnameorEmail },
        { email: searchUser.searchnameorEmail },
      ],
    });

    if (userMatched) {
      matcheduseremail = userMatched.email;

      // console.log("user matched", matcheduseremail);
      res.json({ message: "User found" });
    } else {
      res.status(400).json({ error: "usernot found" });
      // console.log("user not matched");
    }
  } catch (error) {
    // console.log("error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/showUsermail", (req, res) => {
  res.json({ matcheduseremail });
  // console.log("user found", matcheduseremail);
});

let dataArray = [];
app.post("/pushLikedpokemon", (req, res) => {
  const receivedObject = req.body;
  // console.log(receivedObject.id);
  const isObjectPresent = dataArray.some((obj) => obj.id === receivedObject.id);

  if (!isObjectPresent) {
    // Object is not present, push it to the array
    dataArray.push(receivedObject);
    // console.log("Object pushed to the array:", isObjectPresent);
  } else {
    // console.log("Object already exists in the array:", isObjectPresent);
  }

  // console.log("final array", dataArray);
  updateMongoDBCollection(res);

  //  res.status(200).send('Object pushed to the array successfully');
});

app.delete("/deletePokemon", (req, res) => {
  const objectIdToDelete = req.body.id;

  // Find the index of the object in the array
  const index = dataArray.findIndex((obj) => obj.id === objectIdToDelete);

  // If the object is found, remove it from the array
  if (index !== -1) {
    dataArray.splice(index, 1);
    updateMongoDBCollection(res);
    // res.status(200).send('Object deleted from the array successfully');
  } else {
    // res.status(404).send('Object not found in the array');
  }
  // console.log("after delete", dataArray);
});

function updateMongoDBCollection(response) {
  User.updateOne(
    { username: loginusername },
    { $set: { dataArray } },
    (err, result) => {
      if (err) {
        // console.error('Error updating MongoDB collection:', err);
        response.status(500).send("Error updating MongoDB collection");
      } else {
        // console.log('MongoDB collection updated successfully');
        response
          .status(200)
          .send("Object pushed to the array and MongoDB collection updated");
      }
    }
  );
}

app.get("/getlikedArray", async (req, res) => {
  const username = loginusername;
  try {
    const result = await User.findOne({ username: username });

    if (result) {
      const dataArray = result.dataArray;

      res.status(200).json(dataArray);
    } else {
      res.status(404).send("Document not found in MongoDB");
    }
  } catch (error) {
    // console.error('Error retrieving data from MongoDB:', error);
    res.status(500).send("Internal Server Error");
  }
});

function generateRecoveryCode(limit) {
  return _.random(100000, 999999).toString();
}

app.get("/getUsername", (req, res) => {
  res.json({ loginusername, loginuseremail });
  // console.log("user found", loginusername);
});

app.post("/send-email", async (req, res) => {
  const { to } = req.body;

  const email = to;
  const newtemppassword = generateRecoveryCode(6);

  let usernametoupdate;

  try {
    // Find the user by email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Update the password with the new hashed password
      existingUser.password = newtemppassword;
      usernametoupdate = existingUser.username;

      // Save the updated user data
      await existingUser.save();

      res.json({ message: "Password reset successful" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

  let subjectmodel = " is your Account Recovery Code";
  const textbefore = `Hi ${usernametoupdate}, \nEnter the following password reset code : `;
  const resetLink = "http://localhost:3001/updatenewpassword";
  const text = `${textbefore} \n${newtemppassword} \n\nOr Click the following link to reset your password:  \n${resetLink} \n\n\nThanks\nTeam Pokedex`;

  // console.log("passes email:", email);

  const subject = `${newtemppassword}${subjectmodel}`;

  // console.log(subject);

  const mailOptions = {
    from: {
      name: "Pokedex",
      address: "irshadtaboobacker@gmail.com",
    },
    to,
    subject,
    text,
  };

  const sendMail = async (transporter, mailOptions) => {
    try {
      await transporter.sendMail(mailOptions);
      // console.log("Email has been sent");
    } catch (error) {
      // console.log(error);
    }
  };

  sendMail(transporter, mailOptions);
});

app.post("/updateNewpassword", async (req, res) => {
  const userDetails = req.body;
  const password = userDetails.temporarycode;
  const newpassword = simpleHash(userDetails.password);
  const resetagainLink = "http://localhost:3001/resetpassword";
  let useremailaddress;
  //
  try {
    const existingUser = await User.findOne({ password });

    if (existingUser) {
      existingUser.password = newpassword;
      useremailaddress = existingUser.email;
      usernametoupdate = existingUser.username;

      // Save the updated user data
      await existingUser.save();

      const to = useremailaddress;
      const textbefore = `Hi ${usernametoupdate},`;
      const text = `${textbefore} \nThis is to let you know that your password has just been reset.\nIf that wasn't you, Reset Your Password with following link:\n${resetagainLink}\n\n\nThanks\nTeam Pokedex`;

      const subject = "Did you just Reset password?";

      // console.log(subject);
      // console.log(to);

      const mailOptions = {
        from: {
          name: "Pokedex",
          address: "irshadtaboobacker@gmail.com",
        },
        to,
        subject,
        text,
      };

      const sendMail = async (transporter, mailOptions) => {
        try {
          await transporter.sendMail(mailOptions);
          // console.log("Email has been sent");
        } catch (error) {
          // console.log(error);
        }
      };

      sendMail(transporter, mailOptions);

      res.json({ message: "Password reset successful" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use(express.static(path.join(__dirname, "public")));

// routes

app.get("/mypage", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/resetpassword", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "resetpassword.html"));
});

app.get("/updatenewpassword", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "updatepassword.html"));
});
// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
