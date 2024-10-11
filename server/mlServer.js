const express = require("express");
const cors = require("cors");
const tf = require("@tensorflow/tfjs-node");
const app = express();

app.use(cors()); // Enable CORS for all requests
app.use(express.json());

let loadedModel;

// load in saved model
(async () => {
  try {
    loadedModel = await tf.loadLayersModel("file://model/model.json");
    console.log("loading success");
  } catch (error) {
    console.error("error:", error);
  }
})();

// encodings
const availabilityEncoding = { Weekdays: 0, Weekends: 1 };
const occupationEncoding = {
  Student: 0,
  Teacher: 1,
  Technology: 2,
  Music: 3,
  Business: 4,
  Medicine: 5,
  Culinary: 6,
};
const interestsEncoding = {
  Food: 0,
  Art: 1,
  Coding: 2,
  Instruments: 3,
  Finance: 4,
  Health: 5,
  Cooking: 6,
};
const hobbiesEncoding = {
  Cooking: 0,
  Painting: 1,
  Gaming: 2,
  Guitar: 3,
  Reading: 4,
  Running: 5,
  Baking: 6,
};

//predictions
app.post("/predict", async (req, res) => {
  try {
    const { availability, location, occupation, interests, hobbies } = req.body;

    // encode the input data
    const encodedInput = [
      availabilityEncoding[availability],
      parseInt(location),
      occupationEncoding[occupation],
      interestsEncoding[interests],
      hobbiesEncoding[hobbies],
    ];

    const inputTensor = tf.tensor2d([encodedInput]);
    const prediction = loadedModel.predict(inputTensor);
    const predictionResult = prediction.argMax(-1).dataSync()[0];

    // map the prediction result back to service type
    const serviceMapping = [
      "Soup Kitchen",
      "Planting Trees",
      "Beach Cleanup",
      "Hospital Visits",
      "Animal Shelter",
    ];
    res.json({ prediction: serviceMapping[predictionResult] });
  } catch (error) {
    console.error("Error making prediction:", error);
    res.status(500).send("Error making prediction");
  }
});

app.listen(5020, () => console.log("Server running on port 5020"));
