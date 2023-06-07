const axios = require("axios");
module.exports = {
  Add1: async (req, res) => {
    const url = "https://developers.flouci.com/api/generate_payment";

    // Make the payment request
    const payload = {
      app_token: "d6d95238-d5d7-40fb-bda5-2206561529a7",
      app_secret: process.env.flouci_Secret,
      amount: req.body.amount,
      accept_card: "true",
      session_timeout_secs: 1200,
      success_link: `http://localhost:3000/marketplace?phoneNumbers=${encodeURIComponent(
        JSON.stringify(req.body.phoneNumbers)
      )}`,
      fail_link: "http://localhost:3000/marketplace",
      developer_tracking_id: "8238002b-79f7-4cbe-9965-119b659564d3",
    };

    // Make the request to generate the payment
    await axios
      .post(url, payload)
      .then((result) => {
        console.log(result.data);
        res.send(result.data);
      })
      .catch((err) => console.log(err));
  },
  Verify1: async (req, res) => {
    const payment_Id = req.params.id;
    await axios
      .get(`https://developers.flouci.com/api/verify_payment/${payment_Id}`, {
        headers: {
          "Content-Type": "application/json",
          apppublic: "d6d95238-d5d7-40fb-bda5-2206561529a7",
          appsecret: process.env.flouci_Secret,
        },
      })
      .then((result) => {
        res.send(result.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
};
