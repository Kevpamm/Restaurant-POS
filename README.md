# Restaurant POS System

A modular restaurant point-of-sale (POS) system designed to manage tables, orders, and real-time communication between the frontend, backend, and embedded devices.

This project is built as a learning-focused but production-minded system that will combine **web technologies**, **Node.js**, and **embedded hardware** to simulate how a modern restaurant POS works end-to-end.

---

## 🚀 Current Features

- Table selection and management
- Order creation, update, and removal
- Order can now be sent from the Website (Frontend) to Server (Backend)

---

## 🛣️ Road Map & Future Improvement

- [x] Create Backend API built with Node.js and Express
- [ ] Add Real-time order flow from frontend to backend to embedded devices and backward
- [ ] Design UI for embedded Touchscreen (Kitchen receiving orders)
- [ ] Implement RFID authentication for staff access
- [ ] Add WebSocket for real-time updates
- [ ] Add database for order history and analytics
- [ ] Build Real-Time robots that deliver food


---

## 🐞 Spotted Bugs to be fixed

### User Experience

- App does not display which table is being selected
- Order does not have an option to reduce or increase items' quantity
- An item can be sent multiple times to the server
- Item status from the kitchen is missing ('pending', 'making', 'ready')

### User Interface

- Sidebar-collapse button does not 'middle align' with the Restaurant Logo
- Categories are not covered or are partially covered when the sidebar is collapsed
- Dine-in section and Take-out section are too close to each other

### Logic Bug:
- Backend receives only the price of one item instead of the subtotal.
Fix: Multiply the item price by the quantity before sending to the server.

---

## 🏗️ System Architecture (High Level)
```
 [Web Frontend (Browser/JS UI)]
              |   ↑
 Send orders  |   | 
 to server    |   | Receive order status
              |   | from the server
              ↓   |
 [Server (Node.js + Express)]
              |   ↑
 Store orders |   | 
              |   | Receive orders status
 Send orders  |   | from devices
 to devices   |   | 
              ↓   | 
 [Embedded Devices (ESP8266)]
              |   ↑
Display orders|   |  
in real-time  |   | 
to screen     |   | Staff updates orders status
              |   | via touchscreen
              ↓   |
 [Kitchen Staff / Screen (ST7796S)]
```
---

## 🧰 Tech Stack

### Frontend
- HTML, CSS, JavaScript
- DOM-based UI logic

### Backend
- Node.js
- Express.js
- RESTful API design

### Embedded / Hardware (Planned / In Progress)
- ESP8266 (The chip that manages how the kitchen receives orders)
- 4.0" ST7796S SPI Touchscreen and LCD display (Kitchen screen display)
- Arduino Uno R4 Wifi (The brain of the robots that deliver food)
- Arduino IDE (To programme the above hardware)
---


## 🎯 Goals of This Project

- Understand full-stack system design
- Integrate software with embedded hardware
- Practice clean API boundaries
- Learn real-world POS workflows

---

## 🤝 Contributing

This project is currently under active development. Contributions, suggestions, and design feedback are welcome.
