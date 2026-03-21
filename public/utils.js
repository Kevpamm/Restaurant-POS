/**
 * Restaurant POS System - Utility Functions
 * @module utils.js
 * @author Kevin Pham
 * @since 2026-01-04
 * 
 * This module contains utility functions for the restaurant POS system.    
 * The functions included in this module are:
 *  1. selectTable: select a table and render its order
 *  2. addItemToOrder: add items to orders 
 *  3. removeItemFromOrder: remove items from orders
 *  4. renderOrder: render orders for the selected table in the order display area  
 *  5. displayTotal: display total price a table needs to pay in the payment section
 *  6. buildPayload: build the payload, which is the orders of the current table, to send over the wire
 *  7. HTTPSendOrderToServer: send orders to the backend server via HTTP POST 
 *  8. toggleSidebar: toggle the visibility of the sidebar
 * 
 * Each function is documented with its parameters and return values.
 */


/**
 * This function selects a restaurant table and renders its order.
 * If the selected table does not have an order yet, it initializes an empty order for that table in the ordersByTable object.
 * If the selected table already has an order, it simply renders the existing order for that table.
 * 
 * @param {string} tableName - the name of the table to be selected
 * @param {Object} ordersByTable - an object containing orders for all tables
 * @param {string} selectedTable - the name of the currently selected table
 * @param {HTMLUListElement} orderDisplayedArea - the DOM element where the order will be rendered and displayed
 * @return {void}
 */
export function selectTable(tableName, ordersByTable, selectedTable, orderDisplayedArea) {
    selectedTable = tableName;

    if (!ordersByTable[selectedTable]) {
        ordersByTable[selectedTable] = {};
    }

    renderOrder(ordersByTable, selectedTable, orderDisplayedArea);
}

/**
 * This function adds an item to the order of the selected table and re-renders the order display area.
 * 
 * @param {string} name - the name of the item to be added to the order
 * @param {number} price - the price of the item to be added to the order
 * @param {Object} ordersByTable - an object containing orders for all tables
 * @param {string} selectedTable - the name of the currently selected table
 * @param {HTMLUListElement} orderDisplayedArea - the DOM element where the order will be rendered and displayed
 * @returns {void}
 */

export function addItemtoOrder (name, price, ordersByTable, selectedTable, orderDisplayedArea) {
    let orderDuplicateCount = 2;
    let sudoName = name;
    if (!selectedTable) {
        alert("Please select a table first.");
        return;
    }

    //Check if the item has been sent to the server, if so, we cannot change the quantity of the item in the order
    // if (ordersByTable[selectedTable][name] && ordersByTable[selectedTable][name].status === "pending") {
    //     alert("This item has already been sent to the server. Please wait for the order to be processed before making changes.");
    //     return;
    // }
    while (ordersByTable[selectedTable][sudoName] && checkIfItemIsSent(ordersByTable[selectedTable][sudoName])) {
        sudoName = name + " " + orderDuplicateCount;
        orderDuplicateCount++;
    }
    if (ordersByTable[selectedTable][sudoName] && !checkIfItemIsSent(ordersByTable[selectedTable][sudoName]))
        ordersByTable[selectedTable][sudoName].quantity += 1;

    else if (!ordersByTable[selectedTable][sudoName]) {
        ordersByTable[selectedTable][sudoName] = {
            price: price,
            quantity: 1,
            status: ""
        };
    }
    console.log('Order object: ', ordersByTable);
    renderOrder(ordersByTable, selectedTable, orderDisplayedArea);
}
export function checkIfItemIsSent(item) {
    if(item.status === "pending" || item.status === "preparing" || item.status === "ready") {
        return true;
    }
    return false;
}

/**
 * This function removes an item from the order of the selected table and re-renders the order display area.
 * 
 * @param {string} string - the name of the item to be removed from the order
 * @param {Object} ordersByTable - an object containing orders for each table
 * @param {String} selectedTable - the currently selected table
 * @param {HTMLUListElement} orderDisplayedArea - the DOM element where the order will be rendered and displayed
 * @returns {void}
 */

export function removeItem(string, ordersByTable, selectedTable, orderDisplayedArea) {

    if (!selectedTable) 
        return;
    const removedItem = string;
    delete ordersByTable[selectedTable][removedItem];

    renderOrder(ordersByTable, selectedTable, orderDisplayedArea);
}

/**
 * This function renders and displays the order for the selected table in the order-display area.
 * It adds a button to remove the item from the order (this button has an x icon) 
 * and a button to send the order to the server (with a send icon). 
 * Finally, it calculates and displays the total price of the order using displayTotal() function.
 * 
 * @param {Object} ordersByTable - an object containing orders for each table
 * @param {string} selectedTable - the currently selected table
 * @param {HTMLUListElement} orderDisplayedArea - the DOM element where the order will be rendered and displayed
 * @returns {void}
 */

