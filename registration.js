let controller = null;
let commandRegistered = false;
let activeStep = 1;
let submitting = false;
let previousFocused = null;
let closeTimer = 0;

const clean = (value, max = 2000) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

const THAI_TEXT = Object.freeze({
  'MARVEL NEXUS // ACCESS NODE': 'MARVEL NEXUS // จุดเชื่อมต่อ', 'ROLE-PLAY REGISTRATION': 'ลงทะเบียนโรลเพลย์', 'PERSONA LINKED:': 'เชื่อมต่อเพอร์โซนา:',
  'Registration sections': 'หมวดการลงทะเบียน', Identity: 'ตัวตน', Abilities: 'ความสามารถ', Reality: 'จักรวาล', 'Role-play': 'โรลเพลย์', Confirm: 'ยืนยัน',
  IDENTITY: 'ตัวตน', ABILITIES: 'ความสามารถ', REALITY: 'จักรวาล', 'ROLE-PLAY': 'โรลเพลย์', CONFIRM: 'ยืนยัน',
  'Age *': 'อายุ *', 'Gender *': 'เพศ *', 'Race / Species *': 'เผ่าพันธุ์ *', Pronouns: 'สรรพนาม', 'Alias / Codename': 'สมญานาม / โค้ดเนม', 'Affiliation *': 'สังกัด *', 'Occupation *': 'อาชีพ *', 'Identity Status': 'สถานะตัวตน',
  'Origin / Power Source *': 'ต้นกำเนิด / แหล่งพลัง *', 'Power Scale': 'ระดับพลัง', 'Current Condition': 'สภาพปัจจุบัน', 'ABILITY MATRIX': 'เมทริกซ์ความสามารถ', 'Add ability': 'เพิ่มความสามารถ', 'Weaknesses / Costs *': 'จุดอ่อน / ต้นทุน *', 'Equipment / Assets': 'อุปกรณ์ / ทรัพย์สิน',
  'Universe Designation *': 'รหัสจักรวาล *', Continuity: 'ความต่อเนื่อง', 'Timeline / Era *': 'ไทม์ไลน์ / ยุค *', 'World / Realm *': 'โลก / ดินแดน *', 'Canon Divergence': 'จุดแตกต่างจากแคนอน', 'World State / Active Crisis *': 'สภาพโลก / วิกฤตปัจจุบัน *', 'Known Factions': 'ฝ่ายที่รู้จัก', 'Known Marvel Relationships': 'ความสัมพันธ์ใน Marvel ที่รู้จัก',
  'Starting Location *': 'ตำแหน่งเริ่มต้น *', 'Starting Time': 'เวลาเริ่มต้น', 'Role-play Tone': 'โทนโรลเพลย์', 'Point of View': 'มุมมอง', 'Canon Handling': 'การจัดการแคนอน', 'Character Control': 'การควบคุมตัวละคร', Appearance: 'รูปลักษณ์', Personality: 'นิสัย', Backstory: 'ประวัติ', 'Opening Situation *': 'สถานการณ์เปิดเรื่อง *', 'Immediate Objective *': 'เป้าหมายทันที *', 'First User Action / Message': 'การกระทำ / ข้อความแรกของผู้ใช้',
  'REGISTRATION LINK READY': 'ลิงก์ลงทะเบียนพร้อม', 'REQUIRED DATA MISSING': 'ข้อมูลที่จำเป็นไม่ครบ', 'READY TO INITIALIZE ROLE-PLAY': 'พร้อมเริ่มต้นโรลเพลย์', Back: 'ย้อนกลับ', Continue: 'ดำเนินการต่อ', 'Confirm registration': 'ยืนยันการลงทะเบียน', Initializing: 'กำลังเริ่มต้น',
  Preset: 'ค่าที่เตรียมไว้', Custom: 'กำหนดเอง', Name: 'ชื่อ', Type: 'ประเภท', Mastery: 'ความชำนาญ', 'Function and Limits *': 'การทำงานและข้อจำกัด *', 'Remove ability': 'ลบความสามารถ',
  Woman: 'หญิง', Man: 'ชาย', 'Non-binary': 'นอนไบนารี', Genderfluid: 'เจนเดอร์ฟลูอิด', Agender: 'ไม่ระบุเพศ', Human: 'มนุษย์', Mutant: 'มิวแทนต์', Inhuman: 'อินฮิวแมน', 'Enhanced human': 'มนุษย์เสริมพลัง', Asgardian: 'ชาวแอสการ์ด', Alien: 'เอเลี่ยน', Android: 'แอนดรอยด์',
  'She/her': 'เธอ', 'He/him': 'เขา', 'They/them': 'พวกเขา', Independent: 'อิสระ', Avengers: 'อเวนเจอร์ส', 'X-Men': 'เอ็กซ์เมน', 'Fantastic Four': 'แฟนแทสติกโฟร์', Student: 'นักเรียน', Vigilante: 'ศาลเตี้ย', Hero: 'ฮีโร่', Agent: 'สายลับ', Scientist: 'นักวิทยาศาสตร์', Mercenary: 'ทหารรับจ้าง',
  'Present day': 'ยุคปัจจุบัน', 'MCU era': 'ยุค MCU', 'Post-apocalyptic': 'หลังวันสิ้นโลก', 'Original era': 'ยุคต้นฉบับ', Earth: 'โลก', Multiverse: 'พหุจักรวาล', 'Alternate reality': 'จักรวาลคู่ขนาน', 'New York City': 'นครนิวยอร์ก', Brooklyn: 'บรูคลิน', Queens: 'ควีนส์', Manhattan: 'แมนฮัตตัน', Wakanda: 'วากานดา', Asgard: 'แอสการ์ด', 'Avengers Tower': 'อเวนเจอร์สทาวเวอร์',
  'Secret identity': 'ตัวตนลับ', 'Known to allies': 'พันธมิตรรู้ตัวตน', 'Public identity': 'ตัวตนสาธารณะ', 'Identity compromised': 'ตัวตนถูกเปิดเผย', 'Street-level': 'ระดับท้องถนน', Enhanced: 'เสริมพลัง', 'Avengers-level': 'ระดับอเวนเจอร์ส', Cosmic: 'ระดับจักรวาล', 'Reality-altering': 'บิดเบือนความจริง', Stable: 'เสถียร', Injured: 'บาดเจ็บ', Exhausted: 'เหนื่อยล้า', 'Power unstable': 'พลังไม่เสถียร', Critical: 'วิกฤต', Power: 'พลัง', Skill: 'ทักษะ', Technology: 'เทคโนโลยี', Magic: 'เวทมนตร์', Untrained: 'ยังไม่ฝึก', Developing: 'กำลังพัฒนา', Proficient: 'ชำนาญ', Mastered: 'เชี่ยวชาญสูงสุด',
  'Marvel Comics canon': 'แคนอน Marvel Comics', 'MCU-inspired': 'อิง MCU', 'Hybrid continuity': 'ความต่อเนื่องแบบผสม', 'Original alternate universe': 'จักรวาลคู่ขนานต้นฉบับ', 'Classic heroic': 'ฮีโร่คลาสสิก', 'Cinematic and tense': 'ภาพยนตร์และตึงเครียด', 'Street-level noir': 'นัวร์ระดับท้องถนน', 'Cosmic adventure': 'ผจญภัยจักรวาล', 'Dark multiverse': 'พหุจักรวาลด้านมืด', 'Second person': 'บุรุษที่สอง', 'Third person limited': 'บุรุษที่สามแบบจำกัด', 'First person': 'บุรุษที่หนึ่ง', 'Strict canon': 'ยึดแคนอนเคร่งครัด', 'Canon-consistent with divergence': 'สอดคล้องแคนอนแต่มีจุดแตกต่าง', 'Flexible canon': 'แคนอนยืดหยุ่น', 'Fully original': 'ต้นฉบับทั้งหมด', 'User controls registered character': 'ผู้ใช้ควบคุมตัวละครที่ลงทะเบียน', 'Shared control': 'ควบคุมร่วมกัน',
  Persona: 'เพอร์โซนา', Age: 'อายุ', Gender: 'เพศ', 'Race / Species': 'เผ่าพันธุ์', Alias: 'สมญานาม', Affiliation: 'สังกัด', Occupation: 'อาชีพ', 'Identity status': 'สถานะตัวตน', 'Origin / Source': 'ต้นกำเนิด / แหล่งพลัง', 'Power scale': 'ระดับพลัง', Condition: 'สภาพ', 'Ability matrix': 'เมทริกซ์ความสามารถ', 'Weaknesses / Costs': 'จุดอ่อน / ต้นทุน', 'Equipment / Assets': 'อุปกรณ์ / ทรัพย์สิน', Universe: 'จักรวาล', 'Timeline / Era': 'ไทม์ไลน์ / ยุค', 'World / Realm': 'โลก / ดินแดน', 'Canon divergence': 'จุดแตกต่างจากแคนอน', 'World state': 'สภาพโลก', 'Known factions': 'ฝ่ายที่รู้จัก', 'Known relationships': 'ความสัมพันธ์ที่รู้จัก', 'Starting location': 'ตำแหน่งเริ่มต้น', 'Starting time': 'เวลาเริ่มต้น', Tone: 'โทน', 'Point of view': 'มุมมอง', 'Canon handling': 'การจัดการแคนอน', 'Character control': 'การควบคุมตัวละคร', 'Opening situation': 'สถานการณ์เปิดเรื่อง', 'Immediate objective': 'เป้าหมายทันที', 'First action / message': 'การกระทำ / ข้อความแรก',
});

