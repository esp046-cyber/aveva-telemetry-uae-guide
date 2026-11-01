# Modbus troubleshooting
- Function codes: 01 coils read, 02 discrete inputs, 03 holding regs, 04 input regs, 05/06 write single, 15/16 write multiple.
- 40001 in manuals is wire address 0. Check offset first.
- RS-485: daisy chain, 120 ohm at both ends, bias at one point, swap D+/D- if silent.
- RTU frame gap is 3.5 characters. Check baud, parity, stop bits match on every device.
- Exceptions: 01 illegal function, 02 illegal address, 03 illegal value, 04 device failure.
