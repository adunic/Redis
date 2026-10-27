const { Queue } = require("bullmq");
const Redis = require("ioredis");
const connection = new Redis(process.env.REDIS_URL,{ 
    maxRetriesPerRequest: null,
});



const emailQueue = new Queue("emailQueue", {connection});


module.exports = emailQueue;