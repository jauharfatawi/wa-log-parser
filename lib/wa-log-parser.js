const fs = require('fs');
const rl = require('readline');
const path = require('path');

const WaMessageType = require('./wa-message-type');

const DATE_FORMAT = '(\\d{1}|\\d{2})/(\\d{1}|\\d{2})/\\d{2}, (\\d{1}|\\d{2}):(\\d{1}|\\d{2}) (PM|AM)';

/**
 * Returns the position of the nth occurrence of a substring.
 * @param {string} str - String
 * @param {string} pat - Pattern
 * @param {number} n
 */
function nthIndex(str, pat, n) {
  const L = str.length;
  let q = n;
  let i = -1;

  /* eslint no-plusplus: "off" */
  while (q-- && i++ < L) {
    i = str.indexOf(pat, i);
    if (i < 0) break;
  }

  return i;
}

function getLineType(line) {
  // Encryption notice
  const encryptNoticeRegex = new RegExp(`${DATE_FORMAT} - Messages to this group are now secured with end-to-end encryption. Tap for more info.`);
  if (encryptNoticeRegex.test(line)) {
    return WaMessageType.INFO;
  }

  // Group icon change
  const groupIconChangeNoticeRegex = new RegExp(`${DATE_FORMAT} - (.{1,25}) changed this group's icon`);
  if (groupIconChangeNoticeRegex.test(line)) {
    return WaMessageType.INFO;
  }

  // Group join via invite link
  const groupJoinNoticeRegex = new RegExp(`${DATE_FORMAT} - (.{1,25}) joined using this group's invite link`);
  if (groupJoinNoticeRegex.test(line)) {
    return WaMessageType.INFO;
  }

  // Group creation notice
  const groupCreationNoticeRegex = new RegExp(`${DATE_FORMAT} - (.{1,25}) created group "(.+)"`);
  if (groupCreationNoticeRegex.test(line)) {
    return WaMessageType.INFO;
  }

  // Title change
  const subjectChangeRegex = new RegExp(`${DATE_FORMAT} - (.{1,25}) changed the subject from "(.+)" to "(.+)"`);
  if (subjectChangeRegex.test(line)) {
    return WaMessageType.INFO;
  }

  // Number change
  const numberChangeRegex = new RegExp(`${DATE_FORMAT} - (.{1,25}) changed to (.{1,25})`);
  if (numberChangeRegex.test(line)) {
    return WaMessageType.INFO;
  }

  // Group add
  const groupAddRegex = new RegExp(`${DATE_FORMAT} - (.{1,25}) added ‪(.{1,25})‬`);
  if (groupAddRegex.test(line)) {
    return WaMessageType.INFO;
  }

  // Media omitted
  const mediaRegex = new RegExp(`${DATE_FORMAT} - ‪*(.{1,25}): <Media omitted>`);
  if (mediaRegex.test(line)) {
    return WaMessageType.MEDIA;
  }

  // Message
  const messageRegex = new RegExp(`${DATE_FORMAT} - ‪*(.{1,25}): (.+)`);
  if (messageRegex.test(line)) {
    return WaMessageType.MESSAGE;
  }

  return null;
}

/**
 * Parse single line into message object.
 * @param {string} line
 * @param {Object} prevMsg
 * @returns {Object} message
 */
function parseLine(line, prevMsg) {
  const msg = {};
  msg.type = getLineType(line);

  switch (msg.type) {
    case WaMessageType.INFO:
    {
      const index = line.indexOf(' - ');

      msg.date = new Date(line.substring(0, index));
      msg.sender = 'system';
      msg.body = line.substring(index + 3, line.length);
      break;
    }
    case WaMessageType.MESSAGE:
    {
      const index = line.indexOf(' - ');
      const other = nthIndex(line, ':', 2);

      msg.date = new Date(line.substring(0, index));
      msg.sender = line.substring(index + 3, other);
      msg.body = line.substring(other + 2, line.length);
      break;
    }
    case WaMessageType.MEDIA:
    {
      const index = line.indexOf(' - ');
      const other = nthIndex(line, ':', 2);

      msg.date = new Date(line.substring(0, index));
      msg.sender = line.substring(index + 3, other);
      msg.body = line.substring(other + 2, line.length);
      break;
    }
    default:
      if (prevMsg != null) {
        msg.type = WaMessageType.MESSAGE;
        msg.date = prevMsg.date;
        msg.sender = prevMsg.sender;
        msg.body = line;
      } else {
        throw new Error(`Couldn't parse line: ${line}`);
      }
  }
  return msg;
}

/**
 * Parse Whatsapp log file.
 * @param {string} input - Path to log file
 */
function parse(input) {
  return new Promise((resolve) => {
    const inputPath = path.resolve(input);
    const rd = rl.createInterface({
      input: fs.createReadStream(inputPath),
    });
    const data = {
      messages: [],
    };
    let prevMsg;

    rd.on('line', (line) => {
      const msg = parseLine(line, prevMsg);
      data.messages.push(msg);
      prevMsg = msg;
    });

    rd.on('close', () => resolve(data));
  });
}

module.exports = {
  parse,
  parseLine,
};
