const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {

    let apiKey = req
    if (!apiKey) {
        return res.status(400).send('API key is required');
    }

    // Simulate fetching data from an API using the provided API key
    const data = {
        message: 'Data fetched successfully',
        apiKey: apiKey
    }
    res.status(200).json(data);

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});