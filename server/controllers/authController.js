const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");
const controllerError = require("../utils/controllerError");
const { SECRET_KEY } = require("../config/keys");

// Register Controller
module.exports.register__controller = async (req, res, next) => {
  try {
    const { userName, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        errors: { confirmPassword: "Passwords do not match" }
      });
    }

    const userInfo = await UserModel.findOne({ email });

    if (userInfo) {
      return res.status(401).json({
        errors: { email: "User already exists" }
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new UserModel({
      userName,
      email,
      password: hash,
      role
    });

    user.save()
      .then((userData) => {
        res.status(201).json({
          userData
        });
      })
      .catch((err) => {
        controllerError(err, res, "Error occurred");
      });
  } catch (error) {
    controllerError(error, res, "Error occurred");
  }
};

// Login Controller
module.exports.login__controller = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userInfo = await UserModel.findOne({ email });

    if (!userInfo) {
      return res.status(401).json({
        errors: { email: "User does not exist. Please register and then login again." }
      });
    }

    bcrypt.compare(password, userInfo.password)
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            errors: { password: "Password does not match" }
          });
        }

        const token = jwt.sign(
          { _id: userInfo._id, name: userInfo.userName, email: userInfo.email, role: userInfo.role },
          SECRET_KEY,
          { expiresIn: '2d' }
        );

        res.status(200).json({
          token,
          userInfo
        });
      })
      .catch((err) => {
        controllerError(err, res, "Error occurred");
      });
  } catch (error) {
    controllerError(error, res, "Error occurred");
  }
};

// User Details Controller
module.exports.details__controller = async (req, res, next) => {
  try {
    const {
      userName,
      email,
      password,
      confirmPassword,
      role,
      profilePic,
      address,
      description,
      links,
      identityVerifications,
      phoneNumber
    } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        errors: { confirmPassword: "Passwords do not match" }
      });
    }

    // Check if the user already exists
    const userInfo = await UserModel.findOne({ email });

    if (userInfo) {
      return res.status(401).json({
        errors: { email: "User already exists" }
      });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new UserModel({
      userName,
      email,
      password: hash,
      role,
      profilePic,
      address,
      description,
      links,
      identityVerifications,
      phoneNumber
    });

    // Save the user to the database
    user.save()
      .then((userData) => {
        res.status(201).json({
          userData
        });
      })
      .catch((err) => {
        controllerError(err, res, "Error occurred while saving user");
      });
  } catch (error) {
    controllerError(error, res, "Error occurred while processing request");
  }
};

const User = require('../model/UserModel');

exports.resetPassword = async (req, res) => {
  const { password, email } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(400).send('Invalid or expired token');
    }

    user.password = hash;

    await user.save();

    res.status(200).send('Password has been reset');
  } catch (err) {
    res.status(500).send('Error resetting password');
  }
};

exports.signinController = async(req, res) => {
  if(req.body.googleAccessToken){
      // gogole-auth
      const {googleAccessToken} = req.body;

      axios
          .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
              "Authorization": `Bearer ${googleAccessToken}`
          }
      })
          .then(async response => {
              const firstName = response.data.given_name;
              const lastName = response.data.family_name;
              const email = response.data.email;
              const picture = response.data.picture;

              const existingUser = await User.findOne({email})

              if (!existingUser) 
              return res.status(404).json({message: "User don't exist!"})

              const token = jwt.sign({
                  email: existingUser.email,
                  id: existingUser._id
              }, config.get("JWT_SECRET"), {expiresIn: "1h"})
      
              res
                  .status(200)
                  .json({result: existingUser, token})
                  
          })
          .catch(err => {
              res
                  .status(400)
                  .json({message: "Invalid access token!"})
          })
  }else{
      // normal-auth
      const {email, password} = req.body;
      if (email === "" || password === "") 
          return res.status(400).json({message: "Invalid field!"});
      try {
          const existingUser = await User.findOne({email})
  
          if (!existingUser) 
              return res.status(404).json({message: "User don't exist!"})
  
          const isPasswordOk = await bcrypt.compare(password, existingUser.password);
  
          if (!isPasswordOk) 
              return res.status(400).json({message: "Invalid credintials!"})
  
          const token = jwt.sign({
              email: existingUser.email,
              id: existingUser._id
          }, config.get("JWT_SECRET"), {expiresIn: "1h"})
  
          res
              .status(200)
              .json({result: existingUser, token})
      } catch (err) {
          res
              .status(500)
              .json({message: "Something went wrong!"})
      }
  }

}

exports.signupController = async(req, res) => {
  if (req.body.googleAccessToken) {
      const {googleAccessToken} = req.body;

      axios
          .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
              "Authorization": `Bearer ${googleAccessToken}`
          }
      })
          .then(async response => {
              const firstName = response.data.given_name;
              const lastName = response.data.family_name;
              const email = response.data.email;
              const picture = response.data.picture;

              const existingUser = await User.findOne({email})

              if (existingUser) 
                  return res.status(400).json({message: "User already exist!"})

              const result = await User.create({verified:"true",email, firstName, lastName, profilePicture: picture})

              const token = jwt.sign({
                  email: result.email,
                  id: result._id
              }, config.get("JWT_SECRET"), {expiresIn: "1h"})

              res
                  .status(200)
                  .json({result, token})
          })
          .catch(err => {
              res
                  .status(400)
                  .json({message: "Invalid access token!"})
          })

  } else {
      // normal form signup
      const {email, password, confirmPassword, firstName, lastName} = req.body;

      try {
          if (email === "" || password === "" || firstName === "" || lastName === "" && password === confirmPassword && password.length >= 4) 
              return res.status(400).json({message: "Invalid field!"})

          const existingUser = await User.findOne({email})

          if (existingUser) 
              return res.status(400).json({message: "User already exist!"})

          const hashedPassword = await bcrypt.hash(password, 12)

          const result = await User.create({email, password: hashedPassword, firstName, lastName})

          const token = jwt.sign({
              email: result.email,
              id: result._id
          }, config.get("JWT_SECRET"), {expiresIn: "1h"})

          res
              .status(200)
              .json({result, token})
      } catch (err) {
          res
              .status(500)
              .json({message: "Something went wrong!"})
      }

  }
}


