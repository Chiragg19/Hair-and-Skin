const express = require("express");
const cors = require("cors");

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const app = express();

app.use(cors());
app.use(express.json());

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.post("/api/booking", async (req, res) => {
  try {
    const { service, date, time } = req.body;

    if (!service || !date || !time) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const docRef = await addDoc(collection(db, "appointments"), {
      service,
      date,
      time,
      status: "booked",
      createdAt: new Date(),
    });

    res.json({
      message: "Booking saved",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Firebase Error:", error);
    res.status(500).json({ message: "Error saving booking" });
  }
});
app.get("/api/test", (req, res) => {
  res.json({ message: "API working 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});