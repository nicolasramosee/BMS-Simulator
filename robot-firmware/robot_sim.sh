#!/bin/bash

PORT="/dev/ttys006"

# base battery voltage used for simulation
# represents nominal voltage of the system
V_BASE=12.5
STEP=0

while true
do
    # generate simulated battery voltage
    # voltage fluctuates slightly around the base value to emulate load changes
    # 'RANDOM % 30' produces a drop between 0.00V and 0.29V
    NOISE=$(($RANDOM % 30))
    VOLTS=$(echo "scale=2; $V_BASE - $NOISE / 100.0" | bc)

    # generate simulated system temperature
    # small random variation around 25 C to mimic normal operating conditions
    TEMP_NOISE=$(($RANDOM % 5))
    TEMP=$(echo "scale=1; 25 + $TEMP_NOISE" | bc)

    # transmit telemetry packet over the serial interface
    # JSON format mimics a embedded telemetry message
    echo -e "{\"v\": ${VOLTS}, \"t\": ${TEMP}}\r" > $PORT

    # telemetry update rate (1 Hz)
    sleep 1
done