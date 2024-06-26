const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

exports.sendMail = (to, token) => {
  const mailOptions = {
    from: `Chat App ${process.env.NODEMAILER_USER}`,
    to,
    subject: "Password Reset",
    text: `Reset your password by clicking on the following link: ${process.env.FRONTEND_LINK}/verify-token?token=${token}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
