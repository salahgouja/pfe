const axios = require("axios");
const userService = require("../services/userService");

module.exports = {
  Add: async (req, res) => {
    const { amount, id } = req.body; // Retrieve the amount and playlist ID from the request body

    const url = "https://developers.flouci.com/api/generate_payment"; // Define the URL here

    try {
      // Call the assignPlaylistToUser function from the userService
      const result = await userService.assignPlaylistToUser(userId, playlistId);
      console.log(result);

      // Make the payment request
      const payload = {
        app_token: "d6d95238-d5d7-40fb-bda5-2206561529a7",
        app_secret: process.env.flouci_Secret,
        amount,
        accept_card: "true",
        session_timeout_secs: 1200,
        success_link: `http://localhost:3000/playlis/${id}`, // Update the success link with the playlist ID
        fail_link: "http://localhost:3000/api/payment/fail",
        developer_tracking_id: "8238002b-79f7-4cbe-9965-119b659564d3",
      };

      // Make the request to generate the payment
      axios.post(url, payload);
      res.status(200).json({ message: "Playlist assigned successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Unable to assign playlist" });
    }
  },

  Verify: async (req, res) => {
    const paymentId = req.params.id;

    try {
      const verificationResponse = await axios.get(
        `http://developers.flouci.com/api/verify_payment/${paymentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            apppublic: "d6d95238-d5d7-40fb-bda5-2206561529a7",
            appsecret: process.env.flouci_Secret,
          },
        }
      );
      const verificationResult = verificationResponse.data;

      if (verificationResult.success) {
        try {
          // Call the assignPlaylistToUser function from the userService
          const result = await userService.assignPlaylistToUser(
            "646158dd68df82a22a3a20a1",
            "646614c15ff1a60f9ee3271a"
          );
          console.log(result);
          res.status(200).json({ message: "Playlist assigned successfully" });
        } catch (error) {
          console.error("Error:", error);
          res.status(500).json({ error: "Unable to assign playlist" });
        }
      } else {
        res.status(500).json({ error: "Payment verification failed" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Unable to verify payment" });
    }
  },
};
