/* global SillyTavern, toastr */

const EXTENSION_FOLDER = 'third-party/Marvel-Nexus';
const SETTINGS_KEY = 'marvel_nexus';
const METADATA_KEY = 'marvel_nexus_state';
const PROMPT_KEY = 'marvel_nexus_roleplay_state';
const PATCH_PATTERNS = [
  /\[MARVEL_NEXUS_PATCH\]([\s\S]*?)\[\/MARVEL_NEXUS_PATCH\]/gi,
  /<!--\s*MARVEL_NEXUS_PATCH\s*([\s\S]*?)\s*MARVEL_NEXUS_PATCH\s*-->/gi,
];

const DEFAULT_SETTINGS = Object.freeze({
  enabled: true,
  showLauncher: true,
  aiSync: true,
  injectState: true,
  language: 'auto',
  motion: 'full',
  density: 'compact',
});

const COPY = {
  en: {
    title: 'Marvel Nexus', subtitle: 'Multiverse Operations Interface', close: 'Close',
    status: 'Status', intel: 'Intel', missions: 'Missions', world: 'World', archive: 'Archive',
    operator: 'Operator', identity: 'Identity Record', edit: 'Edit', name: 'Name', alias: 'Alias', role: 'Role', origin: 'Origin', affiliation: 'Affiliation', condition: 'Condition', location: 'Location',
    vitals: 'Vital Record', health: 'Health', energy: 'Energy', abilities: 'Abilities', mastery: 'Mastery', integrity: 'Suit Integrity', fatigue: 'Fatigue',
    contacts: 'Known Contacts', relationships: 'Relationships and compartmentalized knowledge', trust: 'Trust', suspicion: 'Suspicion', respect: 'Respect', fear: 'Fear', knowledge: 'Knowledge', unknown: 'Unknown', suspected: 'Suspected', confirmed: 'Confirmed',
    secretIdentity: 'Identity Security', civilianIdentity: 'Civilian Identity', publicIdentity: 'Public Identity', exposure: 'Exposure', secrecy: 'Secrecy', witnesses: 'Identity Witnesses', noWitnesses: 'No confirmed identity exposure.',
    factions: 'Faction Intelligence', reputation: 'Reputation', hostility: 'Hostility', awareness: 'Awareness', influence: 'Influence', noFactions: 'No discovered faction intelligence.',
    evidenceBoard: 'Investigation Board', facts: 'Facts', theories: 'Theories', contradictions: 'Contradictions', confidence: 'Confidence', links: 'Connected records', noEvidence: 'No evidence has been discovered.',
    dossier: 'Open dossier', characterLife: 'Character Life', activeForm: 'Active form', lifeStatus: 'Life status', relationship: 'Relationship', source: 'Source', nearby: 'Nearby contacts',
    activeMissions: 'Active Missions', objectives: 'Objectives', hiddenObjective: 'Classified objective', reward: 'Reward', deadline: 'Deadline', threat: 'Threat', consequences: 'Consequences', successOutcome: 'On success', failureOutcome: 'On failure', noMissions: 'No active missions are recorded.',
    liveWorld: 'Live Timeline', currentTime: 'Current Time', continuity: 'Continuity', multiverse: 'Multiverse', currentPosition: 'Current Position', advanceTime: 'Advance time', incidents: 'Live Incidents', travel: 'Travel State', destination: 'Destination', eta: 'ETA', previousLocation: 'Previous location', timelineLedger: 'Continuity Ledger', continuityAlerts: 'Continuity Alerts', noTimeline: 'No confirmed timeline events.', noAlerts: 'No continuity conflicts detected.',
    anomalyMonitor: 'Multiverse Anomaly Monitor', originEarth: 'Origin Earth', currentEarth: 'Current Earth', incursionRisk: 'Incursion risk', variants: 'Known variants', noAnomalies: 'No discovered multiverse anomalies.',
    index: 'Knowledge Index', discoveredOnly: 'Player-discovered records only', noArchive: 'No archive records have been discovered.',
    editIdentity: 'Edit Identity', universeSettings: 'Universe Settings', earth: 'Earth designation', timeline: 'Timeline', cancel: 'Cancel', save: 'Save', apply: 'Apply',
    timeTitle: 'Queue time advancement', timeHelp: 'This request will be batched with your next main-chat message. The AI will resolve consequences and update the Nexus state in that same reply.', amount: 'Amount', unit: 'Unit', minutes: 'Minutes', hours: 'Hours', days: 'Days', queue: 'Queue for next message', pending: 'Pending for next message', queued: 'Time request queued for your next main-chat message.',
    waiting: 'Waiting for chat', ready: 'Nexus synchronized', checking: 'Checking role-play reply', updated: 'Nexus state updated', unchanged: 'No confirmed state changes', disabled: 'AI synchronization is off', openChat: 'Open a chat to use Marvel Nexus.',
    settingsIntro: 'A persistent Marvel role-play interface linked to the active chat.', enabled: 'Enable Marvel Nexus', showLauncher: 'Show the launcher in the wand menu', aiSync: 'Update from normal role-play replies', injectState: 'Include the current Nexus state in prompts', language: 'Language / ภาษา', motion: 'Interface motion', motionFull: 'Full', motionReduced: 'Reduced', motionOff: 'Off', density: 'Mobile density', compact: 'Compact', comfortable: 'Comfortable', syncExplanation: 'Marvel Nexus uses the normal AI reply. It does not make a second generation request. Confirmed changes are returned as a hidden, validated patch and saved only to the current chat.', openNexus: 'Open Marvel Nexus', resetChat: "Reset this chat's Nexus state", resetConfirm: "Reset Marvel Nexus data for this chat? This cannot be undone.", resetDone: 'The current chat state was reset.',
  },
  th: {
    title: 'Marvel Nexus', subtitle: 'อินเทอร์เฟซปฏิบัติการพหุจักรวาล', close: 'ปิด',
    status: 'สถานะ', intel: 'ข่าวกรอง', missions: 'ภารกิจ', world: 'โลก', archive: 'คลังข้อมูล',
    operator: 'ผู้ปฏิบัติการ', identity: 'ข้อมูลประจำตัว', edit: 'แก้ไข', name: 'ชื่อ', alias: 'สมญานาม', role: 'บทบาท', origin: 'ต้นกำเนิด', affiliation: 'สังกัด', condition: 'สภาพ', location: 'ตำแหน่ง',
    vitals: 'ข้อมูลชีวภาพ', health: 'พลังชีวิต', energy: 'พลังงาน', abilities: 'ความสามารถ', mastery: 'ความชำนาญ', integrity: 'ความสมบูรณ์ของชุด', fatigue: 'ความเหนื่อยล้า',
    contacts: 'ผู้ติดต่อที่รู้จัก', relationships: 'ความสัมพันธ์และข้อมูลที่แต่ละคนรับรู้', trust: 'ความไว้ใจ', suspicion: 'ความสงสัย', respect: 'ความนับถือ', fear: 'ความกลัว', knowledge: 'ข้อมูลที่รับรู้', unknown: 'ไม่ทราบ', suspected: 'สงสัย', confirmed: 'ยืนยันแล้ว',
    secretIdentity: 'ความปลอดภัยของตัวตน', civilianIdentity: 'ตัวตนพลเรือน', publicIdentity: 'ตัวตนสาธารณะ', exposure: 'ระดับการเปิดเผย', secrecy: 'สถานะความลับ', witnesses: 'ผู้ที่รู้ตัวตนจริง', noWitnesses: 'ยังไม่มีการยืนยันว่าตัวตนถูกเปิดเผย',
    factions: 'ข่าวกรองฝ่ายต่าง ๆ', reputation: 'ชื่อเสียง', hostility: 'ความเป็นศัตรู', awareness: 'การรับรู้', influence: 'อิทธิพล', noFactions: 'ยังไม่มีข่าวกรองฝ่ายที่ค้นพบแล้ว',
    evidenceBoard: 'กระดานสืบสวน', facts: 'ข้อเท็จจริง', theories: 'ทฤษฎี', contradictions: 'ข้อขัดแย้ง', confidence: 'ความมั่นใจ', links: 'ข้อมูลที่เชื่อมโยง', noEvidence: 'ยังไม่พบหลักฐาน',
    dossier: 'เปิดแฟ้มตัวละคร', characterLife: 'Character Life', activeForm: 'ร่างปัจจุบัน', lifeStatus: 'สถานะชีวิต', relationship: 'ความสัมพันธ์', source: 'แหล่งข้อมูล', nearby: 'ผู้ติดต่อใกล้เคียง',
    activeMissions: 'ภารกิจที่ดำเนินอยู่', objectives: 'เป้าหมาย', hiddenObjective: 'เป้าหมายลับ', reward: 'รางวัล', deadline: 'กำหนดเวลา', threat: 'ระดับภัยคุกคาม', consequences: 'ผลกระทบ', successOutcome: 'เมื่อสำเร็จ', failureOutcome: 'เมื่อล้มเหลว', noMissions: 'ยังไม่มีภารกิจที่กำลังดำเนินอยู่',
    liveWorld: 'ไทม์ไลน์ปัจจุบัน', currentTime: 'เวลาปัจจุบัน', continuity: 'ความต่อเนื่อง', multiverse: 'พหุจักรวาล', currentPosition: 'ตำแหน่งปัจจุบัน', advanceTime: 'เลื่อนเวลา', incidents: 'เหตุการณ์ที่กำลังเกิดขึ้น', travel: 'สถานะการเดินทาง', destination: 'จุดหมาย', eta: 'เวลาถึงโดยประมาณ', previousLocation: 'ตำแหน่งก่อนหน้า', timelineLedger: 'บันทึกความต่อเนื่อง', continuityAlerts: 'คำเตือนความต่อเนื่อง', noTimeline: 'ยังไม่มีเหตุการณ์ในไทม์ไลน์ที่ยืนยันแล้ว', noAlerts: 'ไม่พบความขัดแย้งของเนื้อเรื่อง',
    anomalyMonitor: 'ระบบตรวจจับความผิดปกติพหุจักรวาล', originEarth: 'จักรวาลต้นทาง', currentEarth: 'จักรวาลปัจจุบัน', incursionRisk: 'ความเสี่ยง Incursion', variants: 'Variant ที่พบแล้ว', noAnomalies: 'ยังไม่พบความผิดปกติพหุจักรวาล',
    index: 'ดัชนีความรู้', discoveredOnly: 'แสดงเฉพาะข้อมูลที่ผู้เล่นค้นพบแล้ว', noArchive: 'ยังไม่พบข้อมูลในคลัง',
    editIdentity: 'แก้ไขข้อมูลประจำตัว', universeSettings: 'ตั้งค่าจักรวาล', earth: 'รหัส Earth', timeline: 'ไทม์ไลน์', cancel: 'ยกเลิก', save: 'บันทึก', apply: 'นำไปใช้',
    timeTitle: 'จัดคิวเลื่อนเวลา', timeHelp: 'คำขอนี้จะถูกรวมกับข้อความถัดไปในแชตหลัก AI จะประมวลผลผลกระทบและอัปเดต Nexus ในคำตอบเดียวกัน', amount: 'จำนวน', unit: 'หน่วย', minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', queue: 'จัดคิวสำหรับข้อความถัดไป', pending: 'รอข้อความถัดไป', queued: 'จัดคิวคำขอเลื่อนเวลาไว้สำหรับข้อความถัดไปแล้ว',
    waiting: 'กำลังรอแชต', ready: 'Nexus เชื่อมต่อแล้ว', checking: 'กำลังตรวจคำตอบโรลเพลย์', updated: 'อัปเดตสถานะ Nexus แล้ว', unchanged: 'ไม่มีข้อมูลที่ยืนยันให้เปลี่ยนแปลง', disabled: 'ปิดการซิงก์กับ AI อยู่', openChat: 'เปิดแชตก่อนใช้งาน Marvel Nexus',
    settingsIntro: 'อินเทอร์เฟซโรลเพลย์ Marvel แบบถาวรที่เชื่อมกับแชตปัจจุบัน', enabled: 'เปิดใช้งาน Marvel Nexus', showLauncher: 'แสดงปุ่มเปิดในเมนูคทา', aiSync: 'อัปเดตจากคำตอบโรลเพลย์ปกติ', injectState: 'ใส่สถานะ Nexus ปัจจุบันในพรอมต์', language: 'ภาษา / Language', motion: 'การเคลื่อนไหวของ UI', motionFull: 'เต็มรูปแบบ', motionReduced: 'ลดลง', motionOff: 'ปิด', density: 'ความหนาแน่นบนมือถือ', compact: 'กระชับ', comfortable: 'สบายตา', syncExplanation: 'Marvel Nexus ใช้คำตอบปกติของ AI และไม่เรียกสร้างคำตอบครั้งที่สอง การเปลี่ยนแปลงที่ยืนยันแล้วจะกลับมาเป็นแพตช์ที่ซ่อนอยู่ ผ่านการตรวจสอบ และบันทึกเฉพาะแชตปัจจุบัน', openNexus: 'เปิด Marvel Nexus', resetChat: 'รีเซ็ตสถานะ Nexus ของแชตนี้', resetConfirm: 'รีเซ็ตข้อมูล Marvel Nexus ของแชตนี้หรือไม่ การดำเนินการนี้ย้อนกลับไม่ได้', resetDone: 'รีเซ็ตสถานะของแชตปัจจุบันแล้ว',
  },
};

