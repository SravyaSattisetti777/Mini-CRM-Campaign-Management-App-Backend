const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require('body-parser')
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();

const connectDB = require("./config/db");
const passportSetup = require('./middleware/passport');

const dashboardRoutes = require('./routes/dashboardRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const audienceRoutes = require('./routes/audienceRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(bodyParser.json()); 

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, sameSite: "lax" },
})
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);


app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Server is connected");
});

app.use(authRoutes);

app.use('/api', customerRoutes);
app.use('/api', orderRoutes);
app.use('/api', audienceRoutes);
app.use('/api', campaignRoutes);
app.use('/api', communicationRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
});
