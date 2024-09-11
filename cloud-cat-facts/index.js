require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// Morse code dictionary
const morseCode = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  " ": " / ",
};

function textToMorse(text) {
  return text
    .toUpperCase()
    .split("")
    .map((char) => morseCode[char] || char)
    .join(" ");
}

async function getCatFact() {
  try {
    const response = await axios.get("https://catfact.ninja/fact");
    return response.data.fact;
  } catch (error) {
    console.error("Error fetching cat fact:", error);
    return "Cat fact not available!";
  }
}

async function sendSms(morseFact, toPhoneNumber) {
  try {
    const message = await client.messages.create({
      body: `Here is your cat fact in Morse code: ${morseFact}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhoneNumber,
    });
    console.log(`Message sent: ${message.sid}`);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
}

app.use(express.json());

app.post("/send-cat-fact", async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const catFact = await getCatFact();
  const morseFact = textToMorse(catFact);

  await sendSms(morseFact, phoneNumber);
  console.log(`${morseFact} sent to ${phoneNumber}`);
  res.json({ message: "Cat fact sent in Morse code!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
