const redis = require("../redis");




const ratelimiter = async (req, res, next) => {
    const ip = req.ip;
    const key = `ratelimit:${ip}`;
    const reqcount = await redis.incr(key);
    if (reqcount === 1) {
        await redis.expire(key, 60); // Set expiration time of 60 seconds for the key
    }
    if(reqcount > 5){
        return res.status(429).json({ message: "Too many requests, please try again later." });
    }
    next();
} 

module.exports = ratelimiter;