let initialized = false;
let menuObserver = null;
let previousFocused = null;
let pendingSave = Promise.resolve();
let selectedContact = '';
let selectedArchive = '';
let activeTabIndex = 0;
let contactRenderToken = 0;
const contactPortraitCache = new Map();
const modalCloseTimers = new WeakMap();

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const text = (value, fallback = '', max = 240) => typeof value === 'string' ? value.trim().slice(0, max) : fallback;
const number = (value, fallback = 0, min = 0, max = 999999) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Number(value))) : fallback;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const context = () => SillyTavern.getContext();

function currentPersonaName() {
  try { return text(context()?.name1, 'User', 100) || 'User'; }
  catch { return 'User'; }
}

function defaultState() {
  const personaName = currentPersonaName();
  return {
    version: 2,
    personaName,
    operator: { name: personaName, alias: 'Unassigned', role: 'Independent Operative', origin: 'Unknown', affiliation: 'Unaffiliated', condition: 'Stable', location: 'Unknown', earth: 'Earth-616', continuity: 'Hybrid', timeline: 'Open Chronicle' },
    identity: { secrecy: 'Protected', exposure: 0, publicStatus: 'Unknown' },
    vitals: { health: 1000, healthMax: 1000, energy: 800, energyMax: 800, suitIntegrity: 100, fatigue: 0 },
    powers: [], contacts: [], identityWitnesses: [], factions: [], evidence: [], missions: [],
    world: { date: 'Unconfirmed', time: 'Unconfirmed', multiverse: 'Restricted', locationPath: ['Unknown'], previousLocation: '', travelStatus: 'Stationary', destination: '', eta: '', nearbyContacts: [], incidents: [] },
    timelineEvents: [], continuityIssues: [], anomalies: [],
    archive: [], pendingActions: [], updatedAt: '', updateSource: 'default',
  };
}

function normalizeItem(item, type) {
  if (!item || typeof item !== 'object') return null;
  const id = text(item.id, uid(), 80);
  if (type === 'power') return { id, name: text(item.name, 'Unknown ability', 100), description: text(item.description, '', 300), mastery: number(item.mastery, 0, 0, 100) };
  if (type === 'contact') return { id, name: text(item.name, 'Unknown contact', 100), meta: text(item.meta, '', 140), status: text(item.status, 'Unknown', 60), location: text(item.location, '', 160), relationship: text(item.relationship, '', 120), trust: number(item.trust, 0, 0, 100), suspicion: number(item.suspicion, 0, 0, 100), respect: number(item.respect, 0, 0, 100), fear: number(item.fear, 0, 0, 100), knowledge: Array.isArray(item.knowledge) ? item.knowledge.map(entry => ({ label: text(entry?.label, '', 140), state: ['unknown', 'suspected', 'confirmed'].includes(entry?.state) ? entry.state : 'unknown', source: text(entry?.source, '', 100), learnedAt: text(entry?.learnedAt, '', 100) })).filter(entry => entry.label).slice(0, 20) : [] };
  if (type === 'witness') return { id, name: text(item.name, 'Unknown', 120), kind: ['person', 'faction', 'public'].includes(item.kind) ? item.kind : 'person', level: ['suspected', 'confirmed'].includes(item.level) ? item.level : 'suspected', evidence: text(item.evidence, '', 240) };
  if (type === 'faction') return { id, name: text(item.name, 'Unknown faction', 120), stance: text(item.stance, 'Neutral', 80), reputation: number(item.reputation, 0, -100, 100), hostility: number(item.hostility, 0, 0, 100), awareness: number(item.awareness, 0, 0, 100), influence: number(item.influence, 0, 0, 100), detail: text(item.detail, '', 300) };
  if (type === 'evidence') return { id, title: text(item.title, 'Unknown evidence', 140), kind: ['fact', 'theory', 'contradiction'].includes(item.kind) ? item.kind : 'fact', detail: text(item.detail, '', 500), confidence: number(item.confidence, 0, 0, 100), links: Array.isArray(item.links) ? item.links.map(value => text(value, '', 120)).filter(Boolean).slice(0, 12) : [], discoveredAt: text(item.discoveredAt, '', 100) };
  if (type === 'mission') return { id, title: text(item.title, 'Untitled mission', 140), issuer: text(item.issuer, '', 100), description: text(item.description, '', 400), status: text(item.status, 'Active', 60), threat: text(item.threat, 'Unrated', 40), deadline: text(item.deadline, '', 100), successConsequence: text(item.successConsequence, '', 300), failureConsequence: text(item.failureConsequence, '', 300), linkedFaction: text(item.linkedFaction, '', 120), linkedLocation: text(item.linkedLocation, '', 160), linkedContacts: Array.isArray(item.linkedContacts) ? item.linkedContacts.map(value => text(value, '', 120)).filter(Boolean).slice(0, 12) : [], reward: text(item.reward, '', 180), objectives: Array.isArray(item.objectives) ? item.objectives.map(entry => ({ text: text(entry?.text ?? entry, '', 180), done: Boolean(entry?.done), hidden: Boolean(entry?.hidden), revealed: entry?.revealed !== false })).filter(entry => entry.text).slice(0, 16) : [] };
  if (type === 'incident') return { id, title: text(item.title, 'Unknown incident', 140), detail: text(item.detail, '', 240), threat: text(item.threat, 'C', 12), eta: text(item.eta, '', 40) };
  if (type === 'timeline') return { id, title: text(item.title, 'Timeline event', 140), detail: text(item.detail, '', 500), date: text(item.date, '', 80), time: text(item.time, '', 80), earth: text(item.earth, '', 80), location: text(item.location, '', 160), type: text(item.type, 'Event', 60), impact: text(item.impact, '', 240) };
  if (type === 'continuity') return { id, title: text(item.title, 'Continuity alert', 140), detail: text(item.detail, '', 400), severity: ['low', 'medium', 'high', 'critical'].includes(item.severity) ? item.severity : 'medium', status: text(item.status, 'Open', 60), related: Array.isArray(item.related) ? item.related.map(value => text(value, '', 120)).filter(Boolean).slice(0, 10) : [] };
  if (type === 'anomaly') return { id, title: text(item.title, 'Unknown anomaly', 140), type: text(item.type, 'Anomaly', 80), originEarth: text(item.originEarth, 'Unknown', 80), currentEarth: text(item.currentEarth, 'Unknown', 80), risk: number(item.risk, 0, 0, 100), status: text(item.status, 'Observed', 80), detail: text(item.detail, '', 400), variants: Array.isArray(item.variants) ? item.variants.map(value => text(value, '', 120)).filter(Boolean).slice(0, 16) : [] };
  if (type === 'archive') return { id, title: text(item.title, 'Unknown record', 140), category: text(item.category, 'Record', 80), detail: text(item.detail, '', 500) };
  return null;
}

