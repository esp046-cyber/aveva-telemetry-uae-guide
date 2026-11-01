# MQTT and Sparkplug B
Verify AVEVA driver binding screens and options against your Geo SCADA version documentation.

## Topic namespace
`spBv1.0/<group_id>/<message_type>/<edge_node_id>[/<device_id>]`
Message types: NBIRTH, NDEATH, DBIRTH, DDEATH, NDATA, DDATA, NCMD, DCMD, plus host `STATE`.

## Lifecycle
1. Edge node connects with an MQTT Will set to NDEATH (carries `bdSeq`).
2. On connect it publishes NBIRTH (all node metrics, `bdSeq`, seq 0), then DBIRTH per device.
3. Changes go out as NDATA/DDATA report-by-exception; `seq` increments 0..255 and wraps. A gap means missed data; the host should request a rebirth.
4. Host Application publishes its `STATE` (online/offline) so edge nodes know whether to buffer. Newer Sparkplug versions use a JSON payload on `spBv1.0/STATE/<host_id>`.
5. Rebirth: host writes the `Node Control/Rebirth` metric via NCMD.

## Field notes
- Payload is Protobuf; do not hand-write JSON for Sparkplug topics.
- Keep metric names stable; renames create new points in the host.
- Use QoS 1 for births and data; set a Keep Alive just below the cellular NAT timeout.
- Use TLS (8883) and per-device credentials; do not leave broker 1883 open.
- Sparkplug payload compression is optional and not always supported by the host; benchmark on your own data rather than assuming a ratio.
