# SCADAPack hardware matrix
**Source:** Specifications below were supplied by the project owner and entered as given. They have not been independently verified against Schneider Electric datasheets. Check the datasheet and firmware release notes for your exact model before ordering or designing.

| Family | Models | CPU | Serial | Protocols | Programming | Temp range |
|---|---|---|---|---|---|---|
| 300E series | 334E, 357E | 32-bit ARM7/ColdFire | Jumper-configurable RS-232/RS-485 | DNP3 Level 3 | TelePACE Studio or SCADAPack Workbench (ISaGRAF) | -40 to +70 degC |
| x70 series | 470, 474 | 32-bit ARM Cortex-M7 (STM32F7 at 216 MHz) | Software-selectable RS-232/485 | DNP3 Level 4 with SAv5 | RemoteConnect (EcoStruxure logic) only | -40 to +70 degC |
| 500 series | 535E, 570, 575 | High-performance ARM Cortex-M7 | See datasheet | DNP3 SAv5, Modbus TCP/RTU; dual Ethernet | Workbench (535E); RemoteConnect (570, 575) | -40 to +70 degC |

## Notes
- The 350E, which appeared in the earlier brief, is not covered by this specification.
- Serial 2-wire versus 4-wire options, port counts and I/O limits are not in the specification; take them from the datasheet.
- Panel internal temperature in UAE summer can exceed the -40 to +70 degC range, so derate and cool accordingly.
- Record the firmware and tool versions used in the site sheet.