function registrationLanguage() { return controller?.language?.() === 'th' ? 'th' : 'en'; }
function regText(english) { return registrationLanguage() === 'th' ? THAI_TEXT[english] || english : english; }

function localizeRegistration() {
  const root = overlay();
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const trimmed = node.nodeValue.trim();
    if (!trimmed && !node.__mnEnglish) continue;
    node.__mnEnglish ||= trimmed;
    const replacement = regText(node.__mnEnglish);
    node.nodeValue = node.nodeValue.replace(trimmed || regText(node.__mnEnglish), replacement);
  }
  root.setAttribute('lang', registrationLanguage());
}

function choiceFieldMarkup(name, label, values, { required = false, max = 160 } = {}) {
  return `<div class="mn-reg-choice" data-reg-choice="${name}" data-choice-mode="preset"><span>${label}</span><div class="mn-reg-choice-mode"><button type="button" data-choice-set="preset" aria-pressed="true">Preset</button><button type="button" data-choice-set="custom" aria-pressed="false">Custom</button></div><select data-choice-preset aria-label="${escapeHtml(label)}" ${required ? 'data-required' : ''}>${values.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('')}</select><input name="${name}" data-choice-custom aria-label="${escapeHtml(label)}" maxlength="${max}" autocomplete="off" ${required ? 'data-required' : ''} hidden></div>`;
}

