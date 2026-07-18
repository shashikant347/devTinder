// validations/user.js

const signin = (req, res, next) => {
  try {
    const { firstname, lastname, password, emailId } = req.body;

    if (!firstname || !lastname) {
      throw new Error("Enter the name");
    }

    if (firstname.length < 4 || firstname.length > 20) {
      throw new Error("Enter name is not valid");
    }

    if (!emailId || !emailId.includes("@")) {
      throw new Error("Enter a valid email");
    }

    if (!password) {
      throw new Error("Enter your password");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    next();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};


const login= (req,res,next)=>{
    try{
 const {emailId,password} = req.body
    if (!emailId || !emailId.includes("@")) {
      throw new Error("Enter a valid email");
    }

     if (!password) {
      throw new Error("Enter your password");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    next()
    } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
   
}

module.exports = {
  signin,
  login
};