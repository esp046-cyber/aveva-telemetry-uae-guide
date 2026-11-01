# DNP3 quick reference
- Class 0 = static data. Class 1/2/3 = event data (by priority).
- Integrity poll = Class 0 + all event classes. Event poll = Class 1/2/3 only.
- Common objects: g1v2 binary input with flags, g30v1/v5 analog input, g12 CROB control, g20 counters, g50 time.
- IIN2.3 means event buffer overflow. IIN1.4 means time sync needed.
- Unsolicited: enable per class, set hold-off times per site, confirm with application confirm.
- Time: delay measurement on WAN, LAN time sync on Ethernet.