function registrationMarkup() {
  return `
  <section id="mn-registration-overlay" class="mn-reg" hidden aria-hidden="true">
    <div class="mn-reg-grid" aria-hidden="true"></div>
    <header class="mn-reg-header">
      <div class="mn-reg-brand">
        <small>MARVEL NEXUS // ACCESS NODE</small>
        <h1>ROLE-PLAY REGISTRATION</h1>
      </div>
      <div class="mn-reg-header-right">
        <span><i></i> PERSONA LINKED: <b id="mn-reg-persona"></b></span>
        <button type="button" class="mn-reg-icon" data-reg-close aria-label="Close registration"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </header>

    <nav class="mn-reg-steps" aria-label="Registration sections">
      <button type="button" data-reg-step="1" aria-current="step"><b>01</b><span>Identity</span></button>
      <button type="button" data-reg-step="2"><b>02</b><span>Abilities</span></button>
      <button type="button" data-reg-step="3"><b>03</b><span>Reality</span></button>
      <button type="button" data-reg-step="4"><b>04</b><span>Role-play</span></button>
      <button type="button" data-reg-step="5"><b>05</b><span>Confirm</span></button>
    </nav>
    <div class="mn-reg-progress" aria-hidden="true"><i></i></div>

    <form id="mn-registration-form" class="mn-reg-form" novalidate>
      <main class="mn-reg-main">
        <section class="mn-reg-page" data-reg-page="1">
          <div class="mn-reg-section-code"><span>01</span><h2>IDENTITY</h2></div>
          <div class="mn-reg-fields">
            <label><span>Age *</span><input name="age" type="number" inputmode="numeric" min="1" max="9999" data-required></label>
            ${choiceFieldMarkup('gender', 'Gender *', ['Woman','Man','Non-binary','Genderfluid','Agender'], { required: true, max: 80 })}
            ${choiceFieldMarkup('race', 'Race / Species *', ['Human','Mutant','Inhuman','Enhanced human','Asgardian','Alien','Android'], { required: true, max: 100 })}
            ${choiceFieldMarkup('pronouns', 'Pronouns', ['She/her','He/him','They/them'], { max: 80 })}
            <label><span>Alias / Codename</span><input name="alias" maxlength="120" autocomplete="off"></label>
            ${choiceFieldMarkup('affiliation', 'Affiliation *', ['Independent','Avengers','X-Men','S.H.I.E.L.D.','Fantastic Four'], { required: true, max: 140 })}
            ${choiceFieldMarkup('occupation', 'Occupation *', ['Student','Vigilante','Hero','Agent','Scientist','Mercenary'], { required: true, max: 140 })}
            <label><span>Identity Status</span><select name="identityStatus"><option>Secret identity</option><option>Known to allies</option><option>Public identity</option><option>Identity compromised</option></select></label>
          </div>
        </section>

        <section class="mn-reg-page" data-reg-page="2" hidden>
          <div class="mn-reg-section-code"><span>02</span><h2>ABILITIES</h2></div>
          <div class="mn-reg-fields">
            <label class="mn-reg-wide"><span>Origin / Power Source *</span><textarea name="origin" data-required></textarea></label>
            <label><span>Power Scale</span><select name="powerScale"><option>Street-level</option><option selected>Enhanced</option><option>Avengers-level</option><option>Cosmic</option><option>Reality-altering</option></select></label>
            <label><span>Current Condition</span><select name="condition"><option selected>Stable</option><option>Injured</option><option>Exhausted</option><option>Power unstable</option><option>Critical</option></select></label>
          </div>
          <div class="mn-reg-subhead"><h3>ABILITY MATRIX</h3><button type="button" data-reg-add-ability><i class="fa-solid fa-plus"></i> Add ability</button></div>
          <div id="mn-reg-abilities" class="mn-reg-abilities"></div>
          <div class="mn-reg-fields mn-reg-after-abilities">
            <label><span>Weaknesses / Costs *</span><textarea name="weaknesses" data-required></textarea></label>
            <label><span>Equipment / Assets</span><textarea name="equipment"></textarea></label>
          </div>
        </section>

        <section class="mn-reg-page" data-reg-page="3" hidden>
          <div class="mn-reg-section-code"><span>03</span><h2>REALITY</h2></div>
          <div class="mn-reg-fields">
            ${choiceFieldMarkup('universe', 'Universe Designation *', ['Earth-616','Earth-65','Earth-1610','Earth-928','Earth-42'], { required: true, max: 80 })}
            <label><span>Continuity</span><select name="continuity"><option>Marvel Comics canon</option><option>MCU-inspired</option><option selected>Hybrid continuity</option><option>Original alternate universe</option></select></label>
            ${choiceFieldMarkup('timeline', 'Timeline / Era *', ['Present day','MCU era','2099','Post-apocalyptic','Original era'], { required: true, max: 180 })}
            ${choiceFieldMarkup('world', 'World / Realm *', ['Earth','New York City','Wakanda','Asgard','Multiverse','Alternate reality'], { required: true, max: 180 })}
            <label class="mn-reg-wide"><span>Canon Divergence</span><textarea name="canonDivergence"></textarea></label>
            <label class="mn-reg-wide"><span>World State / Active Crisis *</span><textarea name="worldState" data-required></textarea></label>
            <label><span>Known Factions</span><textarea name="knownFactions"></textarea></label>
            <label><span>Known Marvel Relationships</span><textarea name="relationships"></textarea></label>
          </div>
        </section>

        <section class="mn-reg-page" data-reg-page="4" hidden>
          <div class="mn-reg-section-code"><span>04</span><h2>ROLE-PLAY</h2></div>
          <div class="mn-reg-fields">
            ${choiceFieldMarkup('startingLocation', 'Starting Location *', ['New York City','Brooklyn','Queens','Manhattan','Wakanda','Avengers Tower'], { required: true, max: 220 })}
            <label><span>Starting Time</span><input name="startingTime" maxlength="160"></label>
            <label><span>Role-play Tone</span><select name="tone"><option>Classic heroic</option><option selected>Cinematic and tense</option><option>Street-level noir</option><option>Cosmic adventure</option><option>Dark multiverse</option></select></label>
            <label><span>Point of View</span><select name="pointOfView"><option selected>Second person</option><option>Third person limited</option><option>First person</option></select></label>
            <label><span>Canon Handling</span><select name="canonHandling"><option>Strict canon</option><option selected>Canon-consistent with divergence</option><option>Flexible canon</option><option>Fully original</option></select></label>
            <label><span>Character Control</span><select name="characterControl"><option selected>User controls registered character</option><option>Shared control</option></select></label>
            <label><span>Appearance</span><textarea name="appearance"></textarea></label>
            <label><span>Personality</span><textarea name="personality"></textarea></label>
            <label class="mn-reg-wide"><span>Backstory</span><textarea name="backstory"></textarea></label>
            <label class="mn-reg-wide"><span>Opening Situation *</span><textarea name="openingSituation" data-required></textarea></label>
            <label class="mn-reg-wide"><span>Immediate Objective *</span><textarea name="objective" data-required></textarea></label>
            <label class="mn-reg-wide"><span>First User Action / Message</span><textarea name="firstMessage"></textarea></label>
          </div>
        </section>

        <section class="mn-reg-page" data-reg-page="5" hidden>
          <div class="mn-reg-section-code"><span>05</span><h2>CONFIRM</h2></div>
          <div id="mn-reg-review" class="mn-reg-review"></div>
        </section>
      </main>

      <footer class="mn-reg-footer">
        <div class="mn-reg-status"><i></i><span id="mn-reg-status">REGISTRATION LINK READY</span></div>
        <div class="mn-reg-actions">
          <button type="button" data-reg-back><i class="fa-solid fa-arrow-left"></i> Back</button>
          <button type="button" class="mn-reg-next" data-reg-next>Continue <i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </footer>
    </form>
  </section>`;
}

