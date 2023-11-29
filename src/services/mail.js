const nodemailer = require("nodemailer");
const emailResetPassword = require("../templates/emailResetPassword");
const emailActiveAccount = require("../templates/emailActiveAccount");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "learners.hcmus@gmail.com",
    pass: "qwqj fzec chad bvdm",
  },
});

module.exports = {
  sendActiveAccount: async (user) => {
    const mailOptions = {
      from: "learners.hcmus@gmail.com",
      to: user.email,
      subject: "VERIFY EMAIL",
      html: emailActiveAccount(user),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
    });
  },

  sendResetPassword: async (user) => {
    const mailOptions = {
      from: "learners.hcmus@gmail.com",
      to: user.email,
      subject: "FORGOT PASSWORD",
      html: emailResetPassword(user),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
    });
  },
};
