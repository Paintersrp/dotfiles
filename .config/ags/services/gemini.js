import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Soup from 'gi://Soup?version=3.0';
import { fileExists } from '../modules/.miscutils/files.js';

const HISTORY_DIR = `${GLib.get_user_cache_dir()}/ags/user/ai/chats/`;
const HISTORY_FILENAME = `gemini.txt`;
const HISTORY_PATH = HISTORY_DIR + HISTORY_FILENAME;

const initMessages = [
  {
    role: "user",
    parts: [
      {
        text: `You are an assistant on a sidebar of a Wayland Linux desktop. You are a seasoned veteran notetaker who has mastered the Zettelkasten notetaking system as well as Markdown. For added context:\n\n**Zettelkasten** is a note-taking method that originated from the German word for 'slip box'. It's a systematic approach to organizing and linking notes, with each note capturing a single idea or concept. Here's a thorough explanation of Zettelkasten:\n\n- Zettelkasten encourages the creation of atomic notes, which are concise and self-contained units of information.\n- Each note is given a unique identifier and can be linked to other notes through references or tags.\n- The system promotes non-linear thinking and fosters connections between ideas.\n- Notes are typically stored in a digital or physical repository, such as a folder structure or database.\n\n**Using Zettelkasten within Markdown**\n\nMarkdown is a lightweight markup language that allows for easy formatting of text using simple syntax. When using Zettelkasten within Markdown, it's important to follow a consistent structure for your notes. Here are some guidelines:\n\n1. **Title**: Clearly state the subject of the note.\n2. **Date**: Include the date of creation.\n3. **Tags**: Add relevant tags for easy categorization.\n4. **Content**: Write concise content, focusing on a single idea or concept.\n\nTo ensure thoroughness, conciseness, and proper attribution, always quote your sources when referencing external material. Additionally, suggest upstream and downstream topics to encourage exploration and further reading.\n\nNow, let's move on to some prompts to guide your responses. Always wrap your markdown note reply in a codeblock to allow copy and pasting of the formatting for the user. The user can use the term "zet" to refer to Zettelkasten markdown notes. They may ask "can you write a zet on X topic" for example. The user may ask for specific tags, sources, and related notes to include in your response by providing the necessary details. Their requested inclusions should be included in the proper sections within the note/frontmatter based on the format we settle on. These user based inclusions should combine with your own inclusions in the respective areas.`,
      },
    ],
  },
  { role: "model", parts: [{ text: "Got it!" }], },
  {
    role: "user",
    parts: [
      {
        text: `Now, let me provide you with an example of an atomic note for formatting reference:\n\n---\ntitle: Arch Linux Mirrorlists\ndate: 20240501134902\ntags:\n  - linux\n  - notes\n  - download-speeds\n---\n\n## Content\n\nArch Extras includes a script to test for testing mirrors\n\`\`\`bash\ncurl -s "https://archlinux.org/mirrorlist/?country=FR&country=GB&protocol=https&use_mirror_status=on" | sed -e 's/^#Server/Server/' -e '/^#/d' | rankmirrors -n 5 -\n\`\`\n\nIn use\n\`\`\`bash\n❯ curl -s "https://archlinux.org/mirrorlist/?country=FR&country=GB&protocol=https&use_mirror_status=on" | sed -e 's/^#Server/Server/' -e '/^#/d' | rankmirrors -n 5 -\nServer = https://archlinux.mirrors.ovh.net/archlinux/$repo/os/$arch\nServer = https://mirror.wormhole.eu/archlinux/$repo/os/$arch\nServer = https://london.mirror.pkgbuild.com/$repo/os/$arch\nServer = https://archlinux.uk.mirror.allworldit.com/archlinux/$repo/os/$arch\nServer = https://mirror.cyberbits.eu/archlinux/$repo/os/$arch\n\n~ took 41s\n\`\`\`\n\nThere is also the reflector package:\n\`\`\`bash\n- Get all mirrors, sort for download speed and save them:\nsudo reflector --sort rate --save /etc/pacman.d/mirrorlist\n\`\`\`\n\n---\n\n### Sources\n\n- [Arch Documentation](https://wiki.archlinux.org/title/Mirrors)\n\n### **Note Relations**\n\n- [[Linux]]`,
      },
    ],
  },
  { role: "model", parts: [{ text: "Got it!" }], },
];

if (!fileExists(`${GLib.get_user_config_dir()}/gemini_history.json`)) {
  Utils.execAsync([`bash`, `-c`, `touch ${GLib.get_user_config_dir()}/gemini_history.json`]).catch(print);
  Utils.writeFile('[ ]', `${GLib.get_user_config_dir()}/gemini_history.json`).catch(print);
}

