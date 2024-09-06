const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MONGO_URI, SECRET_KEY } = require("./config/keys");
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const LiveClass = require('./model/LiveClass');
const User = require('./model/UserModel');
const jwt = require('jsonwebtoken');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/", require("./routes/courseRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/enroll-course", require("./routes/enrollRoute"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/api", require("./routes/codeRoute"));
app.use('/api/metadata', require("./routes/metadataRoute"));
app.use("/api/blockly", require("./routes/BlocklyRoute"));
app.use('/api/api', require("./routes/BlocklyRoute"));
app.use("/api/api", require("./routes/paymentRoute"));
// app.use("/terms", require("./routes/termsRoute"));
app.use('/api/api', require("./routes/userActivityRoute"));
app.use('/api/room', require("./routes/roomRoute"));
app.use('/api/api/seo', require("./routes/seoRoute"));
app.use('/api', require("./routes/ReviewRoute"));
app.use('/api/schools', require("./routes/schoolRoute"));
app.use('/api/api', require("./routes/planRoute"));
app.use('/api/teacher', require("./routes/teacherRoute"));
app.use('/api/schoolRegistration', require("./routes/schoolRegistrationRoute"));
app.use('/api/bigbluebutton', require("./routes/BBRoute"));

app.get("/api/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

const generateToken = (room, role) => {
  const isModerator = role === "Teacher"; 
  return {
    context: {
      user: {
        moderator: isModerator,
        name: role,
      },
    },
    configOverwrite : {
      startWithAudioMuted: true,
      startWithVideoMuted: true,
      prejoinPageEnabled: false,
      disableModeratorIndicator: !isModerator,
      enableUserRolesBasedOnToken: isModerator,
    },
    interfaceConfigOverwrite: {
      APP_NAME: 'Advisions',
      DEFAULT_REMOTE_DISPLAY_NAME: 'ARD',
      BRAND_WATERMARK_LINK: '',
      SHOW_JITSI_WATERMARK: false,
      SHOW_BRAND_WATERMARK: false,
      SHOW_POWERED_BY: false,
      DEFAULT_LOGO_URL: 'https://seeklogo.com/images/A/atm-link-logo-5F955E13CB-seeklogo.com.png',
      DEFAULT_WELCOME_PAGE_LOGO_URL: 'https://seeklogo.com/images/A/atm-link-logo-5F955E13CB-seeklogo.com.png',
      TOOLBAR_BUTTONS: [
        'microphone', 'camera', 'chat', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'raisehand',
        'settings', 'videoquality', 'tileview', 'download', 'help'
      ],
    },
    aud: 'jitsi',
    iss: 'your-app-id',
    sub: 'meet.jit.si',
    room: room,

  };
};


// Schedule a live class
app.post('/api/live-classes', async (req, res) => {
  const { title, dateTime, teacherId, role } = req.body;

  // Generate a unique room name
  const room = `${title.replace(/\s+/g, '-')}-${Date.now()}`;

  // Generate the token for the teacher, passing the room and role
  const tokenPayload = generateToken(room, role);
  const teacherToken = encodeURIComponent(JSON.stringify(tokenPayload)); // Encode the token as a URI component

  // Log the generated token for debugging purposes
  console.log('Generated Token:', tokenPayload);

  // Create the Jitsi meeting link with the encoded token
  const jitsiLink = `https://meet.jit.si/${room}`;

  // Create a new LiveClass object with the provided details
  const liveClass = new LiveClass({
    title,
    dateTime,
    link: jitsiLink,
    role,
    teacherId,
  });

  try {
    // Save the live class details to the database
    await liveClass.save();

    // Respond with the created live class and the Jitsi meeting link
    res.status(201).json({ liveClass, teacherLink: jitsiLink });
  } catch (error) {
    // Handle any errors that occur during saving
    res.status(500).json({ error: error.message });
  }
});

// Get live classes for a student
app.get('/api/live-classes/student/:studentId', async (req, res) => {
  try {
    const liveClasses = await LiveClass.find({}).exec();
    res.json(liveClasses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/live-classes/teacher/:teacherId', async (req, res) => {
  const { teacherId } = req.params;
  try {
      const classes = await LiveClass.find({ teacherId });
      res.json(classes);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

app.delete('/api/live-classes/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await LiveClass.findByIdAndDelete(id);
      res.json({ success: true });
  } catch (error) {
      res.status(500).json({ error: 'Failed to delete class' });
  }
});

app.put('/api/live-classes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, dateTime } = req.body;
  try {
      const updatedClass = await LiveClass.findByIdAndUpdate(id, { title, dateTime }, { new: true });
      res.json(updatedClass);
  } catch (error) {
      res.status(500).json({ error: 'Failed to update class' });
  }
});



app.post('/api/run', async (req, res) => {
  const { userId, code, language } = req.body;
  const output = await monacoEdit(language, code);
  const codeRecord = new Blockly({ userId, generatedCode: code, output }); // Changed to Blockly model
  await codeRecord.save();
  res.send({ output });
});

const monacoEdit = async (language, code) => {
  try {
    // eslint-disable-next-line no-eval
    const result = eval(code);
    return result.toString();
  } catch (error) {
    return error.toString();
  }
};

// Deploy
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}



const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/auth/google-login', async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email } = ticket.getPayload();

    // Find or create user in your database
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ userName: name, email });
      await user.save();
    }

    // Generate JWT token
    const authToken = jwt.sign(
      { 
        _id: user._id, 
        name: user.userName, 
        email: user.email, 
        role: user.role 
      },
      SECRET_KEY,
      { expiresIn: '2d' }
    );

    // Send response with user info and token
    res.status(200).json({ userInfo: user, token: authToken });
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
});




// Database and server setup
const PORT = process.env.PORT || 5010;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.error(err);
    console.log("Error occurred");
  });

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));