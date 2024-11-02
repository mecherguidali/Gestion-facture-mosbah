const axios = require('axios');
const nodemailer = require('nodemailer');  // For sending emails

module.exports = {
  Add: async (req, res) => {
    const url = "https://developers.flouci.com/api/generate_payment";
    const invoiceId = req.body.invoiceId;
    const paymentMethod = "flouci";
    const createdBy = req.body.createdBy;
    const amount = req.body.amount;
    const payload = {
      "app_token": "ae056881-78c8-415a-8f99-5add54a2ed92",  // Replace with your app public token
      "app_secret": process.env.FLOUCI_SECRET,  // Use secret from env variables
      "amount": req.body.amount,
      "accept_card": "true",
      "session_timeout_secs": 1200,
      "success_link": `http://localhost:3000/success?invoiceId=${invoiceId}&amount=${amount/1000}&paymentMethod=${paymentMethod}&createdBy=${createdBy}`,  // Define your success link
      "fail_link": "http://localhost:3000/fail",  // Define your fail link
      "developer_tracking_id": "0fba302c-a400-4bdb-8593-77f28174e375"
    };

    try {
      const result = await axios.post(url, payload);
      
      if (result.data.result.success) {
        const paymentUrl = result.data.result.link;  // Extract the payment link

        // Set up the email transporter
        let transporter = nodemailer.createTransport({
          host: process.env.HOST_MAILER,
          port: process.env.PORT_MAILER,
          secure: process.env.SECURE_MAILER === 'true', // Use environment variable to control secure flag
          auth: {
              user: process.env.USER_MAILER,
              pass: process.env.PASS_MAILER,
          },
          tls: {
              rejectUnauthorized: false, // Allow unauthorized certs (optional, should be used cautiously)
          },
        });

        // Set up email data
        let mailOptions = {
          from: process.env.USER_MAILER,
          to: "mecherguidali94@gmail.com",  // Email of the client, make sure to pass this in the request body
          subject: 'Complete Your Payment',
          text: `Hello, \nPlease complete your payment using the following link: ${paymentUrl}.\nThe total amount is: ${req.body.amount}.`,
          html: `<p>Hello,</p><p>Please complete your payment using the following link: <a href="${paymentUrl}">Complete Payment</a>.</p><p>The total amount is: ${req.body.amount}.</p>`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.send({ message: 'Payment link sent successfully via email!' });
      } else {
        res.status(500).send('Error: Unable to generate payment link');
      }
      
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      res.status(500).send('Error initiating payment');
    }
  },
  
  // Existing Verify method remains unchanged
  Verify: async (req, res) => {
    const id_payment = req.params.id;
    const url = `https://developers.flouci.com/api/verify_payment/${id_payment}`;

    try {
      const result = await axios.get(url, {
        headers: {
          'apppublic': 'ae056881-78c8-415a-8f99-5add54a2ed92',
          'appsecret': process.env.FLOUCI_SECRET
        }
      });
      console.log(result.data);
      res.send(result.data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      res.status(500).send('Error verifying payment');
    }
  }
};
