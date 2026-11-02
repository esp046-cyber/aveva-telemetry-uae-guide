> **Calculator:** Markdown cannot run scripts, so the interactive Modbus register calculator (2-register float vs 4-register padded offsets, float and word-swap encode/decode) is in the app under **Tools**. The static table below gives the same offsets for the first seven values starting at 30001.
>
> | Value # | 2-register stride (wire) | 4-register stride (wire) |
> |---|---|---|
> | 1 | 0 | 0 |
> | 2 | 2 | 4 |
> | 3 | 4 | 8 |
> | 4 | 6 | 12 |
> | 5 | 8 | 16 |
> | 6 | 10 | 20 |
> | 7 | 12 | 24 |

# Utility metering reference (Kamstrup Multical 603/803 Modbus module)
**Source and disclaimer:** The register set below was supplied by the project owner and entered as given. It has not been independently checked against the Kamstrup Modbus module manual. Before commissioning, confirm every address, data type and unit against the manual for the exact module and firmware, and against the site FAT documentation. Client-specific offsets always override this sheet.

## Register map (input registers, function code 04)
| Quantity | Listed address | Wire address | Type | Word order |
|---|---|---|---|---|
| Energy E1 | 30001 | 0x0000 | 32-bit float | CDAB (word swapped) |
| Volume V1 | 30003 | 0x0002 | 32-bit float | CDAB |
| Flow rate Q | 30005 | 0x0004 | 32-bit float | CDAB |
| Power P | 30007 | 0x0006 | 32-bit float | CDAB |
| Forward temp T1 | 30009 | 0x0008 | 32-bit float | CDAB |
| Return temp T2 | 30011 | 0x000A | 32-bit float | CDAB |
| Delta-T | 30013 | 0x000C | 32-bit float | CDAB |

Word order was stated explicitly for Energy E1; the same order is assumed for the rest. Units and scaling are not given in the specification: record them from the manual.

> **Note:** The earlier supplied map used 4-register spacing. This table uses standard 2-register float spacing, which matches the app's Tools calculator. Some legacy district cooling gateways pad registers to 4-word offsets; verify which your site uses.

## AVEVA Geo SCADA setting
Set the Modbus driver point to 32-bit Floating Point with "Word Swapped" enabled. Check whether your driver version treats the address as zero- or one-based (30001 is wire address 0).

## 32-bit float (IEEE 754)
Example: 100.0 = 0x42C80000. Big-endian (AB CD) sends 42C8 then 0000. Word swapped (CD AB) sends 0000 then 42C8.
If a reading is absurd, try the other word order and byte order, and test against a known value.

## Things to check before trusting this map
- Standard spacing: each 32-bit float uses two registers, so consecutive values are two apart (30001, 30003, ... 30013). Some legacy district cooling gateways pad each value to a 4-word offset (30001, 30005, 30009, ...). If your gateway does this, use the 4-register mode in the app's Tools calculator and confirm against the site FAT sheet.
- Confirm that Energy is really a float on your module and what unit it uses.
- Verify the map with one live read against the meter display for each quantity.
