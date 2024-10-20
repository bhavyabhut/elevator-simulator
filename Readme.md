# 🚀 Elevator Simulator

Welcome to the **Elevator Simulator**, a dynamic simulation of elevator movements, complete with real-time updates and control panel interactions.

This project features a **React** front-end with **Tailwind CSS**, **TypeScript**, and **Framer Motion**, and a **Node.js** back-end powered by **Express** and **MongoDB** for managing elevator states. The simulator provides a visual representation of an elevator moving between floors, with smooth animations and real-time API interaction.

## 🖥️ Project Overview

- **Front-End**: React, TypeScript, Tailwind CSS, Framer Motion
- **Back-End**: Node.js, Express, MongoDB, REST API
- **Deployment**: Front-end on **Netlify**, back-end on **Render**

### 🌟 Features

- Interactive **control panel** for calling the elevator to specific floors.
- Real-time **elevator movement** and status updates.
- **Responsive** design for mobile and desktop.
- Visually appealing animations using **Framer Motion**.
- REST API for managing elevator states.

## 🚀 Live Demo

- **Frontend**: [Elevator Simulator on Netlify](https://elevator-bhavya.netlify.app/)
- **Backend**: Hosted on Render (see note below).

> **Note**: The backend is hosted on a free-tier Render service. This means the server may take a few minutes to wake up when accessing the application for the first time.

---

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

## 1. Clone the repository

```bash
git clone https://github.com/bhavyabhut/elevator-simulator.git
cd elevator-simulator
```


## 2. Install Dependencies

###  Backend

```bash
npm run install:server
```

###  Frontend

```bash
npm run install:client
```


## 3. Set up Environment Variables

For the server to communicate with MongoDB, create a .env file in the server folder with the following content:

```bash
MONGO_URI=your_mongo_db_connection_string
PORT=your_port
```


## 4. Running the Project

###  Start Backend (Development Mode)
```bash
npm run start:server:dev
```

### Start Frontend
```bash
npm run start:client
```


## 4. Build for Production
To build the project for production, run:

```bash
npm run build:server
npm run build:client
```