function normalize(source = {}, base = defaultState()) {
  const out = structuredClone(base);
  const personaName = currentPersonaName();
  const previousPersonaName = text(source.personaName, out.personaName || personaName, 100);
  out.personaName = personaName;
  const operator = source.operator && typeof source.operator === 'object' ? source.operator : {};
  for (const key of Object.keys(out.operator)) out.operator[key] = text(operator[key], out.operator[key], key === 'name' ? 100 : 160);
  const savedOperatorName = text(operator.name, '', 100);
  if (!savedOperatorName || /^(?:unregistered operator|user|player)$/i.test(savedOperatorName) || savedOperatorName === previousPersonaName) {
    out.operator.name = personaName;
  }
  const identity = source.identity && typeof source.identity === 'object' ? source.identity : {};
  out.identity.secrecy = text(identity.secrecy, out.identity.secrecy, 80);
  out.identity.exposure = number(identity.exposure, out.identity.exposure, 0, 100);
  out.identity.publicStatus = text(identity.publicStatus, out.identity.publicStatus, 100);
  const vitals = source.vitals && typeof source.vitals === 'object' ? source.vitals : {};
  out.vitals.healthMax = number(vitals.healthMax, out.vitals.healthMax, 1, 999999);
  out.vitals.energyMax = number(vitals.energyMax, out.vitals.energyMax, 1, 999999);
  out.vitals.health = number(vitals.health, out.vitals.health, 0, out.vitals.healthMax);
  out.vitals.energy = number(vitals.energy, out.vitals.energy, 0, out.vitals.energyMax);
  out.vitals.suitIntegrity = number(vitals.suitIntegrity, out.vitals.suitIntegrity, 0, 100);
  out.vitals.fatigue = number(vitals.fatigue, out.vitals.fatigue, 0, 100);
  for (const [key, type, cap] of [['powers', 'power', 20], ['contacts', 'contact', 60], ['identityWitnesses', 'witness', 60], ['factions', 'faction', 40], ['evidence', 'evidence', 100], ['missions', 'mission', 40], ['timelineEvents', 'timeline', 120], ['continuityIssues', 'continuity', 60], ['anomalies', 'anomaly', 60], ['archive', 'archive', 100]]) {
    if (Array.isArray(source[key])) out[key] = source[key].map(item => normalizeItem(item, type)).filter(Boolean).slice(0, cap);
  }
  const world = source.world && typeof source.world === 'object' ? source.world : {};
  out.world.date = text(world.date, out.world.date, 80);
  out.world.time = text(world.time, out.world.time, 80);
  out.world.multiverse = text(world.multiverse, out.world.multiverse, 80);
  out.world.locationPath = Array.isArray(world.locationPath) ? world.locationPath.map(value => text(value, '', 100)).filter(Boolean).slice(0, 8) : out.world.locationPath;
  out.world.previousLocation = text(world.previousLocation, out.world.previousLocation, 160);
  out.world.travelStatus = text(world.travelStatus, out.world.travelStatus, 80);
  out.world.destination = text(world.destination, out.world.destination, 160);
  out.world.eta = text(world.eta, out.world.eta, 80);
  out.world.nearbyContacts = Array.isArray(world.nearbyContacts) ? world.nearbyContacts.map(value => text(value, '', 120)).filter(Boolean).slice(0, 20) : out.world.nearbyContacts;
  out.world.incidents = Array.isArray(world.incidents) ? world.incidents.map(item => normalizeItem(item, 'incident')).filter(Boolean).slice(0, 30) : out.world.incidents;
  out.pendingActions = Array.isArray(source.pendingActions) ? source.pendingActions.map(action => ({ id: text(action?.id, uid(), 80), type: action?.type === 'advance_time' ? 'advance_time' : '', amount: number(action?.amount, 1, 1, 9999), unit: ['minutes', 'hours', 'days'].includes(action?.unit) ? action.unit : 'minutes', totalMinutes: number(action?.totalMinutes, 1, 1, 999999), queuedAt: text(action?.queuedAt, '', 60) })).filter(action => action.type).slice(-10) : [];
  out.updatedAt = text(source.updatedAt, out.updatedAt, 60);
  out.updateSource = text(source.updateSource, out.updateSource, 40);
  return out;
}

function getSettings() {
  const store = context().extensionSettings;
  store[SETTINGS_KEY] = { ...DEFAULT_SETTINGS, ...(store[SETTINGS_KEY] || {}) };
  return store[SETTINGS_KEY];
}

function language() {
  const setting = getSettings().language;
  if (setting === 'th' || setting === 'en') return setting;
  return /^th\b/i.test(document.documentElement.lang || navigator.language || '') ? 'th' : 'en';
}
const tr = key => COPY[language()][key] || COPY.en[key] || key;

function getState() {
  if (!context().getCurrentChatId?.()) return defaultState();
  return normalize(context().chatMetadata?.[METADATA_KEY] || {});
}

async function persistState(candidate, source = 'manual') {
  if (!context().getCurrentChatId?.()) { notify('warning', tr('openChat')); return false; }
  const state = normalize(candidate, getState());
  state.updatedAt = new Date().toISOString();
  state.updateSource = source;
  context().chatMetadata[METADATA_KEY] = state;
  updatePrompt(state);
  render(state);
  pendingSave = pendingSave.catch(() => undefined).then(() => context().saveMetadata());
  await pendingSave;
  return true;
}

function notify(type, message) {
  if (typeof toastr !== 'undefined' && typeof toastr[type] === 'function') toastr[type](message, 'Marvel Nexus');
  else console[type === 'error' ? 'error' : 'info'](`[Marvel Nexus] ${message}`);
}

function aiState(state) {
  return {
    activePersonaName: currentPersonaName(),
    operator: state.operator, identity: state.identity, identityWitnesses: state.identityWitnesses, vitals: state.vitals,
    powers: state.powers.map(({ id, name, mastery }) => ({ id, name, mastery })),
    contacts: state.contacts.slice(0, 30), factions: state.factions.slice(0, 30), evidence: state.evidence.slice(-40), missions: state.missions,
    world: state.world, timelineEvents: state.timelineEvents.slice(-30), continuityIssues: state.continuityIssues.slice(-20), anomalies: state.anomalies.slice(-20), archive: state.archive.slice(-30), pendingActions: state.pendingActions,
  };
}

function hasUserReply() {
  return context().chat?.some(message => message?.is_user && !message.is_system && text(message.mes));
}

function promptInstructions(state) {
  const personaName = currentPersonaName();
  return [
    '<marvel_nexus_state>',
    `The active SillyTavern user persona is ${JSON.stringify(personaName)}. This exact person is the player/operator. Use that name in narration and machine updates; never replace it with User, Player, Operator, or a placeholder.`,
    'This is the canonical Marvel role-play interface state. Preserve it unless the current normal role-play reply confirms a change.',
    JSON.stringify(aiState(state)),
    'After the visible role-play reply, append exactly one machine block whenever this reply confirms any state change OR pendingActions is non-empty. This block is required for confirmed changes:',
    '[MARVEL_NEXUS_PATCH]{"ops":[["set","identity.exposure",35],["upsert","timelineEvents",{"id":"event-id","title":"...","date":"...","earth":"Earth-616"}]],"ackActions":["action-id"],"summary":"Short update"}[/MARVEL_NEXUS_PATCH]',
    'Allowed scalar paths: operator.name, operator.alias, operator.role, operator.origin, operator.affiliation, operator.condition, operator.location, operator.earth, operator.continuity, operator.timeline, identity.secrecy, identity.exposure, identity.publicStatus, vitals.health, vitals.healthMax, vitals.energy, vitals.energyMax, vitals.suitIntegrity, vitals.fatigue, world.date, world.time, world.multiverse, world.locationPath, world.previousLocation, world.travelStatus, world.destination, world.eta, world.nearbyContacts.',
    'Allowed collection paths with upsert or delete: powers, contacts, identityWitnesses, factions, evidence, missions, world.incidents, timelineEvents, continuityIssues, anomalies, archive. Preserve an existing id when updating it. For new items, provide a short stable id; if omitted, Marvel Nexus will derive one from the item identity.',
    'Collection item shapes: contacts {id,name,meta,status,location,relationship,trust,suspicion,respect,fear,knowledge:[{label,state:unknown|suspected|confirmed,source,learnedAt}]}; identityWitnesses {id,name,kind:person|faction|public,level:suspected|confirmed,evidence}; factions {id,name,stance,reputation:-100..100,hostility,awareness,influence,detail}; evidence {id,title,kind:fact|theory|contradiction,detail,confidence,links,discoveredAt}; missions {id,title,issuer,description,status,threat,deadline,successConsequence,failureConsequence,linkedFaction,linkedLocation,linkedContacts,objectives:[{text,done,hidden,revealed}],reward}; timelineEvents {id,title,detail,date,time,earth,location,type,impact}; continuityIssues {id,title,detail,severity:low|medium|high|critical,status,related}; anomalies {id,title,type,originEarth,currentEarth,risk,status,detail,variants}. Percent fields use 0..100.',
    'Allowed verbs are set, inc, upsert, delete. Record only outcomes confirmed by this completed reply; never record plans, questions, failed attempts, hypotheticals, or information hidden from the player.',
    'Evaluate every system once from this reply: identity exposure and who knows it; status/vitals/abilities; each NPC relationship and compartmentalized knowledge; faction reputation/hostility/awareness/influence; discovered facts/theories/contradictions; mission deadlines, threat, consequences and revealed objectives; travel/location/nearby contacts; timeline events and continuity conflicts; incidents; discovered multiverse anomalies/variants/incursion risk; archive facts.',
    'Knowledge isolation is mandatory. An NPC or faction may only act on information its contact.knowledge entries confirm or information witnessed in the current scene. Never leak the player identity, powers, inventory, mission, location, timeline, relationships, or other NPC secrets across knowledge boundaries.',
    'Only store evidence, timeline records, anomalies, variants, faction intelligence and archive records already discovered by the player. A hidden mission objective may be stored with hidden:true and revealed:false, but do not render or expose it in visible narration until revealed by the story.',
    'For every pending advance_time action, narratively process the requested passage of time, update world.date/world.time and any consequences supported by the story, then copy that action id into ackActions. Do not acknowledge an action you did not process.',
    'Health and energy are controlled by story context only. Never ask for manual damage, energy, or recovery controls.',
    'Keep the patch compact. Never show the patch, schema, full state, Markdown fence, or system explanation in visible text.',
    '</marvel_nexus_state>',
  ].join('\n');
}

