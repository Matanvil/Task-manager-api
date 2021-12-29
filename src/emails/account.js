const sgMail = require("@sendgrid/mail").setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "matan@matanv.co.il",
    subject: "Welcome to the App!",
    text: `Welcome to the app, ${name}. let me know how you are getting along with the app`,
  });
};

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "matan@matanv.co.il",
        subject: "Sad to see you go",
        text: `Hi ${name}. as you requested, we deleted your account from our services. 
        We are  so sad to see you go like that.
        is there anything we could have do better?`
    })
}
module.exports = { sendWelcomeEmail, sendGoodbyeEmail };
