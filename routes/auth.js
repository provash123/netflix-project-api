const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken')

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      JSON.stringify(req.body.password),
      process.env.SECRET_KEY
    ).toString(),
    isAdmin : req.body.isAdmin
  });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    !user && res.status(401).json("Wrong Password or UserName");

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    
    const secretToken = jwt.sign(
        {id:user._id, isAdmin:user.isAdmin},
        process.env.SECRET_KEY,
        {expiresIn: "5d"}

    )
    


    originalPassword !== req.body.password &&
      res.status(403).json("Wrong Password or UserName");
    const { password, ...info } = user._doc;
   
    res.status(200).json({...info, secretToken});
  } catch {
    (err) => {
      res.status(500).json(err);
    };
  }
});
module.exports = router;

// password:CryptoJS.AES.encrypt(
//     req.body.password,
//     process.env.SECRET_KEY
// ).toString(),