function abilityMarkup(ability = {}, index = 0) {
  const type = clean(ability.type, 80) || 'Power';
  const mastery = clean(ability.mastery, 80) || 'Developing';
  const options = values => values.map(value => '<option' + (value === (values === abilityTypes ? type : mastery) ? ' selected' : '') + '>' + value + '</option>').join('');
  const abilityTypes = ['Power', 'Skill', 'Technology', 'Magic'];
  const masteryLevels = ['Untrained', 'Developing', 'Proficient', 'Mastered'];
  return `<article class="mn-reg-ability">
    <header><span>ABILITY // ${String(index + 1).padStart(2, '0')}</span><button type="button" data-reg-remove-ability aria-label="Remove ability"><i class="fa-solid fa-trash"></i></button></header>
    <div class="mn-reg-ability-fields">
      <label><span>Name *</span><input data-ability-name maxlength="120" value="${escapeHtml(clean(ability.name, 120))}" data-required></label>
      <label><span>Type</span><select data-ability-type>${options(abilityTypes)}</select></label>
      <label><span>Mastery</span><select data-ability-mastery>${options(masteryLevels)}</select></label>
      <label class="mn-reg-wide"><span>Function and Limits *</span><textarea data-ability-detail data-required>${escapeHtml(clean(ability.detail, 1400))}</textarea></label>
    </div>
  </article>`;
}

