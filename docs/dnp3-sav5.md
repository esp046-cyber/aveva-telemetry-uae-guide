# DNP3 Secure Authentication v5 (SAv5)
Standard: IEEE 1815-2012. Verify every setting against your RTU firmware manual and the AVEVA Geo SCADA DNP3 driver documentation; menu names differ by version.

## Concepts
- **Challenge-response:** the receiver sends a Challenge (g120v1); the sender replies with an HMAC (g120v2). Only then is a critical request (control, config, file transfer) executed.
- **Critical function codes** are configurable; at minimum controls (SELECT/OPERATE/DIRECT OPERATE), cold/warm restart, and file operations.
- **Aggressive Mode:** the HMAC is attached to the original request (g120v3 then g120v9), saving a round trip. Useful on slow cellular links, but the outstation must be configured to accept it.
- **Keys:** an Update Key per user (pre-shared, or delivered by the authority) protects Session Key changes. Session Keys (control and monitor direction) are rotated periodically (g120v6) and after errors. Keep Update Keys out of source control and off shared drives.
- **Users and roles:** each user number maps to a role (viewer, operator, engineer, security admin) in the outstation. Use separate users for operators and for engineering access.
- **HMAC algorithms:** SHA-256 is the modern choice; SHA-1 is legacy. Match both ends.

## Commissioning steps
1. Confirm firmware supports SAv5 and the same option set as the master.
2. Create users and Update Keys on both sides (same key, same user number).
3. Enable authentication with only controls critical first; test one control from the HMI.
4. Watch for g120v7 error objects: wrong key, unknown user, replay or key-status mismatch.
5. Set session key change interval and maximum error count; record settings in the SAT pack.
6. Re-test after reboot of both ends and after a comms loss.

## Typical failures
- Controls rejected after a restart: session keys not re-established; trigger a key status request/change.
- Works in LAN, fails over cellular: challenge timeout shorter than round trip.
- Clock or sequence mismatch after RTU restore: re-sync time, then re-establish keys.
