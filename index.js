const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 8000;

app.get('/numbers', async (req, res) => {
  const urls = Array.isArray(req.query.url) ? req.query.url : [req.query.url];
  const uniqueNumbers = new Set();

  try {
    const requests = urls.map(async (url) => {
      try {
        const response = await axios.get(url, { timeout: 500 });
        const data = response.data.numbers || [];
        data.forEach((number) => uniqueNumbers.add(number));
      } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
      }
    });

    await Promise.all(requests);

    const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);
    const horizontalString = sortedNumbers.join(', '); 
    res.json({ numbers: `[ ${horizontalString} ]` }); 
  } catch (error) {
    console.error('Error processing requests:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
