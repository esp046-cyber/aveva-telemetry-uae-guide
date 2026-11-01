# Utility metering reference (Kamstrup Multical 603/803 Modbus module)
**Source and disclaimer:** The register set below was supplied by the project owner and entered as given. It has not been independently checked against the Kamstrup Modbus module manual. Before commissioning, confirm every address, data type and unit against the manual for the exact module and firmware, and against the site FAT documentation. Client-specific offsets always override this sheet.

## Register map (input registers, function code 04)
| Quantity | Listed address | Wire address | Type | Word order |
|---|---|---|---|---|
| Energy E1 | 30001 | 0x0000 | 32-bit float | CDAB (word swapped) |
| Volume V1 | 30005 | 0x0004 | 32-bit float | CDAB |
| Flow rate Q | 30009 | 0x0008 | 32-bit float | CDAB |
| Power P | 30013 | 0x000C | 32-bit float | CDAB |
| Forward temp T1 | 30017 | 0x0010 | 32-bit float | CDAB |
| Return temp T2 | 30021 | 0x0014 | 32-bit float | CDAB |
| Delta-T | 30025 | 0x0018 | 32-bit float | CDAB |

Word order was stated explicitly for Energy E1; the same order is assumed for the rest. Units and scaling are not given in the specification: record them from the manual.

## AVEVA Geo SCADA setting
Set the Modbus driver point to 32-bit Floating Point with "Word Swapped" enabled. Check whether your driver version treats the address as zero- or one-based (30001 is wire address 0).

## 32-bit float (IEEE 754)
Example: 100.0 = 0x42C80000. Big-endian (AB CD) sends 42C8 then 0000. Word swapped (CD AB) sends 0000 then 42C8.
If a reading is absurd, try the other word order and byte order, and test against a known value.

## Things to check before trusting this map
- Each float uses two registers, but these addresses are four apart. Confirm what the unused registers hold and whether a block read can span them.
- Confirm that Energy is really a float on your module and what unit it uses.
- Verify the map with one live read against the meter display for each quantity.
