const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const VIRTUAL_PORT_PATH = '/dev/ttys007';

// configure serial interface used by the simulated robot
// autoOpen disabled so connection errors can be handled
const port = new SerialPort(
{
    path: VIRTUAL_PORT_PATH,
    baudRate: 9600,
    autoOpen: false
});

// parser converts serial byte stream into line based packets
// delimiter matches the carriage return sent by the firmware simulator
const parser = port.pipe(
    new ReadlineParser(
    {
        delimiter: '\r\n'
    })
);

// serve static dashboard files from the public directory
app.use(express.static('public'));

parser.on('data', (data) =>
{
    try
    {
        // parse telemetry packet received from the serial stream
        const telemetry = JSON.parse(data);

        // log parsed telemetry for debugging and visibility
        console.log(`[Telemetry] Voltage: ${telemetry.v}V | Temp: ${telemetry.t}°C`);

        // broadcast telemetry to all connected dashboard clients
        // WebSockets allow real time updates without page refresh
        io.emit('telemetry', telemetry);
    }
    catch (e)
    {
        // catch malformed packets or partial transmissions
        console.log('Raw Data Error:', data);
    }
});

// open the serial port and report connection status
port.open((err) =>
{
    if (err)
    {
        return console.log('Error opening port: ', err.message);
    }

    console.log('Serial Port Listening:', VIRTUAL_PORT_PATH);
});

io.on('connection', (socket) =>
{
    // notify when a dashboard client connects
    console.log('Congrats! A web browser has connected to the dashboard.');
});

// start HTTP server for dashboard interface
http.listen(3000, () =>
{
    console.log('Dashboard ready at http://localhost:3000');
});