function updatePrompt(state = getState()) {
  const settings = getSettings();
  const active = settings.enabled && context().getCurrentChatId?.() && hasUserReply() && (settings.aiSync || settings.injectState);
  context().setExtensionPrompt(PROMPT_KEY, active ? promptInstructions(state) : '', 1, 1, false, 0);
}

const ALLOWED_SCALARS = new Set([
  'operator.name', 'operator.alias', 'operator.role', 'operator.origin', 'operator.affiliation', 'operator.condition', 'operator.location', 'operator.earth', 'operator.continuity', 'operator.timeline',
  'identity.secrecy', 'identity.exposure', 'identity.publicStatus',
  'vitals.health', 'vitals.healthMax', 'vitals.energy', 'vitals.energyMax', 'vitals.suitIntegrity', 'vitals.fatigue',
  'world.date', 'world.time', 'world.multiverse', 'world.locationPath', 'world.previousLocation', 'world.travelStatus', 'world.destination', 'world.eta', 'world.nearbyContacts',
]);
const COLLECTIONS = { powers: 'power', contacts: 'contact', identityWitnesses: 'witness', factions: 'faction', evidence: 'evidence', missions: 'mission', 'world.incidents': 'incident', timelineEvents: 'timeline', continuityIssues: 'continuity', anomalies: 'anomaly', archive: 'archive' };

function setPath(target, path, value) {
  const parts = path.split('.');
  let cursor = target;
  for (let index = 0; index < parts.length - 1; index++) cursor = cursor[parts[index]];
  cursor[parts.at(-1)] = value;
}
function getPath(target, path) { return path.split('.').reduce((cursor, key) => cursor?.[key], target); }

function applyPatch(state, patch) {
  const next = structuredClone(state);
  let accepted = 0;
  for (const operation of Array.isArray(patch?.ops) ? patch.ops.slice(0, 100) : []) {
    if (!Array.isArray(operation) || operation.length < 3) continue;
    const [verb, path, value] = operation;
    if ((verb === 'set' || verb === 'inc') && ALLOWED_SCALARS.has(path)) {
      if (verb === 'inc' && typeof getPath(next, path) === 'number' && Number.isFinite(Number(value))) setPath(next, path, getPath(next, path) + Number(value));
      else if (verb === 'set' && (typeof value === 'string' || typeof value === 'number' || (['world.locationPath', 'world.nearbyContacts'].includes(path) && Array.isArray(value)))) setPath(next, path, value);
      else continue;
      accepted++;
    } else if ((verb === 'upsert' || verb === 'delete') && COLLECTIONS[path]) {
      const collection = getPath(next, path);
      if (!Array.isArray(collection)) continue;
      const identity = text(value?.name || value?.title, '', 140).toLocaleLowerCase();
      let id = text(value?.id ?? (typeof value === 'string' ? value : ''), '', 80);
      let index = id ? collection.findIndex(item => item.id === id) : -1;
      if (index < 0 && identity) index = collection.findIndex(item => text(item?.name || item?.title, '', 140).toLocaleLowerCase() === identity);
      if (!id && index >= 0) id = collection[index].id;
      if (!id && verb === 'upsert' && identity) id = `${path.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}-${identity.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 45) || uid()}`;
      if (!id) continue;
      if (verb === 'delete') { if (index >= 0) { collection.splice(index, 1); accepted++; } continue; }
      const normalized = normalizeItem({ ...(index >= 0 ? collection[index] : {}), ...value, id }, COLLECTIONS[path]);
      if (!normalized) continue;
      if (index >= 0) collection[index] = normalized; else collection.push(normalized);
      accepted++;
    }
  }
  const acknowledged = new Set(Array.isArray(patch?.ackActions) ? patch.ackActions.map(id => text(id, '', 80)).filter(Boolean) : []);
  if (acknowledged.size) next.pendingActions = next.pendingActions.filter(action => !acknowledged.has(action.id));
  return { next: normalize(next, state), accepted, acknowledged: acknowledged.size };
}

function extractPatch(message) {
  const patches = [];
  let visible = String(message);
  for (const pattern of PATCH_PATTERNS) {
    pattern.lastIndex = 0;
    visible = visible.replace(pattern, (_match, payload) => {
      try { const parsed = JSON.parse(payload.trim().replace(/^```(?:json)?\s*|\s*```$/gi, '')); if (parsed && typeof parsed === 'object') patches.push(parsed); }
      catch (error) { console.warn('[Marvel Nexus] Ignored malformed patch.', error); }
      return '';
    });
  }
  visible = visible.trimEnd();
  if (!patches.length) return { visible, found: false, patch: null };
  return { visible, found: true, patch: { ops: patches.flatMap(item => Array.isArray(item.ops) ? item.ops : []).slice(0, 100), ackActions: patches.flatMap(item => Array.isArray(item.ackActions) ? item.ackActions : []).slice(0, 20), summary: patches.map(item => text(item.summary, '', 200)).filter(Boolean).join('; ') } };
}

async function processAssistantPatch(messageId, generationType = '') {
  if (['first_message', 'quiet', 'impersonate'].includes(generationType) || !Number.isInteger(messageId) || !hasUserReply()) return;
  const message = context().chat?.[messageId];
  if (!message || message.is_user || message.is_system || typeof message.mes !== 'string') return;
  if (!getSettings().enabled || !getSettings().aiSync) { setSync('disabled'); return; }
  setSync('checking');
  const extracted = extractPatch(message.mes);
  if (!extracted.found) { setSync('unchanged'); return; }
  message.mes = extracted.visible;
  if (Array.isArray(message.swipes) && Number.isInteger(message.swipe_id) && message.swipes[message.swipe_id] !== undefined) message.swipes[message.swipe_id] = extracted.visible;
  const { next, accepted, acknowledged } = applyPatch(getState(), extracted.patch);
  if (accepted || acknowledged) { await persistState(next, 'inline-patch'); setSync('updated'); }
  else setSync('unchanged');
}

