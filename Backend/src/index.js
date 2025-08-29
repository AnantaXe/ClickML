const express = require('express');
const app = express();
const dotenv = require('dotenv');
const router = express.Router();
const ETLRouter = require('./routes/ETLRouter');
const cors =  require('cors');


app.use(cors());
app.use(express.json());

dotenv.config();


const PORT = process.env.PORT || 3002;

// app.get('/', (req, res) => {

//     let apiKey = req
//     if (!apiKey) {
//         return res.status(400).send('API key is required');
//     }

//     // Simulate fetching data from an API using the provided API key
//     const data = {
//         message: 'Data fetched successfully',
//         apiKey: apiKey
//     }
//     res.status(200).json(data);

// })

app.use('/etl', ETLRouter);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});