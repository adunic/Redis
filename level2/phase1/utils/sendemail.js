const sendemail = async(email) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Email sent to ${email}`);
            resolve();
        }, 2000);
    });
}

module.exports = sendemail;


// this is not a real email sending function, it's just a simulation of sending an email. In a real application, you would use a library like nodemailer to send emails.
// real logic of sending email can be implemented using nodemailer library.
