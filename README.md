# Restaurant POS System

A modular restaurant point-of-sale (POS) system designed to manage tables, orders, and real-time communication between the frontend, backend, and embedded devices.

This project is built as a learning-focused but production-minded system that will combine **web technologies**, **Node.js**, and **embedded hardware** to simulate how a modern restaurant POS works end-to-end.

---

## 🚀 Current Features

- Table selection and management
- Order creation, update, and removal

---

## 🛣️ Future Improvement

- [ ] Create Backend API built with Node.js and Express
- [ ] Real-time order flow from frontend to backend to embedded devices and backward
- [ ] Design UI for embedded Touchscreen (Kitchen receiving orders)
- [ ] Implement RFID authentication for staff access
- [ ] WebSocket for real-time updates
- [ ] Add database for order history and anlytics
- [ ] Add Real-Time robots that deliver food


---

## 🏗️ System Architecture (High Level)

```
[ Web Frontend ]
      |   ↑
      |   | HTTP / JSON
      ↓   | 
[ Node.js + Express Backend ]
      |   ↑
      |   | WiFi / HTTP / MQTT (planned)
      ↓   | 
[ Embedded Device (ESP8266 + Display) ]
```

---

## 🧰 Tech Stack

### Frontend
- HTML, CSS, JavaScript
- DOM-based UI logic

### Backend (In Progress)
- Node.js
- Express.js
- RESTful API design

### Embedded / Hardware (Planned / In Progress)
- ESP8266 (The chip that manages how the kitchen receives orders)
- 4.0" SPI Touchscreen and LCD display (Kitchen screen display)
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
