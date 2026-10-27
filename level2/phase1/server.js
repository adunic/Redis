const express = require("express");


const dotenv = require("dotenv");
dotenv.config();

const Redis = require("ioredis");


const redis = new Redis(process.env.REDIS_URL);
module.exports = redis;

const connectDB = require("./db");
const userModel = require("./models/usermodel");

const app = express();
app.use(express.json());

connectDB();

app.get("/api/fetch", async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
}
);




// redis is only used to retrieve the data from the database and store it in the cache for future requests. It is not used to create or update data in the database.


// id data is not found while fetching from the cache, it will fetch the data from the database and store it in the cache for future requests. If the data is found in the cache, it will return the data from the cache without querying the database.

// if the data is found in the redis cache it is called a cache hit and if the data is not found in the redis cache it is called a cache miss. In case of a cache miss, the data is fetched from the database and stored in the redis cache for future requests.




app.get("/api/get-with-redis", async (req, res) => {
  try {

    const cached = await redis.get("users:all");
    if (cached) {
      console.log("Cache hit");
      return res.status(200).json(JSON.parse(cached));

    }
    const users = await userModel.find();
    await redis.set("users:all", JSON.stringify(users));

// redis store data in string format 
// so we need to pars it back to json while retrieving it from the cache.
// and while storing it in the cache we need to stringify it to string format.



    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }



});












app.post("/api/create", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await redis.del("users:all"); // Invalidate the cache when a new user is created
    const user = await userModel.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

app.post("/api/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${email}`, otp, "EX", 300); // OTP expires in 5 minutes

    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }


});

app.post("/api/verify-otp", async (req, res) => {

  try {
    const { email, otp } = req.body;
    const cachedOtp = await redis.get(`otp:${email}`);
    if (!cachedOtp) {
      return res.status(400).json({ message: "OTP expired or not found" });

    }
    if (cachedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if(cachedOtp === otp){
      res.status(200).json({ message: "OTP verified successfully" });
      await redis.del(`otp:${email}`); // Delete the OTP after successful verification
    }
  }
  catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
});







app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port " + (process.env.PORT || 3000));
}
);
