const nodemailer = require("nodemailer");

const sendEMail = (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
<<<<<<< HEAD
  })
}
    sendEMail({
      to: "adityarubbers.AV@gmail.com",
      subject: "Someone has applied for your projec",
      text: "this is a test email",
    });
=======
  });
};
>>>>>>> fd628c8ae96df5e84c6077bbb6fe879853812730

module.exports = { sendEMail };
