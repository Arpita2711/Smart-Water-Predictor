// mlRoute.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/api/predict', async (req, res) => {
  const { dissolvedOxygen, ph, salinity } = req.body;

  try {
    const response = await axios.post('http://ml:5001/predict', {
      do: dissolvedOxygen,
      ph,
      salinity,
    });

    res.json({
      result: response.data.prediction,
    });
  } catch (error) {
    console.error('Error calling ML model:', error.message);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

module.exports = router;