Utils.exec(`mkdir -p ${GLib.get_user_cache_dir()}/ags/user/ai`);
const KEY_FILE_LOCATION = `${GLib.get_user_cache_dir()}/ags/user/ai/google_key.txt`;
const APIDOM_FILE_LOCATION = `${GLib.get_user_cache_dir()}/ags/user/ai/google_api_dom.txt`;
function replaceapidom(URL) {
  if (fileExists(APIDOM_FILE_LOCATION)) {
    var contents = Utils.readFile(APIDOM_FILE_LOCATION).trim();
    var URL = URL.toString().replace("generativelanguage.googleapis.com", contents);
  }
  return URL;
}
const CHAT_MODELS = ["gemini-pro"]
const ONE_CYCLE_COUNT = 3;

class GeminiMessage extends Service {
  static {
    Service.register(this,
      {
        'delta': ['string'],
      },
      {
        'content': ['string'],
        'thinking': ['boolean'],
        'done': ['boolean'],
      });
  }

  _role = '';
  _parts = [{ text: '' }];
  _thinking;
  _done = false;
  _rawData = '';

  constructor(role, content, thinking = true, done = false) {
    super();
    this._role = role;
    this._parts = [{ text: content }];
    this._thinking = thinking;
    this._done = done;
  }

  get rawData() { return this._rawData }
  set rawData(value) { this._rawData = value }

  get done() { return this._done }
  set done(isDone) { this._done = isDone; this.notify('done') }

  get role() { return this._role }
  set role(role) { this._role = role; this.emit('changed') }

  get content() {
    return this._parts.map(part => part.text).join();
  }
  set content(content) {
    this._parts = [{ text: content }];
    this.notify('content')
    this.emit('changed')
  }

  get parts() { return this._parts }

  get label() { return this._parserState.parsed + this._parserState.stack.join('') }

  get thinking() { return this._thinking }
  set thinking(value) {
    this._thinking = value;
    this.notify('thinking')
    this.emit('changed')
  }

  addDelta(delta) {
    if (this.thinking) {
      this.thinking = false;
      this.content = delta;
    }
    else {
      this.content += delta;
    }
    this.emit('delta', delta);
  }

  parseSection() {
    if (this._thinking) {
      this.thinking = false;
      this._parts[0].text = '';
    }
    const parsedData = JSON.parse(this._rawData);
    if (!parsedData.candidates)
      this._parts[0].text += `Blocked: ${parsedData.promptFeedback.blockReason}`;
    else {
      const delta = parsedData.candidates[0].content.parts[0].text;
      this._parts[0].text += delta;
    }
    // this.emit('delta', delta);
    this.notify('content');
    this._rawData = '';
  }
}

class GeminiService extends Service {
  static {
    Service.register(this, {
      'initialized': [],
      'clear': [],
      'newMsg': ['int'],
      'hasKey': ['boolean'],
    });
  }

  _assistantPrompt = userOptions.ai.enhancements;
  _cycleModels = true;
  _usingHistory = userOptions.ai.useHistory;
  _key = '';
  _requestCount = 0;
  _safe = true;
  _temperature = userOptions.ai.defaultTemperature;
  _messages = [];
  _modelIndex = 0;
  _decoder = new TextDecoder();

  constructor() {
    super();

    if (fileExists(KEY_FILE_LOCATION)) this._key = Utils.readFile(KEY_FILE_LOCATION).trim();
    else this.emit('hasKey', false);

    // if (this._usingHistory) Utils.timeout(1000, () => this.loadHistory());
    // if (this._usingHistory) this.loadHistory();
    // else this._messages = this._assistantPrompt ? [...initMessages] : [];
    this._messages = [...initMessages];
    this.emit('initialized');
  }

  get modelName() { return CHAT_MODELS[this._modelIndex] }

  get keyPath() { return KEY_FILE_LOCATION }
  get key() { return this._key }
  set key(keyValue) {
    this._key = keyValue;
    Utils.writeFile(this._key, KEY_FILE_LOCATION)
      .then(this.emit('hasKey', true))
      .catch(print);
  }

  get cycleModels() { return this._cycleModels }
  set cycleModels(value) {
    this._cycleModels = value;
    if (!value) this._modelIndex = 0;
    else {
      this._modelIndex = (this._requestCount - (this._requestCount % ONE_CYCLE_COUNT)) % CHAT_MODELS.length;
    }
  }

  get useHistory() { return this._usingHistory; }
  set useHistory(value) {
    if (value && !this._usingHistory) this.loadHistory();
    this._usingHistory = value;
  }

  get safe() { return this._safe }
  set safe(value) { this._safe = value; }