export function renderOrder(ordersByTable, selectedTable, orderDisplayedArea) {
    orderDisplayedArea.innerHTML = "";

    if (!selectedTable) 
        return;

    let total = 0;

    for (let itemName in ordersByTable[selectedTable]) {
        const item = ordersByTable[selectedTable][itemName];
        const li = document.createElement("li");

        if(checkIfItemIsSent(item)) {       
            li.classList.add("sent-item");
        }
        else {
            li.classList.add("order-item");
        }
        
        li.dataset.name = itemName;

        const itemNameSpan = document.createElement("span");
        itemNameSpan.textContent = `${itemName}`;
        itemNameSpan.classList.add("item-name");
    
        const itemQuantitySpan = document.createElement("span");
        itemQuantitySpan.textContent = `x${item.quantity}`;
        itemQuantitySpan.classList.add("item-quantity");

        const itemSubtotalSpan = document.createElement("span");
        itemSubtotalSpan.textContent = `= $${item.price * item.quantity}`;
        itemSubtotalSpan.classList.add("item-subtotal");


        const itemXIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        itemXIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        itemXIcon.setAttribute("viewBox", "0 -960 960 960");
        itemXIcon.setAttribute("width", "24");
        itemXIcon.setAttribute("height", "24");
        itemXIcon.setAttribute("fill", "currentColor");
        itemXIcon.classList.add("item-x-icon");

        const xPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        xPath.setAttribute("d", "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z");

        itemXIcon.appendChild(xPath);
        
        // <span class="material-symbols-outlined">
        //     close
        // </span >

        const itemSendButton = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        itemSendButton.setAttribute("viewBox", "0 -960 960 960");
        itemSendButton.setAttribute("width", "26");
        itemSendButton.setAttribute("height", "26");
        itemSendButton.setAttribute("fill", "currentColor");
        itemSendButton.classList.add("send-button");

        const sendPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        sendPath.setAttribute("d", "M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z");
        itemSendButton.appendChild(sendPath);

        li.appendChild(itemNameSpan);
        li.appendChild(itemQuantitySpan);
        li.appendChild(itemSubtotalSpan);
        li.appendChild(itemXIcon);
        //li.appendChild(itemXButton);
        li.appendChild(itemSendButton);

        orderDisplayedArea.appendChild(li);

        total += item.price * item.quantity;
    }

    displayTotal(total);
}


/**
 * This function displays the total price of the order in the payment section.
 * 
 * @param {number} total - the total price of the order
 * @return {void}
 */

export function displayTotal(total) {
    let totalPriceText = document.querySelector(".order p");
    totalPriceText.textContent = `Total: $${total}`;
}

/**
 * This function builds the payload, which is the orders of the current table, to send over the wire.
 * 
 * @param {string} itemName - the name of the item for which to build the payload
 * @param {Object} ordersByTable - an object containing orders for all tables
 * @param {string} selectedTable - the name of the currently selected table
 * @returns {Object|null} - the built payload or null if no table is selected
 */
export function buildPayload(itemName, ordersByTable, selectedTable) {
    if (!selectedTable)
        return null;
    const payload = {
        table: selectedTable,
        item: itemName,
        quantity: ordersByTable[selectedTable][itemName].quantity,
        price: ordersByTable[selectedTable][itemName].price,
        status: ordersByTable[selectedTable][itemName].status
     };
    return payload;
}

/**
 * This function receives the payload which contains the order information of the current table,
 * and posts it to /api/orders/ as a JSON formatted string.
 * It console logs an error message if the sending fails
 * 
 * Note: This function is used when the WebSocket connection is closed, 
 * and the client switches back to HTTP requests for order updates.
 * 
 * @param {Object} payload - the payload containing order information
 * @returns {Promise<void>} - a promise that resolves when the order has been sent or rejects if there is an error
 */

export async function HTTPSendOrderToServer(payload) {
    if (!payload) 
        return;

    try {
        const response = await fetch('/api/orders/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok)
            throw new Error(`Failed to send order: ${response.status}`);
        console.log('Order has been sent to the server');
    }
    catch(error) {
        console.error('Error sending order: ', error);
    }

}

/**
 * This function toggles the visibility of the sidebar and rotates the toggle button when clicked.
 * 
 * @param {void}
 * @returns {void}
 */
export function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggle-button");
    sidebar.classList.toggle("collapsed");
    toggleButton.classList.toggle("rotate");
}


