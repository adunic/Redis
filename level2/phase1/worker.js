const { Queue, Worker } = require("bullmq");
require("dotenv").config();
const sendemail = require("./utils/sendemail.js");
const emailQueue = require("./queue.js");

const Redis = require("ioredis");
const connection = new Redis(process.env.REDIS_URL,{ 
    maxRetriesPerRequest: null,
});



const worker = new Worker("emailQueue", async (job) => {
    const  email  = job.data;
    console.log(`Sending email to ${email}`);
    await sendemail(email);
    // sendemail is a function that sends an email to the user. You can implement this function using nodemailer or any other email sending library.

},{connection});