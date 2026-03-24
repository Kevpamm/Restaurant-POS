console.log("POS system loaded");
let selectedTable = null;
const tableButtons = document.querySelectorAll(".tables button");
const menuButtons = document.querySelectorAll(".menu button");
const orderDisplayedArea = document.querySelector(".order-list");
const ordersByTable = {};
import { renderOrder, addItemtoOrder, removeItem, buildPayload, HTTPSendOrderToServer } from './utils.js';
let ws = new WebSocket("ws://localhost:5000");

ws.addEventListener('open', () => {
    console.log('WebSocket connection established!\n You can start sending orders in real-time now.');
});

ws.addEventListener('message', (serverMessage) => {
    try {
        ///parse string using JSON.parse() once receive JSON string from the server, and update the UI accordingly
        const updatedOrder = JSON.parse(serverMessage.data);
        console.log('Order update received: ', updatedOrder);
        console.log('Updated order status: ', updatedOrder.status);
        console.log('Updated order item: ', updatedOrder.item);
        // Here you can add code to update the UI based on the received message

    } catch (error) {
        console.error('Error parsing server message: ', error);
    }

    // Here, add code to update the UI based on the received message
});

ws.addEventListener('close', () => {
    console.log('WebSocket Connection closed. Switching back to HTTP requests for order updates.');
});

tableButtons.forEach(button => {
    button.addEventListener("click", function() {
        selectedTable = button.dataset.table;
        console.log("Selected Table = ", selectedTable);
        
        if (!ordersByTable[selectedTable]) {
            ordersByTable[selectedTable] = {};
        }

        renderOrder(ordersByTable, selectedTable, orderDisplayedArea);
    });
});

menuButtons.forEach(button => {
    button.addEventListener("click", function() {
        if (!selectedTable) {
            alert("Please choose a table first");
            return;
        }

        addItemtoOrder(
            button.dataset.name, // item name
            Number(button.dataset.price), // item price
            ordersByTable,
            selectedTable,
            orderDisplayedArea
        );
    });
});


orderDisplayedArea.addEventListener("click", function(event) {
    if (!event.target.classList.contains("item-x-icon") 
        && !event.target.classList.contains("send-button")) 
        return;

    else if (event.target.classList.contains("item-x-icon")) {
        const itemName = event.target.closest(".order-item").dataset.name; 

        removeItem(itemName, ordersByTable, selectedTable, orderDisplayedArea);
    }

    else if (event.target.classList.contains("send-button")) {
        event.target.classList.add("sent-btn");
        //change how the button looks like after clicking as well.
        const item = event.target.closest(".order-item");
        item.className = "sent-item";
        const itemName = item.dataset.name;
        ordersByTable[selectedTable][itemName].status = "pending";


        const payload = buildPayload(itemName, ordersByTable, selectedTable);
        if (ws.readyState === 1) {
            try {
                ws.send(JSON.stringify(payload));
                console.log("Order sent to server via WebSocket: ", itemName);
            }
            catch (error) {
                console.error("Error sending order via WebSocket: ", error);
                console.log("Falling back to HTTP POST for sending order.");
                HTTPSendOrderToServer(payload);
            }
        }
        else {
            console.log("WebSocket connection is not open. Sending order via HTTP POST instead."); 
            HTTPSendOrderToServer(payload);
        }

        return;
    }

});







