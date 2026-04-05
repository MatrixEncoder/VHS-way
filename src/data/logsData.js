/**
 * E.C.H.O. Division — System Log Database
 * Archive export: LOG_DUMP_1987-10-14_FULL.txt
 * WARNING: Some entries contain encoding errors. Do not attempt manual repair.
 *
 * // HIDDEN: 5345454b2053494758414c20534556454e // (hex encoded: SEEK SIGNAL SEVEN)
 */

export const logsData = [
  // ── SYSTEM STARTUP ──
  { id: 'L001', time: '1987-10-14 06:00:01', level: 'SYS',   msg: 'ECHO DIVISION ARCHIVE TERMINAL v2.1 — INITIALIZING', corrupted: false },
  { id: 'L002', time: '1987-10-14 06:00:02', level: 'SYS',   msg: 'Memory check ... OK (32 MB)', corrupted: false },
  { id: 'L003', time: '1987-10-14 06:00:03', level: 'SYS',   msg: 'Storage array check ... OK (14.2 TB active)', corrupted: false },
  { id: 'L004', time: '1987-10-14 06:00:04', level: 'SYS',   msg: 'Network handshake ... [CENTRAL RELAY — CONNECTED]', corrupted: false },
  { id: 'L005', time: '1987-10-14 06:00:08', level: 'INFO',  msg: 'Site 7 systems nominal. All units active.', corrupted: false },
  { id: 'L006', time: '1987-10-14 06:00:09', level: 'INFO',  msg: 'Recording units: 12 ONLINE  0 OFFLINE  0 STANDBY', corrupted: false },
  { id: 'L007', time: '1987-10-14 06:00:11', level: 'INFO',  msg: 'Personnel check: 47 authorized / 47 present', corrupted: false },

  // ── MORNING ──
  { id: 'L008', time: '1987-10-14 07:01:55', level: 'INFO',  msg: 'Batch 11 orientation commenced — Conference Room A', corrupted: false },
  { id: 'L009', time: '1987-10-14 07:22:04', level: 'INFO',  msg: 'Recording ECH-S7-001 initiated by UNIT-04', corrupted: false },
  { id: 'L010', time: '1987-10-14 07:26:18', level: 'WARN',  msg: 'ECH-S7-001 — Unexpected recording termination at 00:04:12. Buffer not flushed.', corrupted: false },
  { id: 'L011', time: '1987-10-14 07:26:19', level: 'DEBUG', msg: 'UNIT-04 output code: 0x44455354 (unknown)', corrupted: false },
  { id: 'L012', time: '1987-10-14 07:26:20', level: 'WARN',  msg: 'UNIT-04 offline — attempting restart...', corrupted: false },
  { id: 'L013', time: '1987-10-14 07:26:44', level: 'INFO',  msg: 'UNIT-04 restart ... OK', corrupted: false },

  { id: 'L014', time: '1987-10-14 08:00:00', level: 'INFO',  msg: 'Perimeter sweep initiated — all sectors', corrupted: false },
  { id: 'L015', time: '1987-10-14 08:55:31', level: 'INFO',  msg: 'Recording ECH-S7-002 initiated by AUTO-CAM SECTOR-E', corrupted: false },
  { id: 'L016', time: '1987-10-14 08:58:14', level: 'WARN',  msg: 'Anomalous signature detected — grid E-7 — magnitude: 0.004 Hz offset', corrupted: false },
  { id: 'L017', time: '1987-10-14 08:58:14', level: 'WARN',  msg: 'SEC-CAM-3 (SECTOR-E) signal lost — failover to backup...', corrupted: false },
  { id: 'L018', time: '1987-10-14 08:58:22', level: 'ERROR', msg: 'SEC-CAM-3 failover FAILED — backup unit unresponsive', corrupted: false },
  { id: 'L019', time: '1987-10-14 08:58:23', level: 'DEBUG', msg: '▒▒▒░▒▒▒░░░▒▒▒░▒▒░░▒▒▒░░▒▒▒ // SIGNAL LOSS AT NODE E-7', corrupted: true },

  // ── SEPARATOR ──
  { id: 'SEP1', type: 'separator', label: 'INCIDENT — 1987-10-14 MORNING SHIFT' },

  { id: 'L020', time: '1987-10-14 09:31:00', level: 'INFO',  msg: 'Recording ECH-S7-003 initiated — CONF-CAM / RM 12', corrupted: false },
  { id: 'L021', time: '1987-10-14 09:31:01', level: 'WARN',  msg: 'Audio track separation detected on ECH-S7-003. Writing to secondary buffer.', corrupted: false },
  { id: 'L022', time: '1987-10-14 09:31:02', level: 'WARN',  msg: 'Secondary audio buffer unretrievable — secondary medium not mounted.', corrupted: false },
  { id: 'L023', time: '1987-10-14 09:44:12', level: 'INFO',  msg: 'ECH-S7-003 recording complete.', corrupted: false },
  { id: 'L024', time: '1987-10-14 09:44:13', level: 'WARN',  msg: 'ECH-S7-003 checksum mismatch: expected 9C3F2A11 — actual 000000FF', corrupted: false },

  { id: 'L025', time: '1987-10-14 10:00:00', level: 'INFO',  msg: 'Lab B — ASSESSMENT SESSION initiated for Subject 11', corrupted: false },
  { id: 'L026', time: '1987-10-14 10:14:47', level: 'INFO',  msg: 'Recording ECH-S7-004 initiated by MED-CAM / LAB B', corrupted: false },
  { id: 'L027', time: '1987-10-14 10:14:48', level: 'DEBUG', msg: 'Subject 11 — biometrics attached at session start. Biometrics not stored.', corrupted: false },
  { id: 'L028', time: '1987-10-14 10:36:20', level: 'ERROR', msg: 'ECH-S7-004 — 22:14 of video data missing from file. Sector map shows zeros.', corrupted: false },
  { id: 'L029', time: '1987-10-14 10:36:21', level: 'ERROR', msg: 'Write error code: 0x███████ (READ RESTRICTED)', corrupted: true },
  { id: 'L030', time: '1987-10-14 10:36:22', level: 'DEBUG', msg: 'MED-CAM / LAB B — thermal variance:  ░░░░░░░░  ERROR reading sensor data', corrupted: true },

  // ── SEPARATOR ──
  { id: 'SEP2', type: 'separator', label: 'INCIDENT — 1987-10-14 MIDMORNING' },

  { id: 'L031', time: '1987-10-14 11:00:00', level: 'INFO',  msg: 'BROADCAST — scheduled internal announcement, Main Channel', corrupted: false },
  { id: 'L032', time: '1987-10-14 11:00:00', level: 'INFO',  msg: 'Recording ECH-S7-005 initiated by BROADCAST/MAIN', corrupted: false },
  { id: 'L033', time: '1987-10-14 11:03:07', level: 'ERROR', msg: 'BROADCAST signal interrupted — external interference on frequency 87.3 MHz', corrupted: false },
  { id: 'L034', time: '1987-10-14 11:03:08', level: 'ERROR', msg: 'Broadcast origin rerouted — incoming signal detected from OUTSIDE SITE PERIMETER', corrupted: false },
  { id: 'L035', time: '1987-10-14 11:03:09', level: 'WARN',  msg: 'Attempting to identify external transmitter... FAILED', corrupted: false },
  { id: 'L036', time: '1987-10-14 11:03:10', level: 'DEBUG', msg: '▒░▒▒░░░▒░▒▒░░▒░░▒▒░░░▒▒▒░░▒░ // PARTIAL DECODE: ...do not... ...station... ...eleven...', corrupted: true },
  { id: 'L037', time: '1987-10-14 11:03:14', level: 'INFO',  msg: 'Recording ECH-S7-005 halted at 00:03:14 by override.', corrupted: false },

  { id: 'L038', time: '1987-10-14 11:15:00', level: 'WARN',  msg: 'Personnel accounting discrepancy detected. Initiating secondary headcount.', corrupted: false },
  { id: 'L039', time: '1987-10-14 11:15:41', level: 'WARN',  msg: 'Secondary headcount: 44 personnel located. Expected: 47. Delta: -3.', corrupted: false },
  { id: 'L040', time: '1987-10-14 11:15:42', level: 'WARN',  msg: 'Missing IDs: ████-A, ████-B, ████-C (names READ RESTRICTED)', corrupted: false },

  // ── SEPARATOR ──
  { id: 'SEP3', type: 'separator', label: 'INCIDENT — 1987-10-14 EVACUATION' },

  { id: 'L041', time: '1987-10-14 11:30:00', level: 'ERROR', msg: 'EVACUATION PROTOCOL INITIATED — authority: CENTRAL COMMAND', corrupted: false },
  { id: 'L042', time: '1987-10-14 11:30:01', level: 'SYS',   msg: 'Non-essential systems: SHUTDOWN', corrupted: false },
  { id: 'L043', time: '1987-10-14 11:30:01', level: 'SYS',   msg: 'Recording systems: OVERRIDE — CONTINUE', corrupted: false },
  { id: 'L044', time: '1987-10-14 11:34:22', level: 'INFO',  msg: 'Recording ECH-S7-006 initiated by EXIT-CAM / GATE A', corrupted: false },
  { id: 'L045', time: '1987-10-14 11:40:18', level: 'WARN',  msg: 'Evacuation complete. Head count at gate: 31. Authorized personnel: 47. Delta: -16.', corrupted: false },
  { id: 'L046', time: '1987-10-14 11:40:19', level: 'ERROR', msg: 'Personnel accountability: FAILED. 16 individuals UNACCOUNTED FOR.', corrupted: false },
  { id: 'L047', time: '1987-10-14 11:40:20', level: 'DEBUG', msg: '16 personnel ID lookup: ACCESS DENIED — clearance insufficient', corrupted: false },
  { id: 'L048', time: '1987-10-14 11:40:21', level: 'ERROR', msg: 'Re-entry to recover unaccounted personnel: DENIED BY CENTRAL COMMAND', corrupted: false },
  { id: 'L049', time: '1987-10-14 11:45:00', level: 'SYS',   msg: 'Site 7 perimeter lock initiated. All entry points sealed.', corrupted: false },

  { id: 'L050', time: '1987-10-14 11:58:03', level: 'ERROR', msg: 'UNEXPECTED SIGNAL — recording initiated from inside Site 7 after lockdown', corrupted: false },
  { id: 'L051', time: '1987-10-14 11:58:03', level: 'ERROR', msg: 'Recording ECH-S7-007 — SOURCE UNIT: UNIDENTIFIED', corrupted: false },
  { id: 'L052', time: '1987-10-14 11:58:04', level: 'ERROR', msg: 'No authorized recording equipment remained inside Site 7 at time of this entry.', corrupted: false },
  { id: 'L053', time: '1987-10-14 11:58:05', level: 'DEBUG', msg: '░▒▒░░░░░▒░░▒▒▒░░░▒░▒▒░░░░░▒░ // DECODE: ...still here... ...eleven...', corrupted: true },

  // ── SEPARATOR ──
  { id: 'SEP4', type: 'separator', label: 'INCIDENT — 1987-10-14 FINAL ENTRIES' },

  { id: 'L054', time: '1987-10-14 12:00:01', level: 'SYS',   msg: 'Site 7 telemetry: TERMINATED', corrupted: false },
  { id: 'L055', time: '1987-10-14 12:00:02', level: 'SYS',   msg: 'Archive sync to CENTRAL: FAILED — relay offline', corrupted: false },
  { id: 'L056', time: '1987-10-14 12:00:03', level: 'SYS',   msg: 'Local archive write: COMPLETE', corrupted: false },
  { id: 'L057', time: '1987-10-14 12:00:04', level: 'SYS',   msg: 'Terminal hibernating...', corrupted: false },
  { id: 'L058', time: '████-██-██ ██:██:██', level: 'ERROR', msg: '▒▒▒▒▒▒▒▒░▒▒░░░▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░', corrupted: true },
  { id: 'L059', time: '████-██-██ ██:██:██', level: 'SYS',   msg: 'ARCHIVE RECOVERY MODE — initiated by unknown process', corrupted: false },
  { id: 'L060', time: '████-██-██ ██:██:██', level: 'SYS',   msg: 'This terminal has been accessed 1 time since hibernation.', corrupted: false },
  { id: 'L061', time: '████-██-██ ██:██:██', level: 'WARN',  msg: 'Current operator: UNVERIFIED', corrupted: false },
  { id: 'L062', time: '████-██-██ ██:██:██', level: 'WARN',  msg: 'If you are reading this — Subject 11 is not contained. Do not look for the signal.', corrupted: false },
]
