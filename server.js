const express = require('express');
const app = express();
const port = 5001;


const contractsRoutes = require('./routes/contractsRoutes');


app.use('/api/contacts', contractsRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