function overlay() {
  return document.getElementById('mn-registration-overlay');
}

function form() {
  return document.getElementById('mn-registration-form');
}

function addAbility(ability = {}) {
  const list = document.getElementById('mn-reg-abilities');
  if (!list || list.children.length >= 20) return;
  list.insertAdjacentHTML('beforeend', abilityMarkup(ability, list.children.length));
  renumberAbilities();
  localizeRegistration();
}

function renumberAbilities() {
  document.querySelectorAll('#mn-reg-abilities .mn-reg-ability').forEach((item, index) => {
    const label = item.querySelector('header span');
    if (label) label.textContent = 'ABILITY // ' + String(index + 1).padStart(2, '0');
  });
}

function setChoiceMode(wrapper, mode, value = '') {
  if (!(wrapper instanceof HTMLElement)) return;
  const nextMode = mode === 'custom' ? 'custom' : 'preset';
  const preset = wrapper.querySelector('[data-choice-preset]');
  const custom = wrapper.querySelector('[data-choice-custom]');
  wrapper.dataset.choiceMode = nextMode;
  wrapper.querySelectorAll('[data-choice-set]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.choiceSet === nextMode)));
  preset.hidden = nextMode !== 'preset';
  custom.hidden = nextMode !== 'custom';
  if (value) {
    if (nextMode === 'preset') preset.value = value;
    else custom.value = value;
  }
}

function choiceValue(name) {
  const wrapper = document.querySelector(`#mn-registration-overlay [data-reg-choice="${name}"]`);
  if (!wrapper) return null;
  return clean(wrapper.dataset.choiceMode === 'custom' ? wrapper.querySelector('[data-choice-custom]')?.value : wrapper.querySelector('[data-choice-preset]')?.value, 240);
}

function fieldValue(name, max = 2000) {
  const choice = choiceValue(name);
  if (choice !== null) return clean(choice, max);
  const control = form()?.elements?.namedItem(name);
  return clean(control?.value, max);
}

function readRegistration() {
  const data = {
    age: fieldValue('age', 20), gender: fieldValue('gender', 80), race: fieldValue('race', 100), pronouns: fieldValue('pronouns', 80),
    alias: fieldValue('alias', 120), affiliation: fieldValue('affiliation', 140), occupation: fieldValue('occupation', 140), identityStatus: fieldValue('identityStatus', 100),
    origin: fieldValue('origin', 1200), powerScale: fieldValue('powerScale', 80), condition: fieldValue('condition', 80),
    weaknesses: fieldValue('weaknesses', 1200), equipment: fieldValue('equipment', 1200),
    universe: fieldValue('universe', 80), continuity: fieldValue('continuity', 120), timeline: fieldValue('timeline', 180), world: fieldValue('world', 180),
    canonDivergence: fieldValue('canonDivergence', 1600), worldState: fieldValue('worldState', 1600), knownFactions: fieldValue('knownFactions', 1200), relationships: fieldValue('relationships', 1600),
    startingLocation: fieldValue('startingLocation', 220), startingTime: fieldValue('startingTime', 160), tone: fieldValue('tone', 100),
    pointOfView: fieldValue('pointOfView', 100), canonHandling: fieldValue('canonHandling', 120), characterControl: fieldValue('characterControl', 120),
    appearance: fieldValue('appearance', 1600), personality: fieldValue('personality', 1600), backstory: fieldValue('backstory', 2400),
    openingSituation: fieldValue('openingSituation', 2000), objective: fieldValue('objective', 1200), firstMessage: fieldValue('firstMessage', 1600),
    inputModes: Object.fromEntries([...document.querySelectorAll('#mn-registration-overlay [data-reg-choice]')].map(wrapper => [wrapper.dataset.regChoice, wrapper.dataset.choiceMode === 'custom' ? 'custom' : 'preset'])),
    abilities: [],
  };
  document.querySelectorAll('#mn-reg-abilities .mn-reg-ability').forEach((item, index) => {
    const name = clean(item.querySelector('[data-ability-name]')?.value, 120);
    const detail = clean(item.querySelector('[data-ability-detail]')?.value, 1400);
    if (!name && !detail) return;
    data.abilities.push({
      id: 'registered-ability-' + (index + 1),
      name,
      type: clean(item.querySelector('[data-ability-type]')?.value, 80) || 'Power',
      mastery: clean(item.querySelector('[data-ability-mastery]')?.value, 80) || 'Developing',
      detail,
    });
  });
  return data;
}

function fillRegistration(data = {}) {
  const target = form();
  if (!target) return;
  target.reset();
  for (const [name, value] of Object.entries(data)) {
    if (name === 'abilities' || name === 'completed' || name === 'completedAt' || name === 'inputModes') continue;
    const wrapper = document.querySelector(`#mn-registration-overlay [data-reg-choice="${name}"]`);
    if (wrapper) {
      const preset = wrapper.querySelector('[data-choice-preset]');
      const presetExists = [...preset.options].some(option => option.value === value);
      const requestedMode = data.inputModes?.[name];
      setChoiceMode(wrapper, requestedMode || (!value || presetExists ? 'preset' : 'custom'), value);
      continue;
    }
    const control = target.elements.namedItem(name);
    if (control && typeof value === 'string' && value) control.value = value;
  }
  const list = document.getElementById('mn-reg-abilities');
  list.replaceChildren();
  const abilities = Array.isArray(data.abilities) && data.abilities.length ? data.abilities : [{}];
  abilities.forEach(addAbility);
  document.getElementById('mn-reg-persona').textContent = controller.currentPersonaName();
}

function requiredControlsForStep(step) {
  return [...document.querySelectorAll('#mn-registration-overlay [data-reg-page="' + step + '"] [data-required]')].filter(control => !control.hidden);
}

function validateStep(step, focus = true) {
  const controls = requiredControlsForStep(step);
  let firstInvalid = null;
  for (const control of controls) {
    const invalid = !clean(control.value);
    control.classList.toggle('is-invalid', invalid);
    if (invalid && !firstInvalid) firstInvalid = control;
  }
  if (step === 2 && !document.querySelector('#mn-reg-abilities .mn-reg-ability')) {
    addAbility();
    firstInvalid ||= document.querySelector('[data-ability-name]');
  }
  if (!firstInvalid) return true;
  setStep(step);
  document.getElementById('mn-reg-status').textContent = 'REQUIRED DATA MISSING';
  localizeRegistration();
  if (focus) {
    firstInvalid.focus({ preventScroll: true });
    firstInvalid.scrollIntoView({ block: 'center', behavior: controller.motion() === 'off' ? 'auto' : 'smooth' });
  }
  return false;
}

function reviewBlock(title, entries) {
  return '<section><header><i></i><h3>' + escapeHtml(title) + '</h3></header>' + entries.filter(([, value]) => clean(String(value ?? ''))).map(([label, value]) => '<div><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong></div>').join('') + '</section>';
}

function renderReview() {
  const data = readRegistration();
  const abilities = data.abilities.map(item => item.name + ' // ' + item.type + ' // ' + item.mastery + '\n' + item.detail).join('\n\n');
  document.getElementById('mn-reg-review').innerHTML =
    reviewBlock('IDENTITY', [['Persona', controller.currentPersonaName()], ['Age', data.age], ['Gender', data.gender], ['Race / Species', data.race], ['Pronouns', data.pronouns], ['Alias', data.alias], ['Affiliation', data.affiliation], ['Occupation', data.occupation], ['Identity status', data.identityStatus]]) +
    reviewBlock('ABILITIES', [['Origin / Source', data.origin], ['Power scale', data.powerScale], ['Condition', data.condition], ['Ability matrix', abilities], ['Weaknesses / Costs', data.weaknesses], ['Equipment / Assets', data.equipment]]) +
    reviewBlock('REALITY', [['Universe', data.universe], ['Continuity', data.continuity], ['Timeline / Era', data.timeline], ['World / Realm', data.world], ['Canon divergence', data.canonDivergence], ['World state', data.worldState], ['Known factions', data.knownFactions], ['Known relationships', data.relationships]]) +
    reviewBlock('ROLE-PLAY', [['Starting location', data.startingLocation], ['Starting time', data.startingTime], ['Tone', data.tone], ['Point of view', data.pointOfView], ['Canon handling', data.canonHandling], ['Character control', data.characterControl], ['Appearance', data.appearance], ['Personality', data.personality], ['Backstory', data.backstory], ['Opening situation', data.openingSituation], ['Immediate objective', data.objective], ['First action / message', data.firstMessage]]);
}

function setStep(step) {
  activeStep = Math.max(1, Math.min(5, Number(step) || 1));
  document.querySelectorAll('#mn-registration-overlay [data-reg-page]').forEach(page => { page.hidden = Number(page.dataset.regPage) !== activeStep; });
  document.querySelectorAll('#mn-registration-overlay [data-reg-step]').forEach(button => {
    const selected = Number(button.dataset.regStep) === activeStep;
    if (selected) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
  });
  const progress = document.querySelector('#mn-registration-overlay .mn-reg-progress i');
  if (progress) progress.style.width = (activeStep * 20) + '%';
  const back = document.querySelector('#mn-registration-overlay [data-reg-back]');
  if (back) back.disabled = activeStep === 1;
  const next = document.querySelector('#mn-registration-overlay [data-reg-next]');
  if (next) next.innerHTML = activeStep === 5
    ? '<i class="fa-solid fa-check"></i> Confirm registration'
    : 'Continue <i class="fa-solid fa-arrow-right"></i>';
  document.getElementById('mn-reg-status').textContent = activeStep === 5 ? 'READY TO INITIALIZE ROLE-PLAY' : 'REGISTRATION LINK READY';
  if (activeStep === 5) renderReview();
  localizeRegistration();
  document.querySelector('#mn-registration-overlay .mn-reg-main')?.scrollTo({ top: 0, behavior: 'auto' });
}

function syncViewport() {
  const root = overlay();
  if (!root) return;
  const viewport = globalThis.visualViewport;
  root.style.setProperty('--mn-reg-height', Math.round(viewport?.height || window.innerHeight) + 'px');
  root.style.setProperty('--mn-reg-top', Math.round(viewport?.offsetTop || 0) + 'px');
}

function openRegistration() {
  if (!controller.context().getCurrentChatId?.()) {
    controller.notify('warning', 'Open a chat before using Marvel registration.');
    return;
  }
  controller.closeInterface();
  controller.closeSpiderWatch();
  const root = overlay();
  window.clearTimeout(closeTimer);
  previousFocused = document.activeElement;
  fillRegistration(controller.getState().registration || {});
  localizeRegistration();
  setStep(1);
  syncViewport();
  root.hidden = false;
  root.setAttribute('aria-hidden', 'false');
  document.body.classList.add('marvel-registration-open');
  requestAnimationFrame(() => root.classList.add('is-open'));
}

function closeRegistration() {
  const root = overlay();
  if (!root || root.hidden) return;
  root.classList.remove('is-open');
  root.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('marvel-registration-open');
  window.clearTimeout(closeTimer);
  closeTimer = window.setTimeout(() => { root.hidden = true; }, controller.motion() === 'off' ? 0 : 220);
  if (previousFocused instanceof HTMLElement) previousFocused.focus({ preventScroll: true });
}

function applyRegistrationToState(data) {
  const state = controller.getState();
  const mastery = { Untrained: 10, Developing: 35, Proficient: 65, Mastered: 95 };
  state.registration = { ...data, completed: true, completedAt: new Date().toISOString() };
  state.personaName = controller.currentPersonaName();
  state.operator.name = controller.currentPersonaName();
  state.operator.alias = data.alias || 'Unassigned';
  state.operator.role = data.occupation;
  state.operator.origin = data.origin;
  state.operator.affiliation = data.affiliation;
  state.operator.condition = data.condition;
  state.operator.location = data.startingLocation;
  state.operator.earth = data.universe;
  state.operator.continuity = data.continuity;
  state.operator.timeline = data.timeline;
  state.identity.secrecy = data.identityStatus;
  state.identity.publicStatus = data.identityStatus;
  state.vitals.health = 100;
  state.vitals.healthMax = 100;
  state.vitals.energy = 100;
  state.vitals.energyMax = 100;
  state.training = { level: 1, sessions: 0, progress: 0, focus: 'Untrained' };
  state.powers = data.abilities.map((ability, index) => ({
    id: ability.id || 'registered-ability-' + (index + 1),
    name: ability.name,
    description: [ability.type, ability.detail].filter(Boolean).join(' // '),
    mastery: mastery[ability.mastery] ?? 35,
  }));
  state.world.multiverse = data.world;
  state.world.time = data.startingTime || state.world.time;
  state.world.locationPath = [data.universe, data.world, data.startingLocation].filter(Boolean);
  state.world.travelStatus = 'Stationary';
  state.world.destination = '';
  state.world.eta = '';
  return state;
}

function formatRegistrationMessage(data) {
  const value = input => clean(input) || 'Not specified';
  const abilityLines = data.abilities.map((ability, index) =>
    (index + 1) + '. ' + value(ability.name) + ' [' + value(ability.type) + ' / ' + value(ability.mastery) + '] — ' + value(ability.detail)
  ).join('\n');
  return [
    '[MARVEL NEXUS // ROLE-PLAY REGISTRATION]',
    '',
    'PERSONA',
    'Name: ' + controller.currentPersonaName(),
    'Age: ' + value(data.age),
    'Gender: ' + value(data.gender),
    'Race / Species: ' + value(data.race),
    'Pronouns: ' + value(data.pronouns),
    'Alias / Codename: ' + value(data.alias),
    'Affiliation: ' + value(data.affiliation),
    'Occupation: ' + value(data.occupation),
    'Identity Status: ' + value(data.identityStatus),
    '',
    'ABILITIES',
    'Origin / Power Source: ' + value(data.origin),
    'Power Scale: ' + value(data.powerScale),
    'Current Condition: ' + value(data.condition),
    abilityLines || 'No abilities specified.',
    'Weaknesses / Costs: ' + value(data.weaknesses),
    'Equipment / Assets: ' + value(data.equipment),
    '',
    'REALITY ANCHOR',
    'Universe: ' + value(data.universe),
    'Continuity: ' + value(data.continuity),
    'Timeline / Era: ' + value(data.timeline),
    'World / Realm: ' + value(data.world),
    'Canon Divergence: ' + value(data.canonDivergence),
    'World State / Active Crisis: ' + value(data.worldState),
    'Known Factions: ' + value(data.knownFactions),
    'Known Marvel Relationships: ' + value(data.relationships),
    '',
    'ROLE-PLAY CONFIGURATION',
    'Starting Location: ' + value(data.startingLocation),
    'Starting Time: ' + value(data.startingTime),
    'Tone: ' + value(data.tone),
    'Point of View: ' + value(data.pointOfView),
    'Canon Handling: ' + value(data.canonHandling),
    'Character Control: ' + value(data.characterControl),
    'Appearance: ' + value(data.appearance),
    'Personality: ' + value(data.personality),
    'Backstory: ' + value(data.backstory),
    'Opening Situation: ' + value(data.openingSituation),
    'Immediate Objective: ' + value(data.objective),
    '',
    '[START ROLE-PLAY]',
    value(data.firstMessage || 'Begin from the registered opening situation.'),
    'Keep control of the registered player character with the user unless Character Control explicitly says otherwise.',
  ].join('\n');
}

async function confirmRegistration() {
  if (submitting) return;
  for (let step = 1; step <= 4; step++) if (!validateStep(step, true)) return;
  const data = readRegistration();
  const nextButton = document.querySelector('#mn-registration-overlay [data-reg-next]');
  submitting = true;
  if (nextButton) {
    nextButton.disabled = true;
    nextButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Initializing';
    localizeRegistration();
  }
  let messageSent = false;
  try {
    const state = applyRegistrationToState(data);
    await controller.persistState(state, 'registration');
    closeRegistration();
    const { sendMessageAsUser } = await import('../../../../script.js');
    if (typeof sendMessageAsUser !== 'function') throw new Error('SillyTavern sendMessageAsUser API is unavailable.');
    await sendMessageAsUser(formatRegistrationMessage(data), '');
    messageSent = true;
    controller.updatePrompt(state);
    await Promise.resolve(controller.context().generate('normal'));
  } catch (error) {
    console.error('[Marvel Nexus] Registration launch failed.', error);
    if (messageSent) controller.notify('warning', 'Registration was sent, but the first reply could not start. Use the normal Send button to retry generation.');
    else {
      controller.notify('error', 'Registration could not be sent. Your entries are still saved.');
      openRegistration();
      setStep(5);
    }
  } finally {
    submitting = false;
    if (nextButton) nextButton.disabled = false;
    if (!overlay()?.hidden) setStep(activeStep);
  }
}

function buildRegistration() {
  if (overlay()) return;
  document.body.insertAdjacentHTML('beforeend', registrationMarkup());
  const root = overlay();
  root.querySelectorAll('[data-reg-step]').forEach(button => button.addEventListener('click', () => setStep(button.dataset.regStep)));
  root.querySelector('[data-reg-close]').addEventListener('click', closeRegistration);
  root.querySelector('[data-reg-back]').addEventListener('click', () => setStep(activeStep - 1));
  root.querySelector('[data-reg-next]').addEventListener('click', () => {
    if (activeStep === 5) void confirmRegistration();
    else if (validateStep(activeStep)) setStep(activeStep + 1);
  });
  root.querySelector('[data-reg-add-ability]').addEventListener('click', () => addAbility());
  root.addEventListener('click', event => {
    const choice = event.target.closest('[data-choice-set]');
    if (choice) {
      const wrapper = choice.closest('[data-reg-choice]');
      setChoiceMode(wrapper, choice.dataset.choiceSet);
      wrapper.querySelector(wrapper.dataset.choiceMode === 'custom' ? '[data-choice-custom]' : '[data-choice-preset]')?.focus({ preventScroll: true });
      return;
    }
    const remove = event.target.closest('[data-reg-remove-ability]');
    if (!remove) return;
    remove.closest('.mn-reg-ability')?.remove();
    if (!document.querySelector('#mn-reg-abilities .mn-reg-ability')) addAbility();
    renumberAbilities();
  });
  root.addEventListener('input', event => {
    if (event.target.matches('[data-required]') && clean(event.target.value)) event.target.classList.remove('is-invalid');
  });
  root.querySelector('form').addEventListener('submit', event => { event.preventDefault(); if (activeStep === 5) void confirmRegistration(); });
  globalThis.visualViewport?.addEventListener('resize', syncViewport);
  globalThis.visualViewport?.addEventListener('scroll', syncViewport);
  window.addEventListener('resize', syncViewport);
  globalThis.addEventListener('marvel-nexus:language-changed', localizeRegistration);
  localizeRegistration();
}

async function registerCommand() {
  if (commandRegistered) return;
  try {
    const [{ SlashCommandParser }, { SlashCommand }] = await Promise.all([
      import('../../../slash-commands/SlashCommandParser.js'),
      import('../../../slash-commands/SlashCommand.js'),
    ]);
    const existing = SlashCommandParser.commands?.find?.(command => command?.name === 'marvel-registration')
      || SlashCommandParser.commands?.get?.('marvel-registration');
    if (!existing) {
      SlashCommandParser.addCommandObject(SlashCommand.fromProps({
        name: 'marvel-registration',
        callback: async () => { openRegistration(); return ''; },
        helpString: 'Open the fullscreen Marvel Nexus role-play registration interface.',
      }));
    }
    commandRegistered = true;
  } catch (error) {
    console.warn('[Marvel Nexus] Could not register /marvel-registration.', error);
  }
}

export async function initializeMarvelRegistration(api) {
  controller = api;
  buildRegistration();
  await registerCommand();
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !overlay()?.hidden) closeRegistration();
  });
}

export { localizeRegistration };