function interfaceMarkup() {
  return `
  <section id="marvel-nexus-overlay" class="mn-overlay" aria-hidden="true">
    <div class="mn-ambient" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <header class="mn-header">
      <div class="mn-brand"><img src="scripts/extensions/third-party/Marvel-Nexus/assets/holographic.gif" alt=""><div><p data-t="subtitle"></p><h1 data-t="title"></h1></div></div>
      <div class="mn-header-actions"><span id="mn-sync" class="mn-sync"></span><button id="mn-universe-button" class="mn-icon-button" type="button" aria-label="Universe settings"><i class="fa-solid fa-globe"></i></button><button id="mn-close" class="mn-icon-button" type="button" data-t-title="close"><i class="fa-solid fa-xmark"></i></button></div>
    </header>
    <main class="mn-content">
      <section id="mn-page-status" class="mn-page is-active" data-page="status">
        <div class="mn-status-top"><span id="mn-earth" class="mn-code"></span></div>
        <article class="mn-panel mn-identity">
          <div class="mn-panel-head"><h3 data-t="identity"></h3><button id="mn-edit-profile" class="mn-text-button" type="button" data-t="edit"></button></div>
          <div class="mn-identity-grid" id="mn-identity-grid"></div>
        </article>
        <article class="mn-panel mn-security-panel"><div class="mn-panel-head"><h3 data-t="secretIdentity"></h3><span id="mn-secrecy" class="mn-badge"></span></div><div id="mn-identity-security"></div><div id="mn-identity-witnesses" class="mn-chip-list"></div></article>
        <div class="mn-divider"><span data-t="vitals"></span></div>
        <article class="mn-vitals" id="mn-vitals"></article>
        <article class="mn-panel"><div class="mn-panel-head"><h3 data-t="abilities"></h3><span id="mn-condition" class="mn-badge"></span></div><div id="mn-powers" class="mn-powers"></div><div id="mn-secondary" class="mn-secondary"></div></article>
      </section>
      <section id="mn-page-intel" class="mn-page" data-page="intel" hidden><div class="mn-page-title"><div><small data-t="intel"></small><h2 data-t="contacts"></h2><p data-t="relationships"></p></div></div><div class="mn-split"><article class="mn-panel"><div id="mn-contact-list" class="mn-list"></div></article><article class="mn-panel" id="mn-contact-detail"></article></div><div class="mn-divider"><span data-t="factions"></span></div><div id="mn-faction-list" class="mn-card-grid"></div><div class="mn-divider"><span data-t="evidenceBoard"></span></div><div id="mn-evidence-board" class="mn-evidence-board"></div></section>
      <section id="mn-page-missions" class="mn-page" data-page="missions" hidden><div class="mn-page-title"><div><small data-t="missions"></small><h2 data-t="activeMissions"></h2></div></div><div id="mn-mission-list" class="mn-stack"></div></section>
      <section id="mn-page-world" class="mn-page" data-page="world" hidden><div class="mn-page-title"><div><small data-t="world"></small><h2 data-t="liveWorld"></h2></div></div><div id="mn-world-stats" class="mn-world-stats"></div><article class="mn-panel"><div class="mn-panel-head"><h3 data-t="currentPosition"></h3><button id="mn-advance-time" class="mn-primary-button" type="button" data-t="advanceTime"></button></div><div id="mn-location-path" class="mn-location-path"></div><div id="mn-travel-state" class="mn-travel-state"></div><div id="mn-nearby-contacts" class="mn-chip-list"></div><div id="mn-pending-actions"></div></article><article class="mn-panel"><div class="mn-panel-head"><h3 data-t="incidents"></h3></div><div id="mn-incidents" class="mn-stack"></div></article><div class="mn-divider"><span data-t="timelineLedger"></span></div><div id="mn-timeline-ledger" class="mn-timeline-ledger"></div><article class="mn-panel mn-alert-panel"><div class="mn-panel-head"><h3 data-t="continuityAlerts"></h3></div><div id="mn-continuity-alerts" class="mn-stack"></div></article><div class="mn-divider"><span data-t="anomalyMonitor"></span></div><div id="mn-anomaly-list" class="mn-card-grid"></div></section>
      <section id="mn-page-archive" class="mn-page" data-page="archive" hidden><div class="mn-page-title"><div><small data-t="archive"></small><h2 data-t="index"></h2><p data-t="discoveredOnly"></p></div></div><article class="mn-panel"><div id="mn-archive-grid" class="mn-archive-grid"></div><div id="mn-archive-detail" class="mn-archive-detail"></div></article></section>
    </main>
    <nav class="mn-tabs" role="tablist">
      ${[['status','heart-pulse'],['intel','user-secret'],['missions','crosshairs'],['world','earth-americas'],['archive','database']].map(([key, icon], index) => `<button type="button" role="tab" data-tab="${key}" aria-selected="${index === 0}"><i class="fa-solid fa-${icon}"></i><span data-t="${key}"></span></button>`).join('')}
    </nav>
    <section id="mn-profile-modal" class="mn-modal" hidden><form class="mn-sheet" id="mn-profile-form"><div class="mn-panel-head"><h3 data-t="editIdentity"></h3><button class="mn-icon-button" type="button" data-modal-close><i class="fa-solid fa-xmark"></i></button></div><div class="mn-form-grid">${['name','alias','role','origin','affiliation'].map(key => `<label><span data-t="${key}"></span><input name="${key}" maxlength="160"></label>`).join('')}</div><div class="mn-modal-actions"><button class="mn-text-button" type="button" data-modal-close data-t="cancel"></button><button class="mn-primary-button" type="submit" data-t="save"></button></div></form></section>
    <section id="mn-universe-modal" class="mn-modal" hidden><form class="mn-sheet" id="mn-universe-form"><div class="mn-panel-head"><h3 data-t="universeSettings"></h3><button class="mn-icon-button" type="button" data-modal-close><i class="fa-solid fa-xmark"></i></button></div><div class="mn-form-grid">${['earth','continuity','timeline'].map(key => `<label><span data-t="${key}"></span><input name="${key}" maxlength="160"></label>`).join('')}</div><div class="mn-modal-actions"><button class="mn-text-button" type="button" data-modal-close data-t="cancel"></button><button class="mn-primary-button" type="submit" data-t="apply"></button></div></form></section>
    <section id="mn-time-modal" class="mn-modal" hidden><form class="mn-sheet mn-time-sheet" id="mn-time-form"><div class="mn-panel-head"><h3 data-t="timeTitle"></h3><button class="mn-icon-button" type="button" data-modal-close><i class="fa-solid fa-xmark"></i></button></div><p data-t="timeHelp"></p><div class="mn-time-fields"><label><span data-t="amount"></span><input name="amount" type="number" inputmode="numeric" min="1" max="9999" value="30" required></label><label><span data-t="unit"></span><select name="unit"><option value="minutes" data-t="minutes"></option><option value="hours" data-t="hours"></option><option value="days" data-t="days"></option></select></label></div><div class="mn-modal-actions"><button class="mn-text-button" type="button" data-modal-close data-t="cancel"></button><button class="mn-primary-button" type="submit" data-t="queue"></button></div></form></section>
  </section>`;
}

function localize(scope = document) {
  scope.querySelectorAll('[data-t]').forEach(element => { element.textContent = tr(element.dataset.t); });
  scope.querySelectorAll('[data-t-title]').forEach(element => { element.title = tr(element.dataset.tTitle); element.setAttribute('aria-label', tr(element.dataset.tTitle)); });
  scope.querySelectorAll('[data-mn-i18n]').forEach(element => { element.textContent = tr(element.dataset.mnI18n); });
}

function buildInterface() {
  if (document.getElementById('marvel-nexus-overlay')) return;
  document.body.insertAdjacentHTML('beforeend', interfaceMarkup());
  const overlay = document.getElementById('marvel-nexus-overlay');
  localize(overlay);
  overlay.querySelector('#mn-close').addEventListener('click', closeInterface);
  overlay.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => showTab(button.dataset.tab)));
  overlay.querySelector('#mn-edit-profile').addEventListener('click', () => openProfile());
  overlay.querySelector('#mn-universe-button').addEventListener('click', () => openUniverse());
  overlay.querySelector('#mn-advance-time').addEventListener('click', () => openModal('mn-time-modal'));
  overlay.querySelectorAll('[data-modal-close]').forEach(button => button.addEventListener('click', () => closeModal(button.closest('.mn-modal'))));
  overlay.querySelectorAll('.mn-modal').forEach(modal => modal.addEventListener('click', event => { if (event.target === modal) closeModal(modal); }));
  overlay.querySelector('#mn-profile-form').addEventListener('submit', saveProfile);
  overlay.querySelector('#mn-universe-form').addEventListener('submit', saveUniverse);
  overlay.querySelector('#mn-time-form').addEventListener('submit', queueTime);
  applyAppearance();
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  window.clearTimeout(modalCloseTimers.get(modal));
  modal.hidden = false;
  modal.classList.remove('is-closing');
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('is-open')));
}
function closeModal(modal) {
  if (!(modal instanceof HTMLElement) || modal.hidden || modal.classList.contains('is-closing')) return;
  modal.classList.remove('is-open');
  modal.classList.add('is-closing');
  const timer = window.setTimeout(() => {
    modal.hidden = true;
    modal.classList.remove('is-closing');
    modalCloseTimers.delete(modal);
  }, getSettings().motion === 'off' ? 0 : 280);
  modalCloseTimers.set(modal, timer);
}
function showTab(key) {
  const tabs = [...document.querySelectorAll('#marvel-nexus-overlay [data-tab]')];
  const nextIndex = Math.max(0, tabs.findIndex(button => button.dataset.tab === key));
  tabs.forEach(button => button.setAttribute('aria-selected', String(button.dataset.tab === key)));
  document.querySelectorAll('#marvel-nexus-overlay .mn-page').forEach(page => {
    const active = page.dataset.page === key;
    page.hidden = !active;
    page.classList.toggle('is-active', active);
    if (!active) page.classList.remove('is-entering');
    else {
      page.dataset.direction = nextIndex < activeTabIndex ? 'back' : 'forward';
      page.classList.remove('is-entering');
      void page.offsetWidth;
      page.classList.add('is-entering');
    }
  });
  activeTabIndex = nextIndex;
}
function openProfile() { const state = getState(); const form = document.getElementById('mn-profile-form'); for (const key of ['name','alias','role','origin','affiliation']) form.elements[key].value = state.operator[key]; openModal('mn-profile-modal'); }
function openUniverse() { const state = getState(); const form = document.getElementById('mn-universe-form'); for (const key of ['earth','continuity','timeline']) form.elements[key].value = state.operator[key]; openModal('mn-universe-modal'); }
async function saveProfile(event) { event.preventDefault(); const state = getState(); for (const key of ['name','alias','role','origin','affiliation']) state.operator[key] = text(event.currentTarget.elements[key].value, state.operator[key], 160); closeModal(event.currentTarget.closest('.mn-modal')); await persistState(state, 'manual'); }
async function saveUniverse(event) { event.preventDefault(); const state = getState(); for (const key of ['earth','continuity','timeline']) state.operator[key] = text(event.currentTarget.elements[key].value, state.operator[key], 160); closeModal(event.currentTarget.closest('.mn-modal')); await persistState(state, 'manual'); }
async function queueTime(event) {
  event.preventDefault();
  if (!context().getCurrentChatId?.()) { notify('warning', tr('openChat')); return; }
  const amount = number(event.currentTarget.elements.amount.value, 1, 1, 9999);
  const unit = event.currentTarget.elements.unit.value;
  const multiplier = { minutes: 1, hours: 60, days: 1440 }[unit] || 1;
  const state = getState();
  state.pendingActions.push({ id: uid(), type: 'advance_time', amount, unit, totalMinutes: amount * multiplier, queuedAt: new Date().toISOString() });
  closeModal(event.currentTarget.closest('.mn-modal'));
  await persistState(state, 'queued-action');
  notify('info', tr('queued'));
}

