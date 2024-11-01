const express = require("express");
const router = express.Router();

// keyword mappings -- currently based on occupation, interests, hobbies
const occupationKeywords = {
  Student: ["learning", "workshop", "seminar", "research", "education"],
  Teacher: ["teaching", "mentoring", "workshop", "classroom", "education"],
  Technology: ["coding", "software", "hackathon", "innovation"],
  Music: ["concert", "performance", "instruments", "festival"],
  Business: ["networking", "finance", "entrepreneurship", "conference"],
  Medicine: ["clinic", "hospital", "healthcare", "volunteering"],
  Culinary: ["cooking", "baking", "recipe", "culinary arts"],
};

const interestsKeywords = {
  Food: ["cooking", "culinary", "recipe", "food festival"],
  Art: ["painting", "gallery", "art workshop", "exhibition"],
  Coding: ["programming", "hackathon", "software", "development"],
  Instruments: ["guitar", "piano", "music lesson", "jam session"],
  Finance: ["investing", "budgeting", "economics", "entrepreneurship"],
  Health: ["wellness", "fitness", "exercise", "healthcare"],
  Cooking: ["cooking", "baking", "culinary arts", "community kitchen"],
};

const hobbiesKeywords = {
  Cooking: ["recipe", "meal prep", "baking", "food tasting"],
  Painting: ["art class", "colors", "exhibition", "gallery"],
  Gaming: ["video games", "eSports", "gaming competition", "VR games"],
  Guitar: ["music practice", "jam session", "band", "performance"],
  Reading: ["book club", "library", "storytelling", "literature"],
  Running: ["marathon", "jogging", "fitness", "5k"],
  Baking: ["cake", "pastries", "baking class", "dessert"],
};

// generation of keywords based on userProfile params
function generateKeywordsForUser(userProfile) {
  const { occupation, interests, hobbies } = userProfile;
  let keywords = [];

  if (occupation && occupationKeywords[occupation]) {
    keywords = keywords.concat(occupationKeywords[occupation]);
  }
  if (interests && Array.isArray(interests)) {
    interests.forEach((interest) => {
      if (interestsKeywords[interest]) {
        keywords = keywords.concat(interestsKeywords[interest]);
      }
    });
  }
  if (hobbies && Array.isArray(hobbies)) {
    hobbies.forEach((hobby) => {
      if (hobbiesKeywords[hobby]) {
        keywords = keywords.concat(hobbiesKeywords[hobby]);
      }
    });
  }

  return [...new Set(keywords)];
}

// recommendation endpoint
router.post("/recommendations", (req, res) => {
  try {
    const userProfile = req.body;
    if (!userProfile) {
      return res.status(400).send("User profile data is required");
    }

    // Generate recommended keywords for the user
    const recommendedKeywords = generateKeywordsForUser(userProfile);

    res.json({ keywords: recommendedKeywords });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).send("Error generating recommendations");
  }
});

module.exports = router;
