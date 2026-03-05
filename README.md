# BMS (Battery Monitoring System): Hardware-in-the-Loop Simulator
A real-time Battery Management System (BMS) telemetry dashboard developed in **Node.js** to simulate embedded robotics sensor data via **UART**.

## Project Overview
This project simulates a high speed robotics telemetry link. It uses a virtual serial bridge to stream battery health data from a simulated firmware script (the "Robot") to a Node.js Ground Station and live web dashboard.
- **Node.js:** Used a Node.js backend to read incoming telemetry data and stream it to a live dashboard.
- **Serial Communication:** Simulated a UART/serial connection to send telemetry data from the robot simulator to the server.

## System Architecture
1. **Robot Firmware (Simulated):** Bash script generating JSON telemetry packets (Voltage/Temp).
2. **Virtual Wire:** `socat` based PTY bridge simulating physical serial ports.
3. **Ground Station:** Node.js server using `serialport` and `socket.io`.
4. **Dashboard:** Live web UI with real-time Chart.js visualization.

## Data Flow
  robot_sim.sh
    ↓
  Generates simulated battery telemetry
  (JSON packets containing voltage and temperature)
    ↓
  Virtual UART Link (socat PTY bridge)
    ↓
  Acts as a virtual serial cable between the robot and ground station
    ↓
  server.js
    ↓
  Reads serial data → parses telemetry → broadcasts via WebSockets
    ↓
  index.html dashboard
    ↓
  Displays real time voltage and temperature with a live updating chart

## Getting Started
1. **Create the Link:** `socat -d -d pty,raw,echo=0 pty,raw,echo=0`
2. **Start Dashboard:** `cd dashboard-app && node server.js`
3. **Start Robot:** `./robot-firmware/robot_sim.sh`
4. **View:** Open `http://localhost:3000`
