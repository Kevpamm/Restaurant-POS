console.log("POS system loaded");
let selectedTable = null;
const tableButtons = document.querySelectorAll(".tables button");
const menuButtons = document.querySelectorAll(".menu button");
const orderDisplayedArea = document.querySelector(".order-list");
const ordersByTable = {};

tableButtons.forEach(button => {
    button.addEventListener("click", function() {
        selectedTable = button.dataset.table;
        console.log("Selected Table = ", selectedTable);
        
        if (!ordersByTable[selectedTable]) {
            ordersByTable[selectedTable] = {};
        }

        renderOrder();
    });
});

menuButtons.forEach(button => {
    button.addEventListener("click", function() {
        if (!selectedTable) {
            alert("Please choose a table first");
            return;
        }

        addItemtoOrder(
            button.dataset.name,
            Number(button.dataset.price)
        );

        //old adding orders method when array was used to store ordered items
        // const item = {
        //     name: button.dataset.name,
        //     price: Number(button.dataset.price)
        // };
        // orderList.push(item);
        // total += item.price;

        // renderOrder();
        // console.log("Updated order: ", orderList);
    });
});

// When X button wasn't added and clicking on order-item-name removes the item from the order list
// orderDisplayedArea.addEventListener("click", function(event) {
//     const clickedLi = event.target;
//     if (clickedLi.tagName != "LI")
//         return;
//     const index = Number(clickedLi.dataset.index);

//     removeItem(index);
// })

orderDisplayedArea.addEventListener("click", function(event) {
    if (!event.target.classList.contains("item-x-icon") 
        && !event.target.classList.contains("send-button")) 
        return;

    else if (event.target.classList.contains("item-x-icon")) {
        const string = event.target.dataset.string;
        removeItem(string);
    }

    else if (event.target.classList.contains("send-button")) {
        const string = event.target.dataset.string;
        sendOrderToServer(string);
        console.log("... sent");
        return;
    }

});

//Old function to add item to order when there was no table selection
// function addItemtoOrder (name, price) {
//     if (order[name]) 
//         order[name].quantity += 1;
//     else {
//         order[name] = {
//             price: price,
//             quantity: 1
//         };
//     }
//     renderOrder();
// }

function addItemtoOrder (name, price) {
    if (!selectedTable) {
        alert("Please select a table first.");
        return;
    }

    if (ordersByTable[selectedTable][name])
        ordersByTable[selectedTable][name].quantity += 1;
    else {
        ordersByTable[selectedTable][name] = {
            price: price,
            quantity: 1
        };
    }
    renderOrder();
}

//Old render order function when array was used to store ordered items
// function renderOrder() {
   
//     orderDisplayedArea.innerHTML = "";

//     orderList.sort((a,b) => a.name.localeCompare(b.name));
//     orderList.forEach((item,index) => {
//         const li = document.createElement("li");
//         li.classList.add("order-item");

//         const itemTextSpan = document.createElement("span");
//         itemTextSpan.textContent = `${item.name} - $${item.price}`;

//         const itemXButton = document.createElement("button");
//         itemXButton.textContent = "X";
//         itemXButton.classList.add("x-button");
//         itemXButton.dataset.index = index;

//         li.appendChild(itemTextSpan);
//         li.appendChild(itemXButton);

//         orderDisplayedArea.appendChild(li);

//     });

//     totalPriceText.textContent = "Total: $" + total;
// }

function selectTable(tableName) {
    selectedTable = tableName;

    if (!ordersByTable[selectedTable]) {
        ordersByTable[selectedTable] = {};
    }

    renderOrder();
}

function renderOrder() {
    orderDisplayedArea.innerHTML = "";

    if (!selectedTable) 
        return;

    let total = 0;

    for (let itemName in ordersByTable[selectedTable]) {
        const item = ordersByTable[selectedTable][itemName];
        const li = document.createElement("li");
        li.classList.add("order-item");

        const itemNameSpan = document.createElement("span");
        itemNameSpan.textContent = `${itemName}`;
        itemNameSpan.classList.add("item-name");
    
        const itemQuantitySpan = document.createElement("span");
        itemQuantitySpan.textContent = `x${item.quantity}`;
        itemQuantitySpan.classList.add("item-quantity");

        const itemSubtotalSpan = document.createElement("span");
        itemSubtotalSpan.textContent = `= $${item.price * item.quantity}`;
        itemSubtotalSpan.classList.add("item-subtotal");

        // const itemXButton = document.createElement("button");
        // itemXButton.textContent = "X";
        // itemXButton.classList.add("x-button");
        // itemXButton.dataset.string = itemName;

        const itemXIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        itemXIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        itemXIcon.setAttribute("viewBox", "0 -960 960 960");
        itemXIcon.setAttribute("width", "24");
        itemXIcon.setAttribute("height", "24");
        itemXIcon.setAttribute("fill", "currentColor");
        itemXIcon.classList.add("item-x-icon");
        itemXIcon.dataset.string = itemName;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z");

        itemXIcon.appendChild(path);
        
        // <span class="material-symbols-outlined">
        //     close
        // </span >

        const itemSendButton = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        itemSendButton.setAttribute("viewBox", "0 -960 960 960");
        itemSendButton.setAttribute("width", "26");
        itemSendButton.setAttribute("height", "26");
        itemSendButton.setAttribute("fill", "currentColor");
        itemSendButton.classList.add("send-button");
        itemSendButton.dataset.string = itemName;

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


function removeItem(string) {

    if (!selectedTable) 
        return;
    const removedItem = string;
    delete ordersByTable[selectedTable][removedItem];

    renderOrder();
}

function displayTotal(total) {
    let totalPriceText = document.querySelector(".order p");
    totalPriceText.textContent = `Total: $${total}`;
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggle-button");
    sidebar.classList.toggle("collapsed");
    toggleButton.classList.toggle("rotate");
}

async function sendOrderToServer(itemName) {
    if (!selectedTable)
        return;
    
    const orderInfo = {
        table: selectedTable,
        item: itemName,
        quantity: ordersByTable[selectedTable][itemName].quantity,
        price: ordersByTable[selectedTable][itemName].price
    };

    try {
        const response = await fetch('/api/orders/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderInfo)
        });

        if (!response.ok)
            throw new Error(`Failed to send order: ${response.status}`);
        console.log('Order has been sent to the server');
    }
    catch(error) {
        console.error('Error sending orderr: ', error);
    }

}