function metric(label, value, tone = '') { return `<div class="mn-metric"><div><span>${escapeHtml(label)}</span><b>${number(value, 0, 0, 100)}</b></div><i><em style="width:${number(value, 0, 0, 100)}%;${tone ? `--tone:${tone}` : ''}"></em></i></div>`; }

function characterLifeBridge() {
  const bridge = globalThis.CharacterLifeRpgBridge;
  return bridge?.compatibilityVersion >= 3 && typeof bridge.listNpcs === 'function' ? bridge : null;
}
function contactIdentity(value) { return text(value, '', 140).toLocaleLowerCase().replace(/\s+/g, ' '); }
function contactInitials(name) { return text(name, '?', 100).split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2); }
function characterLifeMeta(npc) {
  return [text(npc?.role, '', 80), text(npc?.affiliation, '', 80)].filter(Boolean).join(' · ') || 'Character Life';
}
function characterLifeStatus(npc) {
  if (npc?.isDead || npc?.lifeStatus === 'dead') return 'Deceased';
  return text(npc?.relationshipToUser || npc?.currentState, 'Known', 80);
}
function characterLifeView(npc) {
  const forms = Array.isArray(npc?.forms) ? npc.forms : [];
  const form = forms.find(entry => entry?.id === npc?.activeFormId) || forms[0] || {};
  return {
    activeForm: text(form?.name || form?.title, '', 100),
    lifeStatus: npc?.isDead || npc?.lifeStatus === 'dead' ? 'Deceased' : text(npc?.lifeStatus, 'Alive', 60),
    location: text(npc?.location || npc?.currentLocation || npc?.currentState, '', 160),
    relationship: text(npc?.relationshipToUser, '', 120),
  };
}
function syncedContacts(state) {
  const bridge = characterLifeBridge();
  if (!bridge) return state.contacts;
  let npcs = [];
  try { npcs = bridge.listNpcs({ includeDisabled: false, includeDead: true }) || []; }
  catch (error) { console.warn('[Marvel Nexus] Character Life contact sync was unavailable.', error); return state.contacts; }
  const identityMap = new Map();
  for (const npc of npcs) {
    for (const name of [npc?.name, ...(Array.isArray(npc?.aliases) ? npc.aliases : [])]) {
      const identity = contactIdentity(name);
      if (identity && !identityMap.has(identity)) identityMap.set(identity, npc);
    }
  }
  const used = new Set();
  const contacts = state.contacts.map(contact => {
    const npc = identityMap.get(contactIdentity(contact.name));
    if (!npc) return contact;
    const linkKey = `${npc.scope || 'unknown'}:${npc.id || contactIdentity(npc.name)}`;
    const view = characterLifeView(npc);
    used.add(linkKey);
    return {
      ...contact,
      meta: contact.meta || characterLifeMeta(npc),
      status: contact.status && contact.status !== 'Unknown' ? contact.status : characterLifeStatus(npc),
      location: contact.location || view.location,
      relationship: contact.relationship || view.relationship,
      __characterLife: { id: npc.id || '', scope: npc.scope || '', name: npc.name || contact.name, ...view },
    };
  });
  for (const npc of npcs) {
    const linkKey = `${npc.scope || 'unknown'}:${npc.id || contactIdentity(npc.name)}`;
    if (used.has(linkKey) || !text(npc?.name, '', 100)) continue;
    const view = characterLifeView(npc);
    contacts.push({
      id: `character-life:${linkKey}`,
      name: text(npc.name, 'Unknown contact', 100),
      meta: characterLifeMeta(npc),
      status: characterLifeStatus(npc),
      location: view.location, relationship: view.relationship,
      trust: 0, suspicion: 0, respect: 0, fear: 0, knowledge: [],
      __characterLife: { id: npc.id || '', scope: npc.scope || '', name: npc.name, ...view },
    });
  }
  return contacts;
}
function clearContactPortraitCache() {
  contactRenderToken += 1;
  for (const entry of contactPortraitCache.values()) if (entry.owned && entry.url) URL.revokeObjectURL(entry.url);
  contactPortraitCache.clear();
}
function contactAvatarNode(id) {
  return [...document.querySelectorAll('#mn-contact-list [data-contact-avatar]')].find(element => element.dataset.contactAvatar === id) || null;
}
function applyContactPortrait(id, url) {
  const avatar = contactAvatarNode(id);
  if (!avatar || !url) return;
  const image = document.createElement('img');
  image.alt = '';
  image.decoding = 'async';
  image.src = url;
  avatar.replaceChildren(image);
}
async function hydrateContactPortraits(contacts) {
  const bridge = characterLifeBridge();
  if (!bridge?.capabilities?.portraits || typeof bridge.portrait !== 'function') return;
  const token = ++contactRenderToken;
  await Promise.all(contacts.map(async contact => {
    if (!contact.__characterLife) return;
    const cached = contactPortraitCache.get(contact.id);
    if (cached?.url) { applyContactPortrait(contact.id, cached.url); return; }
    try {
      const portrait = await bridge.portrait({ ...contact.__characterLife, thumbnailSize: 96 });
      if (token !== contactRenderToken || !portrait) return;
      let url = text(portrait.url, '', 4000);
      let owned = false;
      if (!url && portrait.blob instanceof Blob) { url = URL.createObjectURL(portrait.blob); owned = true; }
      if (!url) return;
      contactPortraitCache.set(contact.id, { url, owned, portraitId: text(portrait.portraitId, '', 180) });
      applyContactPortrait(contact.id, url);
    } catch (error) { console.warn(`[Marvel Nexus] Could not load Character Life portrait for ${contact.name}.`, error); }
  }));
}

function render(state = getState()) {
  const root = document.getElementById('marvel-nexus-overlay'); if (!root) return;
  localize(root);
  root.querySelector('#mn-earth').textContent = state.operator.earth;
  root.querySelector('#mn-condition').textContent = state.operator.condition;
  root.querySelector('#mn-identity-grid').innerHTML = ['alias','role','origin','affiliation','location'].map(key => `<div><span>${escapeHtml(tr(key))}</span><strong>${escapeHtml(state.operator[key])}</strong></div>`).join('');
  root.querySelector('#mn-vitals').innerHTML = [['health','healthMax','#ef5865'],['energy','energyMax','#48a8e8']].map(([key,maxKey,tone]) => `<div class="mn-vital"><span class="mn-vital-icon" style="--tone:${tone}">${key === 'health' ? 'HP' : 'EN'}</span><div><label><b>${escapeHtml(tr(key))}</b><strong>${state.vitals[key]} / ${state.vitals[maxKey]}</strong></label><i><em style="width:${state.vitals[key] / state.vitals[maxKey] * 100}%;--tone:${tone}"></em></i></div></div>`).join('');
  root.querySelector('#mn-powers').innerHTML = state.powers.length ? state.powers.map(power => `<div class="mn-power"><div><strong>${escapeHtml(power.name)}</strong><span>${escapeHtml(power.description)}</span></div><b>${power.mastery}%</b><i><em style="width:${power.mastery}%"></em></i></div>`).join('') : `<p class="mn-empty">${escapeHtml(tr('abilities'))}: —</p>`;
  root.querySelector('#mn-secondary').innerHTML = metric(tr('integrity'), state.vitals.suitIntegrity) + metric(tr('fatigue'), state.vitals.fatigue, '#d59f53');
  renderIdentitySecurity(state); renderContacts(state); renderIntelSystems(state); renderMissions(state); renderWorld(state); renderArchive(state); setSync(getSettings().aiSync ? 'ready' : 'disabled');
}

function renderIdentitySecurity(state) {
  const root = document.getElementById('marvel-nexus-overlay');
  root.querySelector('#mn-secrecy').textContent = state.identity.secrecy;
  root.querySelector('#mn-identity-security').innerHTML = `<div class="mn-contact-facts">${[[tr('civilianIdentity'),state.operator.name],[tr('publicIdentity'),state.operator.alias],[tr('secrecy'),state.identity.publicStatus]].map(([label,value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div><div class="mn-security-meter">${metric(tr('exposure'),state.identity.exposure,'#ed5968')}</div>`;
  root.querySelector('#mn-identity-witnesses').innerHTML = state.identityWitnesses.length ? `<b>${escapeHtml(tr('witnesses'))}</b>${state.identityWitnesses.map(item => `<span data-level="${escapeHtml(item.level)}"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(tr(item.level))}${item.evidence ? ` · ${escapeHtml(item.evidence)}` : ''}</small></span>`).join('')}` : `<p class="mn-empty">${escapeHtml(tr('noWitnesses'))}</p>`;
}

function renderIntelSystems(state) {
  const factionTarget = document.getElementById('mn-faction-list');
  factionTarget.innerHTML = state.factions.length ? state.factions.map(faction => `<article class="mn-panel mn-faction-card"><div class="mn-panel-head"><div><h3>${escapeHtml(faction.name)}</h3><small>${escapeHtml(faction.detail)}</small></div><span class="mn-badge">${escapeHtml(faction.stance)}</span></div><div class="mn-metric-grid">${metric(tr('hostility'),faction.hostility,'#ed5968')}${metric(tr('awareness'),faction.awareness,'#d59f53')}${metric(tr('influence'),faction.influence,'#8e79b7')}<div class="mn-metric"><div><span>${escapeHtml(tr('reputation'))}</span><b>${faction.reputation > 0 ? '+' : ''}${faction.reputation}</b></div><i><em style="width:${(faction.reputation + 100) / 2}%;--tone:#50aae6"></em></i></div></div></article>`).join('') : `<article class="mn-panel mn-empty">${escapeHtml(tr('noFactions'))}</article>`;
  const groups = [['fact','facts'],['theory','theories'],['contradiction','contradictions']];
  const evidenceTarget = document.getElementById('mn-evidence-board');
  evidenceTarget.innerHTML = state.evidence.length ? groups.map(([kind,label]) => { const items = state.evidence.filter(item => item.kind === kind); return `<section class="mn-evidence-column" data-kind="${kind}"><h3>${escapeHtml(tr(label))}<span>${items.length}</span></h3>${items.length ? items.map(item => `<article><div><strong>${escapeHtml(item.title)}</strong><b>${item.confidence}%</b></div><p>${escapeHtml(item.detail)}</p>${item.links.length ? `<small>${escapeHtml(tr('links'))}: ${item.links.map(escapeHtml).join(' · ')}</small>` : ''}</article>`).join('') : '<p class="mn-empty">—</p>'}</section>`; }).join('') : `<article class="mn-panel mn-empty">${escapeHtml(tr('noEvidence'))}</article>`;
}

