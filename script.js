const CATS=["AVEVA Database & Driver","DNP3 Field Pitfalls","Modbus RTU & Serial","RTU Hardware & Wiring","UAE Harsh Environment","Cellular & Network","DESC/NESA Cybersecurity","Commissioning SAT/FAT"];
// [category index, title, body, optional code]
const TIPS=[
[0,"Driver stuck at low priority","If a DNP3 or Modbus driver lags during a historic burst, check the Server Status > Driver Tasks list for queue depth before restarting anything. Restarting a driver loses buffered events.","Server Status > Driver > Queue Depth"],
[0,"Validate the database after a hard stop","After a power loss on a standby server, run Database Validation from the Server Configuration Tool before returning it to Main duty.",""],
[0,"Historian growth","Use Compressed historic data with deadbands on slow analogs (tank levels). Raw storage on every point fills disks inside a year at 1 s scan.",""],
[0,"Suppress alarm chatter","Use a Historic Alarm filter plus an on-delay in the point logic so a flapping door switch does not flood the alarm summary.",""],
[1,"Event buffer exhaustion","Link down for hours with Class 1 events at the outstation buffer limit overwrites oldest events. Size buffers for the longest expected outage and confirm Buffer Overflow IIN2.3 is cleared after integrity poll.","IIN bit 2.3 = EVENT_BUFFER_OVERFLOW"],
[1,"Unsolicited response storms","After a comms restore, many outstations send unsolicited at once. Stagger by setting different unsolicited hold-off times per site.",""],
[1,"Serial timeouts over cellular","Radios and cellular add latency. Raise application confirm timeout above round trip x 3; keep it below the poll period.",""],
[1,"Time sync","Use DNP3 Delay Measurement on WAN links, LAN time sync only on local Ethernet. Mixing both causes visible second-level jumps.",""],
[2,"Zero versus one based addressing","A register shown as 40001 in the device manual is offset 0 on the wire. Off-by-one is the most common cause of plausible but wrong values.","40001 -> address 0 (FC03)"],
[2,"No data on RS-485","Swap D+ and D- first (A/B labels differ by vendor). Then check bias resistors at one point only and a 120 ohm terminator at each end of the bus.",""],
[2,"Reflections at 19200 baud and above","Long stubs cause ringing. Keep it a daisy chain, no star wiring, use shielded twisted pair earthed at one end.",""],
[2,"Frame timeout","Modbus RTU frames end after 3.5 character times of silence. At 9600 baud that is about 4 ms; reduce gateway buffering that adds gaps.",""],
[3,"Ground loops on 4-20 mA","Reading drifts when two ends of a loop are earthed. Check the loop for a single earth reference and use isolated input modules where sensors are earthed.",""],
[3,"Surge protector blown after storms","Replace SPDs on both power and signal lines after a nearby strike even if they look fine. Fit status contacts and monitor them.",""],
[3,"Battery sizing for 72 hours","Ah = (load A x 72 h) / (depth of discharge x temp derating). At 50 C derate lead-acid capacity and shorten float life expectation sharply.","Ah = (A * 72) / (0.5 * 0.8)"],
[3,"Scaling with clamps","Clamp scaled analogs to engineering range and raise a separate under-range alarm below 3.8 mA to catch broken wires.",""],
[4,"Panel internal temperature","Summer 52 C ambient plus solar load puts panel interiors above 70 C. Derate power supplies and size sun shields, vortex coolers or insulated dual-skin cabinets.",""],
[4,"Condensation pooling","Fit IP-rated breather drain plugs at the lowest point of the enclosure and keep door seals greased.",""],
[4,"Silica gel schedule","Replace desiccant every 3 months on the coast and every 6 inland.",""],
[4,"Coastal corrosion","In Jumeirah and JAFZA specify conformal-coated boards (Class G3), stainless hardware and sealed cable glands. Avoid mixing copper and aluminum.",""],
[5,"APN registration failure","Confirm SIM is provisioned for the private APN, APN string exactly as given by the carrier, and the SIM is not locked to a different IMEI. Check signal (RSSI/RSRP) first.","AT+CGDCONT? ; AT+CSQ ; AT+CREG?"],
[5,"NAT timeouts","Carrier NAT drops idle sessions in minutes. Send a keep-alive ping or poll more often than the timeout.",""],
[5,"MTU on IPSec","Set tunnel MTU near 1400 and MSS clamp to avoid fragmented DNP3 or Modbus TCP frames.","ping -f -l 1372 <ip>"],
[5,"Dual SIM failover","Use different carriers (e& and du) on primary and backup and test failover during SAT.",""],
[6,"Close unused services","Disable Telnet 23, FTP 21 and HTTP 80 on RTUs. Allow only what the design needs and document it for DESC/NESA review.",""],
[6,"Authenticated DNP3","Use Secure Authentication v5 where outstation firmware supports it; keep a key rotation record.",""],
[6,"Syslog to SIEM","Forward SCADA and firewall logs to the enterprise SIEM in real time and time-sync every device to the same NTP source.",""],
[6,"Role-based access","Separate operator, engineer and admin roles. Remove default accounts and rotate passwords on schedule.",""],
[7,"Point-to-point checks","For each point inject a real or simulated signal at the field terminal and confirm value, units, scaling, alarm limits and historian at the HMI.",""],
[7,"Simulators first","Dry-run with ModScan/ModSim and a DNP3 master simulator before connecting to live plant.",""],
[7,"Sign-off checklist","Record test date, tester, witness, as-found/as-left values and open punch items; get client signature per site.",""],
[7,"Backup before changes","Export the RTU program and the Geo SCADA database before every site visit and label with date.",""],
[1, "Decode DNP3 IIN bits", "IIN1: 0 broadcast, 1 class1 events, 2 class2, 3 class3, 4 NEED_TIME, 5 local control, 6 device trouble, 7 restart. IIN2: 0 no func code, 1 unknown object, 2 bad parameter, 3 event buffer overflow, 4 already executing, 5 config corrupt. IIN1.7 stuck on means the restart was never cleared.", "Wireshark display filter: dnp3.al.iin"],
[1, "Capture DNP3 on the wire", "Capture at the master or a span port, then open in Wireshark. Look for repeated requests with no response (timeout) or responses with CON bit never confirmed.", "tcpdump -i eth0 -nn -w dnp3.pcap tcp port 20000"],
[1, "IEC 104 timers", "Defaults are t1=15 s (ack), t2=10 s (ack delay, must be < t1), t3=20 s (test frame idle). On cellular, raise t1 but keep t3 below the carrier NAT timeout.", "t2 < t1 ; t3 > t1"],
[2, "Decode a Modbus TCP request by hand", "Header is transaction id, protocol id (0), length, then unit id and PDU.", "00 01 00 00 00 06 01 03 00 00 00 0A\n= txn 1, len 6, unit 1, FC03, start 0, qty 10"],
[2, "Check a Modbus RTU frame and CRC", "Frame is address, function, data, CRC (low byte first). If the master shows CRC errors, check baud, parity, and reflections before blaming firmware.", "01 03 00 00 00 0A C5 CD"],
[2, "Measure RS-485 idle bias", "With all drivers idle, measure D+ minus D-. A biased bus should read about 200 mV or more; near 0 V means missing bias and random noise bytes between frames.", "Multimeter DC mV across D+ / D- at idle"],
[3, "4-20 mA percent and fault", "Convert before arguing with a vendor: 4 mA = 0 %, 12 mA = 50 %, 20 mA = 100 %. Under 3.8 mA is a wire break, over 20.5 mA is overrange.", "pct = (mA - 4) / 16 * 100"],
[5, "Quick modem checks over serial", "Check SIM, network registration and attach before touching RTU settings.", "AT+CPIN? ; AT+CSQ ; AT+COPS? ; AT+CREG? ; AT+CGATT?"],
[5, "Find the real tunnel MTU", "Send do-not-fragment pings and reduce size until they pass; set tunnel MTU to that value minus headers.", "Windows: ping -f -l 1372 <ip>\nLinux: ping -M do -s 1372 <ip>"],
[6, "Audit open ports on an RTU (authorised only)", "Scan only with written permission. Compare results to the approved port list and close extras.", "nmap -sT -p 21,23,80,443,502,20000 10.1.1.20"],
[6, "Prove syslog reaches the SIEM", "Send a test message from a jump host, then confirm the SIEM received it with the right source and timestamp.", "logger -n 10.0.0.10 -P 514 -d 'scada-test'"],
[7, "Check time sync during SAT", "Event ordering depends on time. Confirm every server and RTU reports the same NTP source and offset under a second.", "Windows: w32tm /query /status\nLinux: chronyc tracking"],
[0, "Is the driver port listening?", "On the Geo SCADA server, confirm something is bound to the expected port before blaming the RTU. DNP3 over TCP defaults to port 20000.", "netstat -ano | findstr :20000"],
[0, "Check server disk before historian errors", "A full data drive stops historic writes and can stop the database. Watch free space weekly and alarm at 20 percent free.", "fsutil volume diskfree D:"],
[0, "Read the Windows event log after a failover", "Look for service stops, disk and time-change events around the failover time before concluding it was a network fault.", "Get-WinEvent -LogName System -MaxEvents 50 | ft TimeCreated,Id,Message -auto"],
[1, "Polling plan that does not flood a link", "Typical starting plan: Class 1/2/3 event poll every 10 to 60 s, integrity poll every 1 to 24 h, and unsolicited enabled for events. Shorten only on fast links; lengthen on shared cellular.", "event poll 30 s ; integrity poll 3600 s"],
[1, "DNP3 addressing limits", "Link-layer addresses 0 to 65519 are usable; 65520 and above are reserved (65535 is broadcast). Master and outstation addresses must differ and both ends must agree exactly.", "master=1 outstation=10"],
[1, "Stale data after link recovery", "If points show stale after reconnect, force an integrity poll (Class 0 plus events). Do not rely on events alone after a long outage.", ""],
[2, "Read an exception reply", "An exception sets the high bit of the function code. Reply 83 02 means function 03 failed with Illegal Data Address, so the register range is wrong or off by one.", "01 83 02 + CRC"],
[2, "Write a coil (FC05) correctly", "Coil ON is FF 00 and OFF is 00 00. Any other value is rejected by most devices.", "01 05 00 0A FF 00 + CRC"],
[2, "Float word order", "A 32-bit float spans two registers. 100.0 is 0x42C80000, sent as 42C8 0000 (big-endian words) or 0000 42C8 (swapped). If values look absurd, try the other order.", "0x42C80000 = 100.0"],
[2, "Test a Modbus TCP port from a laptop", "Prove the port is reachable before debugging register maps.", "nc -zv 10.1.1.20 502\nTest-NetConnection 10.1.1.20 -Port 502"],
[2, "Serial settings that must match", "Modbus RTU specification default is 8 data bits, even parity, 1 stop bit; many devices ship 8N1 or 8N2. Mismatched parity gives constant CRC errors.", "9600 8E1 vs 9600 8N1"],
[3, "Loop voltage budget", "Supply must exceed transmitter minimum voltage plus the drop across all loop resistance at 20 mA. A 250 ohm input drops 5 V at 20 mA, so a 24 V supply with a 12 V transmitter has about 7 V for cable.", "Vsupply >= Vtx_min + 0.02 * (Rin + Rcable)"],
[3, "Five-point loop check", "Inject 4, 8, 12, 16 and 20 mA with a calibrator at the field terminals and record scaled readings at the HMI. Tolerance is set by the project, commonly 0.25 to 0.5 percent of span.", "4 / 8 / 12 / 16 / 20 mA"],
[4, "Why passive cooling fails at 52 C", "If the panel limit is 60 C and ambient is 52 C, only 8 K of temperature rise is allowed. Internal heat plus solar gain usually exceeds that, so size active cooling or a shade and insulated cabinet.", "dT_allowed = 60 - 52 = 8 K"],
[4, "Battery life in heat", "Lead-acid life roughly halves for every 8 to 10 C above 25 C. In an un-cooled cabinet specify lithium or oversize, and check capacity yearly.", ""],
[4, "Condensation after sunset", "Hot humid air in a sealed cabinet can condense when the metal cools overnight. Use thermostat-controlled heaters or dehumidifying breathers and verify drain plugs are not blocked by sand.", ""],
[5, "Convert AT+CSQ to dBm", "dBm = -113 + 2 x CSQ. CSQ 10 is about -93 dBm; CSQ 99 means not known. For LTE use RSRP: better than -100 dBm is good, worse than -110 dBm is poor.", "AT+CSQ -> +CSQ: 14,99 = -85 dBm"],
[5, "IPsec port check", "IPsec tunnels use UDP 500 and 4500 (NAT traversal) plus ESP. If the tunnel will not come up over cellular, confirm the carrier APN permits these before changing crypto settings.", "UDP 500, UDP 4500, ESP"],
[6, "Check for SMBv1", "Disable legacy SMBv1 on SCADA servers and engineering laptops.", "Get-WindowsOptionalFeature -Online -FeatureName SMB1Protocol"],
[6, "Map zones and conduits", "IEC 62443 groups assets into zones and defines allowed conduits between them. Draw one diagram listing each conduit with protocol, port and direction; this is the base of the firewall rule list.", ""],
[7, "Failover test with timing", "During SAT disconnect the Main server network, record the time until Standby takes over and until all drivers show good data, then restore and record resync. Attach the times to the report.", ""],
[7, "Alarm end-to-end test", "Force each critical alarm at the source, record the time it reaches the HMI, the historian, and any SMS or email path, and sign each as passed.", ""],
[0, "Historian deadband tuning", "Set a deadband per analog from sensor accuracy (e.g. 0.5 percent of span) so noise is not stored. Compare stored counts per day before and after the change.", "SELECT FullName FROM CDBPoint  -- list points, then review deadband per class"],
[0, "Raw vs compressed history", "Use raw only where every sample matters (fiscal meters); use compressed/exception recording elsewhere. Confirm exact options in the Geo SCADA help for your version.", "Review: Point > Historic tab"],
[0, "Historic life cycle plan", "Decide retention per tier (e.g. 1 s data 90 days, 1 min 2 years) and size disks for it with 30 percent spare. Document in the design.", "GB/day = points * samples/day * bytes / 1e9"],
[0, "Archive validation", "After restoring a historian archive, spot-check three points over a known outage window and compare to the trend export before putting it back in service.", ""],
[0, "Backfill after comms loss", "Outstation-buffered events arrive with their original timestamps; confirm the historian accepts back-dated data and check no gap remains.", ""],
[0, "Structured Text scaling block", "Keep scaling and clamping in one tested block rather than copy-pasting per point.", "raw := LIMIT(0.0, (mA-4.0)/16.0*100.0, 100.0);"],
[0, "Structured Text alarm hold-off", "Add an on-delay so short spikes do not raise alarms.", "IF level > hi THEN t := t + 1; ELSE t := 0; END_IF; alarm := (t >= 10);"],
[0, "Suppress alarms during maintenance", "Use one maintenance-mode point per site and gate alarm logic with it, instead of disabling alarms by hand and forgetting them.", "alarm := cond AND NOT maint;"],
[0, "Mimic SQL: select only what you need", "A mimic query that pulls every column of every point slows the client. Name the columns and filter by group.", "SELECT FullName, CurrentValue FROM CDBPoint WHERE FullName LIKE 'Site1.%'"],
[0, "Mimic refresh rate", "Do not refresh heavy queries every second; 5 to 10 s is enough for most tables and cuts server load.", ""],
[0, "Find silent points", "Query for points with old update times to catch dead sensors early (check the exact field name in your schema).", "SELECT FullName FROM CDBPoint WHERE <last-update field> < <now - 1h>"],
[0, "Version control for logic", "Export logic and database changes before each release and store them with a dated name; never edit live logic without a rollback copy.", ""],
[5, "Verify private APN attach", "Confirm the PDP context uses the APN supplied by the carrier and the module gets a private IP.", "AT+CGDCONT=1,\"IP\",\"<apn>\" ; AT+CGPADDR=1"],
[5, "Check the route into the SCADA LAN", "If the RTU attaches but the master cannot reach it, trace from the master side and confirm the carrier's static route or tunnel to your network.", "tracert <rtu-ip>   /   traceroute -n <rtu-ip>"],
[5, "Keep-alive below NAT timeout", "Set keep-alive at roughly half the carrier idle timeout. Linux example:", "sysctl -w net.ipv4.tcp_keepalive_time=60"],
[5, "Windows TCP keep-alive", "Windows servers default to 2 h. Lower it for cellular links (value in ms).", "reg add HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters /v KeepAliveTime /t REG_DWORD /d 60000"],
[5, "GRE overhead", "GRE adds about 24 bytes (20 IP + 4 GRE). Over a 1500 byte link set inner MTU to 1476.", "ip tunnel add g0 mode gre ... mtu 1476"],
[5, "IPsec overhead", "ESP tunnel mode adds roughly 50 to 73 bytes, plus 8 with NAT-T. Start at MTU 1400 and test upward.", "ping -M do -s 1372 <ip>"],
[5, "Capture tunnel traffic", "Check whether the tunnel negotiates and carries data.", "tcpdump -ni eth0 'esp or udp port 500 or udp port 4500 or ip proto 47'"],
[5, "NAT traversal symptoms", "Tunnel up but no data after idle means NAT mapping expired; enable NAT-T keep-alives or dead-peer detection.", ""],
[5, "du vs Etisalat dual path", "Use different carriers and different tunnel endpoints; test failover by removing the primary SIM at SAT and record switch time.", ""],
[5, "Log signal at install", "Record RSSI/RSRP and antenna direction at install in the site sheet so later faults can be compared with a known good value.", "AT+CSQ"],
[6, "List listening services", "Find daemons you did not approve before disabling them.", "ss -tulpn   /   netstat -ano"],
[6, "Disable Telnet on Linux gateways", "Disable it if not on the approved service list, then re-scan to confirm.", "systemctl disable --now telnet.socket"],
[6, "Disable Remote Registry", "Not needed on most SCADA servers.", "sc config RemoteRegistry start= disabled"],
[6, "Enforce TLS 1.2 or higher on Windows", "Disable TLS 1.0 server-side via SCHANNEL; TLS 1.3 needs Windows Server 2022 or later. Test after changing; some old clients will fail.", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.0\\Server\\Enabled=0 (DWORD)"],
[6, "Test TLS 1.3 on a service", "Confirm the negotiated protocol and ciphers.", "openssl s_client -connect host:443 -tls1_3\nnmap --script ssl-enum-ciphers -p 443 host"],
[6, "Syslog RFC 5424 format", "Structured messages carry version, timestamp, host, app, procid, msgid. Send over TCP/TLS (6514) if the SIEM supports it.", "<134>1 2026-11-01T08:00:00+04:00 scada01 geoscada - LOGIN - user=op1 result=fail"],
[6, "Forward Linux logs", "Disable it if not on the approved service list, then re-scan to confirm.", "*.* @@10.0.0.10:6514   (in /etc/rsyslog.d/50-siem.conf)"],
[6, "Account lockout and length", "Set lockout and a minimum length on Windows servers per client policy.", "net accounts /lockoutthreshold:5 /minpwlen:14"],
[6, "Audit logons", "Enable success and failure auditing for logons and review weekly.", "auditpol /set /subcategory:\"Logon\" /success:enable /failure:enable"],
[6, "Role separation", "Operators view and acknowledge; engineers change configuration; admins manage accounts. Review role membership quarterly and log the review.", ""],
[6, "Firewall default deny", "Enable the host firewall on every profile and allow only listed ports.", "netsh advfirewall set allprofiles state on"],
[0, "Check the DB size trend", "Record database and historian folder size monthly; a sudden jump usually means a chattering point or a deadband set to zero.", "dir /s D:\\<historian-folder>   (Windows)"]];
const FILES=["index.html","style.css","script.js","manifest.json","service-worker.js","offline.html","favicon.ico","icon-192.png","icon-512.png","README.md",".gitignore","package.json",".env.example","LICENSE","robots.txt","sitemap.xml","browserconfig.xml","assets/og-image.png","assets/og-image.svg","assets/icons.svg","assets/rs485.svg","assets/loop420.svg","screenshots/mobile.png","tests/app.test.js","docs/dnp3-quick-ref.md","docs/modbus-troubleshooting.md","docs/uae-desc-compliance.md","docs/dnp3-sav5.md","docs/mqtt-sparkplug.md","docs/utility-metering-reference.md","docs/scadapack-hardware-matrix.md","api/sample-points.json","backend/edge_collector.py","database/points_schema.sql","config/rtu_config_template.json"];
const $=s=>document.querySelector(s);
const store={get(){try{return JSON.parse(localStorage.getItem("fav")||"[]")}catch(e){return[]}},set(v){try{localStorage.setItem("fav",JSON.stringify(v))}catch(e){}}};
const TAG=["geo","dnp3","modbus","power","site","cell","sec","comm"],LAB=["Geo SCADA","DNP3","Modbus","Power/Loop","UAE Site","Cellular","Security","Commissioning"];
function searchTips(q,cat,favOnly,favs){q=(q||"").toLowerCase();return TIPS.map((t,i)=>({t,i})).filter(({t,i})=>(cat<0||t[0]===cat)&&(!favOnly||favs.includes(i))&&(t[1]+" "+t[2]+" "+(t[3]||"")+" "+CATS[t[0]]).toLowerCase().includes(q))}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
let cat=-1,tab="all",pad=false,tt;
function toast(){const t=$("#toast");t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),1600)}
async function copy(x){try{await navigator.clipboard.writeText(x)}catch(e){const a=document.createElement("textarea");a.value=x;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(_){}a.remove()}toast()}
function render(){const f=store.get(),saved=tab==="saved",r=searchTips($("#q").value,cat,saved,f);$("#count").textContent=r.length+" of "+TIPS.length+" tips"+(saved?" (bookmarked)":"");
$("#list").innerHTML=r.map(({t,i})=>`<article class="card" data-i="${i}"><button class="hd" aria-expanded="false"><span class="tag t-${TAG[t[0]]}">${LAB[t[0]]}</span><span class="ti">${esc(t[1])}</span><svg class="chev" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></button><div class="bd"><p>${esc(t[2])}</p>${(t[3]||"").split("\n").filter(Boolean).map(l=>`<div class="cb"><code>${esc(l)}</code><button class="cp">Copy</button></div>`).join("")}<button class="sv">${f.includes(i)?"★ Saved":"☆ Save"}</button></div></article>`).join("")||"<p>"+(saved?"No bookmarks yet. Open a tip and tap Save.":"No tips match. Clear the search or filter.")+"</p>"}
function setTab(t){tab=t;document.querySelectorAll(".seg button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===t));const list=t==="all"||t==="saved";$("#v-list").hidden=!list;$("#v-maps").hidden=t!=="maps";$("#v-tools").hidden=t!=="tools";$("#drawer").hidden=!list;if(list)render();scrollTo(0,0)}
function calc(){const base=+$("#mb").value,first=+$("#mf").value||base,n=Math.max(1,Math.min(+$("#mn").value||1,40)),st=pad?4:2,fc=base===30001?"04":"03";let h="<table><tr><th>#</th><th>Listed</th><th>Wire</th><th>Hex</th><th>Read</th></tr>";for(let k=0;k<n;k++){const l=first+k*st,w=l-base;h+=`<tr><td>${k+1}</td><td>${l}</td><td>${w}</td><td>0x${(w<0?0:w).toString(16).toUpperCase().padStart(4,"0")}</td><td>FC${fc} x2</td></tr>`}$("#mo").innerHTML=h+"</table>"}
function fl(){const v=parseFloat($("#fv").value);if(isNaN(v)){$("#fo").textContent="Enter a number";return}const d=new DataView(new ArrayBuffer(4));d.setFloat32(0,v);const a=d.getUint16(0).toString(16).toUpperCase().padStart(4,"0"),b=d.getUint16(2).toString(16).toUpperCase().padStart(4,"0");$("#fo").textContent="ABCD: "+a+" "+b+"   CDAB (word swapped): "+b+" "+a}
function dc(){const w=$("#hw").value.trim().split(/[\s,]+/).map(x=>parseInt(x,16));if(w.length<2||w.some(isNaN)){$("#ho").textContent="Enter two hex words";return}const g=(x,y)=>{const d=new DataView(new ArrayBuffer(4));d.setUint16(0,x);d.setUint16(2,y);return d.getFloat32(0)};$("#ho").textContent="As ABCD: "+g(w[0],w[1])+"   As CDAB: "+g(w[1],w[0])}
function thermal(){const a=+$("#amb").value,p=a+24;$("#ambv").textContent=a;$("#panv").textContent=p;$("#derate").textContent=p>=70?"Derate PSU/CPU now and check cooling.":p>=60?"Watch PSU loading.":"No derating needed."}
function crc(b){let t=crc.t;if(!t){t=crc.t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}}let r=-1;for(const x of b)r=t[(r^x)&255]^(r>>>8);return(r^-1)>>>0}
async function exportZip(){const enc=new TextEncoder(),parts=[],cen=[];let off=0;$("#zs").textContent="Packing...";
let cnt=0;for(const f of FILES){const rs=await fetch(f);if(!rs.ok)continue;cnt++;const d=new Uint8Array(await rs.arrayBuffer()),n=enc.encode(f),c=crc(d);
const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint32(14,c,true);h.setUint32(18,d.length,true);h.setUint32(22,d.length,true);h.setUint16(26,n.length,true);parts.push(h.buffer,n,d);
const e=new DataView(new ArrayBuffer(46));e.setUint32(0,0x02014b50,true);e.setUint16(4,20,true);e.setUint16(6,20,true);e.setUint32(16,c,true);e.setUint32(20,d.length,true);e.setUint32(24,d.length,true);e.setUint16(28,n.length,true);e.setUint32(42,off,true);cen.push(e.buffer,n);off+=30+n.length+d.length}
const cl=cen.reduce((a,b)=>a+b.byteLength,0),z=new DataView(new ArrayBuffer(22));z.setUint32(0,0x06054b50,true);z.setUint16(8,cnt,true);z.setUint16(10,cnt,true);z.setUint32(12,cl,true);z.setUint32(16,off,true);
const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([...parts,...cen,z.buffer],{type:"application/zip"}));a.download="aveva-telemetry-guide.zip";a.click();$("#zs").textContent="Done"}
if(typeof document!=="undefined"&&$("#list")){
$("#chips").innerHTML=["All",...CATS].map((c,i)=>`<button class="chip" aria-pressed="${i===0}" data-c="${i-1}">${c}</button>`).join("");
$("#chips").onclick=e=>{const c=e.target.dataset.c;if(c===undefined)return;cat=+c;document.querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.c===cat));render()};
$("#ft").onclick=()=>{const o=$("#chips").hidden;$("#chips").hidden=!o;$("#ft").setAttribute("aria-expanded",o)};
$("#q").oninput=render;document.querySelector(".seg").onclick=e=>{if(e.target.dataset.tab)setTab(e.target.dataset.tab)};
$("#list").onclick=e=>{const card=e.target.closest(".card");if(!card)return;
if(e.target.closest(".hd")){const o=card.classList.toggle("open");card.querySelector(".hd").setAttribute("aria-expanded",o)}
else if(e.target.classList.contains("cp"))copy(e.target.previousElementSibling.textContent);
else if(e.target.classList.contains("sv")){const i=+card.dataset.i;let f=store.get();f=f.includes(i)?f.filter(x=>x!==i):[...f,i];store.set(f);e.target.textContent=f.includes(i)?"★ Saved":"☆ Save";if(tab==="saved")render()}};
["#mb","#mf","#mn"].forEach(s=>$(s).oninput=calc);$("#mb").onchange=()=>{$("#mf").value=$("#mb").value;calc()};
$("#m2").onclick=$("#m4").onclick=e=>{pad=e.currentTarget.id==="m4";$("#m2").setAttribute("aria-pressed",!pad);$("#m4").setAttribute("aria-pressed",pad);calc()};
$("#fv").oninput=fl;$("#hw").oninput=dc;$("#amb").oninput=thermal;
$("#zip").onclick=()=>exportZip().catch(e=>$("#zs").textContent="Failed: "+e.message);
const net=()=>{document.body.classList.toggle("off",!navigator.onLine);$("#net").textContent=navigator.onLine?"online":"offline (cached)"};addEventListener("online",net);addEventListener("offline",net);net();
calc();fl();thermal();render();if("serviceWorker"in navigator)navigator.serviceWorker.register("service-worker.js")}
