const User = require("../model/user");
const bcrypt = require("bcrypt");

const signin = async (req, res) => {
  try {
    const { firstname, lastname, emailId, password } = req.body;
    const email = await User.findOne({ emailId });
    if (email) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      firstname,
      lastname,
      password: hashPassword,
      emailId,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        emailId: user.emailId,
      },
    });
  } catch (err) {
    return res.status(500).json({
      succes: false,
      message: err,
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const existUser = await User.findOne({ emailId });
    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const p =  await bcrypt.compare(password,existUser.password)

    if(!p){
      return res.status(401).json({success:false,message:"Invalid credentials"})
    }

    return res.status(200).json({success:true,message:"login succesfully",data:{
          id: existUser._id,
        firstname: existUser.firstname,
        lastname: existUser.lastname,
        emailId: existUser.emailId,
    }})



  } catch (error) {
    return res.status(500).json({success:false,message:"internal server error",error

    })
  }
};

module.exports = {
  signin,
  login
};