function renderContacts(state) {
  const root = document.getElementById('marvel-nexus-overlay');
  const contacts = syncedContacts(state);
  if (!contacts.some(item => item.id === selectedContact)) selectedContact = contacts[0]?.id || '';
  root.querySelector('#mn-contact-list').innerHTML = contacts.length ? contacts.map(contact => `<button type="button" data-contact="${escapeHtml(contact.id)}" aria-pressed="${contact.id === selectedContact}"><span class="mn-list-avatar" data-contact-avatar="${escapeHtml(contact.id)}"><b>${escapeHtml(contactInitials(contact.name))}</b></span><div><strong>${escapeHtml(contact.name)}</strong><small>${escapeHtml(contact.meta)}</small></div><i></i></button>`).join('') : `<p class="mn-empty">${escapeHtml(tr('contacts'))}: —</p>`;
  root.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => { selectedContact = button.dataset.contact; renderContacts(state); }));
  const contact = contacts.find(item => item.id === selectedContact);
  root.querySelector('#mn-contact-detail').innerHTML = contact ? `<div class="mn-panel-head"><div><h3>${escapeHtml(contact.name)}</h3><small>${escapeHtml(contact.meta)}</small></div><span class="mn-badge">${escapeHtml(contact.status)}</span></div>${contact.__characterLife ? `<div class="mn-source-strip"><span>${escapeHtml(tr('source'))}: ${escapeHtml(tr('characterLife'))}</span><button type="button" class="mn-text-button" data-open-dossier>${escapeHtml(tr('dossier'))}</button></div><div class="mn-contact-facts">${[[tr('relationship'),contact.relationship || '—'],[tr('location'),contact.location || '—'],[tr('lifeStatus'),contact.__characterLife.lifeStatus || '—'],[tr('activeForm'),contact.__characterLife.activeForm || '—']].map(([label,value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div>` : `<div class="mn-source-strip"><span>${escapeHtml(tr('source'))}: Marvel Nexus</span></div>`}<div class="mn-metric-grid">${metric(tr('trust'),contact.trust)}${metric(tr('suspicion'),contact.suspicion,'#d59f53')}${metric(tr('respect'),contact.respect,'#48a8e8')}${metric(tr('fear'),contact.fear,'#9a7de0')}</div><div class="mn-knowledge"><h4>${escapeHtml(tr('knowledge'))}</h4>${contact.knowledge.length ? contact.knowledge.map(item => `<div><span>${escapeHtml(item.label)}${item.source ? `<small>${escapeHtml(item.source)}</small>` : ''}</span><b>${escapeHtml(tr(item.state))}</b></div>`).join('') : '<p class="mn-empty">—</p>'}</div>` : `<p class="mn-empty">${escapeHtml(tr('contacts'))}: —</p>`;
  root.querySelector('[data-open-dossier]')?.addEventListener('click', () => {
    const bridge = characterLifeBridge();
    if (!bridge?.openNpcLibrary) return;
    closeInterface();
    requestAnimationFrame(() => bridge.openNpcLibrary(contact.__characterLife));
  });
  void hydrateContactPortraits(contacts);
}

function renderMissions(state) {
  const target = document.getElementById('mn-mission-list');
  target.innerHTML = state.missions.length ? state.missions.map(mission => { const visibleObjectives = mission.objectives.filter(item => !item.hidden || item.revealed); return `<article class="mn-panel mn-mission"><div class="mn-panel-head"><div><small>${escapeHtml(mission.issuer)}</small><h3>${escapeHtml(mission.title)}</h3></div><span class="mn-badge">${escapeHtml(mission.status)}</span></div><div class="mn-mission-meta">${mission.threat ? `<span><b>${escapeHtml(tr('threat'))}</b>${escapeHtml(mission.threat)}</span>` : ''}${mission.deadline ? `<span><b>${escapeHtml(tr('deadline'))}</b>${escapeHtml(mission.deadline)}</span>` : ''}${mission.linkedFaction ? `<span><b>${escapeHtml(tr('factions'))}</b>${escapeHtml(mission.linkedFaction)}</span>` : ''}${mission.linkedLocation ? `<span><b>${escapeHtml(tr('location'))}</b>${escapeHtml(mission.linkedLocation)}</span>` : ''}</div><p>${escapeHtml(mission.description)}</p><h4>${escapeHtml(tr('objectives'))}</h4><ul>${visibleObjectives.map(item => `<li class="${item.done ? 'is-done' : ''}">${item.hidden ? `<b>${escapeHtml(tr('hiddenObjective'))}</b> ` : ''}${escapeHtml(item.text)}</li>`).join('') || '<li>—</li>'}</ul>${mission.successConsequence || mission.failureConsequence ? `<div class="mn-consequences"><h4>${escapeHtml(tr('consequences'))}</h4>${mission.successConsequence ? `<p><b>${escapeHtml(tr('successOutcome'))}</b>${escapeHtml(mission.successConsequence)}</p>` : ''}${mission.failureConsequence ? `<p><b>${escapeHtml(tr('failureOutcome'))}</b>${escapeHtml(mission.failureConsequence)}</p>` : ''}</div>` : ''}${mission.reward ? `<div class="mn-reward"><span>${escapeHtml(tr('reward'))}</span><strong>${escapeHtml(mission.reward)}</strong></div>` : ''}</article>`; }).join('') : `<article class="mn-panel mn-empty">${escapeHtml(tr('noMissions'))}</article>`;
}

function renderWorld(state) {
  const root = document.getElementById('marvel-nexus-overlay');
  root.querySelector('#mn-world-stats').innerHTML = [[tr('currentTime'),`${state.world.date} · ${state.world.time}`],[tr('continuity'),state.operator.continuity],[tr('multiverse'),state.world.multiverse]].map(([label,value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
  root.querySelector('#mn-location-path').innerHTML = state.world.locationPath.map(value => `<span>${escapeHtml(value)}</span>`).join('<i class="fa-solid fa-chevron-right"></i>');
  root.querySelector('#mn-travel-state').innerHTML = `<div><span>${escapeHtml(tr('travel'))}</span><strong>${escapeHtml(state.world.travelStatus)}</strong></div>${state.world.previousLocation ? `<div><span>${escapeHtml(tr('previousLocation'))}</span><strong>${escapeHtml(state.world.previousLocation)}</strong></div>` : ''}${state.world.destination ? `<div><span>${escapeHtml(tr('destination'))}</span><strong>${escapeHtml(state.world.destination)}</strong></div>` : ''}${state.world.eta ? `<div><span>${escapeHtml(tr('eta'))}</span><strong>${escapeHtml(state.world.eta)}</strong></div>` : ''}`;
  const currentLocation = contactIdentity(state.operator.location || state.world.locationPath[state.world.locationPath.length - 1]);
  const nearby = new Set(state.world.nearbyContacts);
  for (const contact of syncedContacts(state)) if (currentLocation && currentLocation !== 'unknown' && contactIdentity(contact.location) === currentLocation) nearby.add(contact.name);
  root.querySelector('#mn-nearby-contacts').innerHTML = nearby.size ? `<b>${escapeHtml(tr('nearby'))}</b>${[...nearby].map(name => `<span><strong>${escapeHtml(name)}</strong></span>`).join('')}` : '';
  root.querySelector('#mn-pending-actions').innerHTML = state.pendingActions.length ? `<div class="mn-pending"><b>${escapeHtml(tr('pending'))}</b>${state.pendingActions.map(action => `<span>${action.amount} ${escapeHtml(tr(action.unit))}</span>`).join('')}</div>` : '';
  root.querySelector('#mn-incidents').innerHTML = state.world.incidents.length ? state.world.incidents.map(incident => `<div class="mn-incident"><span>${escapeHtml(incident.threat)}</span><div><strong>${escapeHtml(incident.title)}</strong><small>${escapeHtml(incident.detail)}</small></div><b>${escapeHtml(incident.eta)}</b></div>`).join('') : `<p class="mn-empty">—</p>`;
  root.querySelector('#mn-timeline-ledger').innerHTML = state.timelineEvents.length ? [...state.timelineEvents].reverse().map(event => `<article class="mn-timeline-entry"><div><time>${escapeHtml([event.date,event.time].filter(Boolean).join(' · ') || '—')}</time><span>${escapeHtml(event.earth || state.operator.earth)}</span></div><section><small>${escapeHtml(event.type)}</small><h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(event.detail)}</p>${event.impact ? `<b>${escapeHtml(event.impact)}</b>` : ''}</section></article>`).join('') : `<article class="mn-panel mn-empty">${escapeHtml(tr('noTimeline'))}</article>`;
  root.querySelector('#mn-continuity-alerts').innerHTML = state.continuityIssues.length ? state.continuityIssues.map(issue => `<div class="mn-continuity-item" data-severity="${escapeHtml(issue.severity)}"><span>${escapeHtml(issue.severity)}</span><div><strong>${escapeHtml(issue.title)}</strong><p>${escapeHtml(issue.detail)}</p></div><b>${escapeHtml(issue.status)}</b></div>`).join('') : `<p class="mn-empty">${escapeHtml(tr('noAlerts'))}</p>`;
  root.querySelector('#mn-anomaly-list').innerHTML = state.anomalies.length ? state.anomalies.map(anomaly => `<article class="mn-panel mn-anomaly"><div class="mn-panel-head"><div><small>${escapeHtml(anomaly.type)}</small><h3>${escapeHtml(anomaly.title)}</h3></div><span class="mn-badge">${escapeHtml(anomaly.status)}</span></div><div class="mn-anomaly-route"><span>${escapeHtml(anomaly.originEarth)}</span><i class="fa-solid fa-arrow-right"></i><span>${escapeHtml(anomaly.currentEarth)}</span></div>${metric(tr('incursionRisk'),anomaly.risk,'#ed5968')}<p>${escapeHtml(anomaly.detail)}</p>${anomaly.variants.length ? `<div class="mn-chip-list"><b>${escapeHtml(tr('variants'))}</b>${anomaly.variants.map(value => `<span><strong>${escapeHtml(value)}</strong></span>`).join('')}</div>` : ''}</article>`).join('') : `<article class="mn-panel mn-empty">${escapeHtml(tr('noAnomalies'))}</article>`;
}

function renderArchive(state) {
  const root = document.getElementById('marvel-nexus-overlay');
  if (!state.archive.some(item => item.id === selectedArchive)) selectedArchive = state.archive[0]?.id || '';
  root.querySelector('#mn-archive-grid').innerHTML = state.archive.length ? state.archive.map(item => `<button type="button" data-archive="${escapeHtml(item.id)}" aria-pressed="${item.id === selectedArchive}"><i class="fa-solid fa-file-lines"></i><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.category)}</small></span></button>`).join('') : `<p class="mn-empty">${escapeHtml(tr('noArchive'))}</p>`;
  root.querySelectorAll('[data-archive]').forEach(button => button.addEventListener('click', () => { selectedArchive = button.dataset.archive; renderArchive(state); }));
  const item = state.archive.find(entry => entry.id === selectedArchive);
  root.querySelector('#mn-archive-detail').innerHTML = item ? `<small>${escapeHtml(item.category)}</small><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.detail)}</p>` : '';
}

function setSync(mode) {
  const element = document.getElementById('mn-sync'); if (!element) return;
  element.dataset.mode = mode;
  element.textContent = tr(mode);
}
function applyAppearance() {
  const overlay = document.getElementById('marvel-nexus-overlay'); if (!overlay) return;
  overlay.dataset.motion = getSettings().motion;
  overlay.dataset.density = getSettings().density;
}
function openInterface() {
  if (!getSettings().enabled) return;
  buildInterface(); render();
  const overlay = document.getElementById('marvel-nexus-overlay');
  previousFocused = document.activeElement;
  overlay.classList.remove('is-ready');
  overlay.classList.add('is-open'); overlay.setAttribute('aria-hidden', 'false'); document.body.classList.add('marvel-nexus-open');
  void overlay.offsetWidth;
  requestAnimationFrame(() => {
    overlay.classList.add('is-ready');
    window.setTimeout(() => {
      if (overlay.classList.contains('is-open')) showTab(overlay.querySelector('[data-tab][aria-selected="true"]')?.dataset.tab || 'status');
    }, getSettings().motion === 'full' ? 620 : 0);
  });
}
function closeInterface() {
  const overlay = document.getElementById('marvel-nexus-overlay'); if (!overlay?.classList.contains('is-open')) return;
  overlay.querySelectorAll('.mn-modal:not([hidden])').forEach(modal => closeModal(modal));
  overlay.classList.remove('is-open','is-ready'); overlay.setAttribute('aria-hidden','true'); document.body.classList.remove('marvel-nexus-open');
  if (previousFocused instanceof HTMLElement) previousFocused.focus({ preventScroll: true });
}

function syncLauncherVisibility() { const launcher = document.getElementById('marvel-nexus-wand-launcher'); if (launcher) launcher.hidden = !getSettings().showLauncher || !getSettings().enabled; }
function createWandLauncher() {
  if (document.getElementById('marvel-nexus-wand-launcher')) return true;
  const menu = document.getElementById('extensionsMenu'); if (!menu) return false;
  const launcher = document.createElement('div'); launcher.id = 'marvel-nexus-wand-launcher'; launcher.className = 'list-group-item flex-container flexGap5 interactable'; launcher.tabIndex = 0; launcher.setAttribute('role','button'); launcher.innerHTML = '<i class="fa-solid fa-satellite-dish" aria-hidden="true"></i><span>Marvel Nexus</span>';
  const activate = event => { if (event.type === 'keydown' && !['Enter',' '].includes(event.key)) return; event.preventDefault(); openInterface(); };
  launcher.addEventListener('click', activate); launcher.addEventListener('keydown', activate); menu.appendChild(launcher); syncLauncherVisibility(); return true;
}
function observeWandMenu() { if (createWandLauncher() || menuObserver) return; menuObserver = new MutationObserver(() => { if (createWandLauncher()) { menuObserver.disconnect(); menuObserver = null; } }); menuObserver.observe(document.body,{childList:true,subtree:true}); }

function bindCheckbox(id, key, callback) { const input = document.getElementById(id); if (!(input instanceof HTMLInputElement)) return; input.checked = Boolean(getSettings()[key]); input.addEventListener('change', () => { getSettings()[key] = input.checked; context().saveSettingsDebounced(); callback?.(); }); }
function bindSelect(id, key, callback) { const input = document.getElementById(id); if (!(input instanceof HTMLSelectElement)) return; input.value = getSettings()[key]; input.addEventListener('change', () => { getSettings()[key] = input.value; context().saveSettingsDebounced(); callback?.(); }); }
async function addSettingsDrawer() {
  if (document.getElementById('marvel-nexus-settings')) return;
  const container = document.getElementById('extensions_settings2'); if (!container) throw new Error('Extensions settings container not found.');
  container.insertAdjacentHTML('beforeend', await context().renderExtensionTemplateAsync(EXTENSION_FOLDER, 'settings'));
  localize(document.getElementById('marvel-nexus-settings'));
  bindCheckbox('marvel-nexus-enabled','enabled',() => { syncLauncherVisibility(); updatePrompt(); });
  bindCheckbox('marvel-nexus-show-launcher','showLauncher',syncLauncherVisibility);
  bindCheckbox('marvel-nexus-ai-sync','aiSync',updatePrompt);
  bindCheckbox('marvel-nexus-inject-state','injectState',updatePrompt);
  bindSelect('marvel-nexus-language','language',() => { localize(); render(); });
  bindSelect('marvel-nexus-motion','motion',applyAppearance);
  bindSelect('marvel-nexus-density','density',applyAppearance);
  document.getElementById('marvel-nexus-open-settings')?.addEventListener('click',openInterface);
  document.getElementById('marvel-nexus-reset-chat')?.addEventListener('click',async () => { if (!context().getCurrentChatId?.()) return notify('warning',tr('openChat')); if (!window.confirm(tr('resetConfirm'))) return; await persistState(defaultState(),'reset'); notify('success',tr('resetDone')); });
}

function bindChatEvents() {
  const { eventSource, eventTypes } = context();
  eventSource.on(eventTypes.CHAT_CHANGED, () => { selectedContact=''; selectedArchive=''; clearContactPortraitCache(); updatePrompt(); render(); setSync(hasUserReply() ? 'ready' : 'waiting'); });
  if (eventTypes.MESSAGE_SENT) eventSource.on(eventTypes.MESSAGE_SENT, () => { updatePrompt(); if (getSettings().aiSync) setSync('checking'); });
  eventSource.on(eventTypes.MESSAGE_RECEIVED, (messageId,generationType) => processAssistantPatch(messageId,generationType));
  if (eventTypes.CHARACTER_MESSAGE_RENDERED) eventSource.on(eventTypes.CHARACTER_MESSAGE_RENDERED, (messageId,generationType) => processAssistantPatch(messageId,generationType));
  if (eventTypes.MESSAGE_EDITED) eventSource.on(eventTypes.MESSAGE_EDITED, messageId => processAssistantPatch(Number(messageId), 'edit'));
  if (eventTypes.MESSAGE_SWIPED) eventSource.on(eventTypes.MESSAGE_SWIPED, messageId => processAssistantPatch(Number(messageId), 'swipe'));
  if (eventTypes.GENERATION_STARTED) eventSource.on(eventTypes.GENERATION_STARTED, () => updatePrompt());
}

function refreshCharacterLifeContacts() {
  clearContactPortraitCache();
  const state = getState();
  renderContacts(state);
  renderWorld(state);
}

async function initialize() {
  if (initialized) return; initialized = true;
  try {
    getSettings(); buildInterface(); await addSettingsDrawer(); observeWandMenu(); bindChatEvents(); updatePrompt(); render();
    globalThis.addEventListener('character-life:rpg-bridge-ready', refreshCharacterLifeContacts);
    globalThis.addEventListener('character-life:rpg-compatibility-updated', refreshCharacterLifeContacts);
    globalThis.addEventListener('character-life:portrait-replaced', refreshCharacterLifeContacts);
    globalThis.addEventListener('character-life:map-markers-updated', refreshCharacterLifeContacts);
    globalThis.addEventListener('beforeunload', clearContactPortraitCache, { once: true });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const modal = document.querySelector('#marvel-nexus-overlay .mn-modal:not([hidden])');
      if (modal) closeModal(modal); else closeInterface();
    });
    console.info('[Marvel Nexus] Extension v2.0.1 loaded.');
  } catch (error) { initialized = false; console.error('[Marvel Nexus] Failed to initialize.',error); notify('error','Marvel Nexus could not load. Check the browser console.'); }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',initialize,{once:true}); else void initialize();
