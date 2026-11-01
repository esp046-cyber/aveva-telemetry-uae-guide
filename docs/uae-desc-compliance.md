# UAE DESC / NESA compliance checklist (field summary)
Always confirm requirements against current client and authority documents.
- Segregate OT from IT with firewalls and documented rules.
- Disable Telnet, FTP, HTTP and any unused service or port.
- Role-based access, no shared or default accounts, scheduled password rotation.
- Central logging (syslog to SIEM) with NTP time sync.
- Authenticated protocols (DNP3 SAv5, TLS) where supported.
- Backups of configurations and tested restore.
