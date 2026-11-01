-- Template for documenting points exported from AVEVA Geo SCADA (adapt to your export).
CREATE TABLE point (id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT CHECK(type IN ('Internal','Advanced','Simple')), outstation TEXT, address INTEGER, unit TEXT, scale_lo REAL, scale_hi REAL, historic TEXT);
CREATE TABLE outstation (name TEXT PRIMARY KEY, protocol TEXT, ip TEXT, apn TEXT);