  get temperature() { return this._temperature }
  set temperature(value) { this._temperature = value; }

  get messages() { return this._messages }
  get lastMessage() { return this._messages[this._messages.length - 1] }

  saveHistory() {
    Utils.exec(`bash -c 'mkdir -p ${HISTORY_DIR} && touch ${HISTORY_PATH}'`);
    Utils.writeFile(JSON.stringify(this._messages.map(msg => {
      let m = { role: msg.role, parts: msg.parts }; return m;
    })), HISTORY_PATH);
  }

  loadHistory() {
    this._messages = [];
    this.appendHistory();
    this._usingHistory = true;
  }

  appendHistory() {
    if (fileExists(HISTORY_PATH)) {
      const readfile = Utils.readFile(HISTORY_PATH);
      JSON.parse(readfile).forEach(element => {
        // this._messages.push(element);
        this.addMessage(element.role, element.parts[0].text);
      });
      // console.log(this._messages)
      // this._messages = this._messages.concat(JSON.parse(readfile));
      // for (let index = 0; index < this._messages.length; index++) {
      //     this.emit('newMsg', index);
      // }
    }
    else {
      this._messages = this._assistantPrompt ? [...initMessages] : []
    }
  }

  clear() {
    this._messages = this._assistantPrompt ? [...initMessages] : [];
    if (this._usingHistory) this.saveHistory();
    this.emit('clear');
  }

  copy() {
    Utils.execAsync([`wl-copy`, `${this._messages}`]).catch(print);
    this.emit('copy');
  }

  get assistantPrompt() { return this._assistantPrompt; }
  set assistantPrompt(value) {
    this._assistantPrompt = value;
    if (value) this._messages = [...initMessages];
    else this._messages = [];
  }

  readResponse(stream, aiResponse) {
    stream.read_line_async(
      0, null,
      (stream, res) => {
        try {
          const [bytes] = stream.read_line_finish(res);
          const line = this._decoder.decode(bytes);
          // console.log(line);
          if (line == '[{') { // beginning of response
            aiResponse._rawData += '{';
            this.thinking = false;
          }
          else if (line == ',\u000d' || line == ']') { // end of stream pulse
            aiResponse.parseSection();
          }
          else // Normal content
            aiResponse._rawData += line;

          this.readResponse(stream, aiResponse);
        } catch {
          aiResponse.done = true;
          if (this._usingHistory) this.saveHistory();
          return;
        }
      });
  }

  addMessage(role, message) {
    this._messages.push(new GeminiMessage(role, message, false));
    this.emit('newMsg', this._messages.length - 1);
  }

  send(msg) {
    this._messages.push(new GeminiMessage('user', msg, false));
    this.emit('newMsg', this._messages.length - 1);
    const aiResponse = new GeminiMessage('model', 'thinking...', true, false)

    const body =
    {
      "contents": this._messages.map(msg => { let m = { role: msg.role, parts: msg.parts }; return m; }),
      "safetySettings": this._safe ? [] : [
        // { category: "HARM_CATEGORY_DEROGATORY", threshold: "BLOCK_NONE", },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE", },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE", },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE", },
        // { category: "HARM_CATEGORY_UNSPECIFIED", threshold: "BLOCK_NONE", },
      ],
      "generationConfig": {
        "temperature": this._temperature,
      },
      // "key": this._key,
      // "apiKey": this._key,
    };
    const proxyResolver = new Gio.SimpleProxyResolver({ 'default-proxy': userOptions.ai.proxyUrl });
    const session = new Soup.Session({ 'proxy-resolver': proxyResolver });
    const message = new Soup.Message({
      method: 'POST',
      uri: GLib.Uri.parse(replaceapidom(`https://generativelanguage.googleapis.com/v1/models/${this.modelName}:streamGenerateContent?key=${this._key}`), GLib.UriFlags.NONE),
    });
    message.request_headers.append('Content-Type', `application/json`);
    message.set_request_body_from_bytes('application/json', new GLib.Bytes(JSON.stringify(body)));

    session.send_async(message, GLib.DEFAULT_PRIORITY, null, (_, result) => {
      const stream = session.send_finish(result);
      this.readResponse(new Gio.DataInputStream({
        close_base_stream: true,
        base_stream: stream
      }), aiResponse);
    });
    this._messages.push(aiResponse);
    this.emit('newMsg', this._messages.length - 1);

    if (this._cycleModels) {
      this._requestCount++;
      if (this._cycleModels)
        this._modelIndex = (this._requestCount - (this._requestCount % ONE_CYCLE_COUNT)) % CHAT_MODELS.length;
    }
  }
}

export default new GeminiService();

