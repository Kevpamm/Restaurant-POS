const express = require('express');
const app = express();

const PORT = 5000;

app.use(express.json());
app.use(express.static('./public'));


const orderInStorage =[];

app.post('/api/orders/', (req, res) => {
    const order = req.body;

    if(!order.table || !order.item) {
        return res.status(400).json({error: 'No tables or items provided'});
    }

    orderInStorage.push({
        ...order,
        time: new Date().toISOString(),
        status: 'waiting',
    });
    console.log('New order added to storage:', order);
    res.status(201).json({message: 'Order received'});
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}...`);
})