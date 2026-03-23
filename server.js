const express = require('express');
const http = require ('http');
const app = express();
const server = http.createServer(app);
const WebSocketServer = require('websocket').server;
const PORT = 5000;

app.use(express.json());
app.use(express.static('./public'));

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}...`);
});

let wsclients = [];

let WebSocket = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function checkIfOriginIsAllowed(origin) {
    const allowedOrigins = [
        "http://localhost:5000",
        "http://localhost:3000",
    ];
    return allowedOrigins.includes(origin);
}

WebSocket.on('request', (wsrequest) => {
    console.log((new Date()) + '\n\t>> Received WebSocket connection request from origin:', wsrequest.origin + '\n');   
    if(!checkIfOriginIsAllowed(wsrequest.origin)) {
        wsrequest.reject(401, 'You are not allowed to connect to this server.');
        console.log((new Date()) + '\n\t>> Connection from origin ' + wsrequest.origin + ' rejected.\n');
        return;
    }

    const WSserver = wsrequest.accept();

    console.log((new Date()) + '\n\t>> Accepted connection from origin: ' + wsrequest.origin + '\n');
    wsclients.push(WSserver);
    wsclients.forEach(client => {
        console.log('Client IP: ', client.remoteAddress);
    });

    WSserver.on('message', (clientMessage) => {
        console.log('Received message from client: ', clientMessage);
        console.log('Client message type: ', clientMessage.type);
        console.log('Client message data: ', clientMessage.utf8Data);
        try {
            const actualClientMessage = JSON.parse(clientMessage.utf8Data);
            console.log('Parsed client message: ', actualClientMessage);
            console.log('\nTable: ', actualClientMessage.table);
        }
        catch (error) {
            console.error('Error parsing client message: ', error);
        }
        wsclients.forEach((client) => {
            client.send(clientMessage.utf8Data);
        });
    });

    WSserver.on('close', (Code, reason) => {
        console.log(new Date() + `: \n\t>> Client: ${wsrequest.origin} | IP ${wsrequest.remoteAddress} disconnected.\n\t   Code: ${Code} | Reason: ${reason}\n`);
        wsclients = wsclients.slice(wsclients.indexOf(WSserver), 1);
        console.log('Current connected clients: ', wsclients);
    })
})




const orderInStorage =  [];

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

