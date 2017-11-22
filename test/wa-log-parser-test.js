const chai = require('chai');
const expect = chai.expect;
const parser = require('./../lib/wa-log-parser.js');

describe('WhatsappLogParser', function() {
    const line1 = '10/2/17, 9:26 PM - Messages to this group are now secured with end-to-end encryption. Tap for more info.';
    it(`"${line1}" should be parsed to system message`, function() {
        let msg = parser.parseLine(line1);
        expect(msg.sender).to.equal('system');
    });

    const line2 = '10/2/17, 9:26 PM - Q created group "Generic wa group"';
    it(`"${line2}" should be parsed to system message`, function() {
        let msg = parser.parseLine(line2);
        expect(msg.type).to.equal('info');
        expect(msg.sender).to.equal('system');
        expect(msg.body).to.equal('Q created group "Generic wa group"');
    });

    const line3 = '2/3/17, 4:39 PM - ‪+358 40 8485555‬ changed to +7 905 317-55-55';
    it(`"${line3}" should be parsed to system message`, function() {
        let msg = parser.parseLine(line3);
        expect(msg.type).to.equal('info');
        expect(msg.sender).to.equal('system');
        expect(msg.body).to.equal('‪+358 40 8485555‬ changed to +7 905 317-55-55');
    });

    const line4 = '‪1/31/17, 6:41 PM - Q changed the subject from "1: Generic wa chat" to "2: Another generic wa chat"';
    it(`"${line4}" should be parsed to system message`, function() {
        let msg = parser.parseLine(line4);
        expect(msg.type).to.equal('info');
        expect(msg.sender).to.equal('system');
        expect(msg.body).to.equal('Q changed the subject from "1: Generic wa chat" to "2: Another generic wa chat"');
    });

    const line6 = '10/3/17, 7:25 PM - Test User changed this group\'s icon';
    it(`"${line6}" should be parsed to system message`, function() {
        let msg = parser.parseLine(line6);
        expect(msg.type).to.equal('info');
        expect(msg.sender).to.equal('system');
        expect(msg.body).to.equal('Test User changed this group\'s icon');
    });

    const line7 = '10/3/17, 7:39 PM - ‪+358 45 14425555 joined using this group\'s invite link';
    it(`"${line7}" should be parsed to system message`, function() {
        let msg = parser.parseLine(line7);
        expect(msg.type).to.equal('info');
        expect(msg.sender).to.equal('system');
        expect(msg.body).to.equal('‪+358 45 14425555 joined using this group\'s invite link');
    });

    const line8 = '10/3/17, 7:39 PM - Test User added ‪+358 41 4375555‬';
    it(`"${line8}" should be parsed to system message`, function() {
        let msg = parser.parseLine(line8);
        expect(msg.type).to.equal('info');
        expect(msg.sender).to.equal('system');
        expect(msg.body).to.equal('Test User added ‪+358 41 4375555‬');
    });

    const line9 = '10/3/17, 7:39 PM - User: <Media omitted>';
    it(`"${line9}" should be parsed to media`, function() {
        let msg = parser.parseLine(line9);
        expect(msg.type).to.equal('media');
        expect(msg.sender).to.equal('User');
        expect(msg.body).to.equal('<Media omitted>');
    });

    const msgLine1 = '10/2/17, 9:26 PM - Test User: Hello World! :)';
    it(`"${msgLine1}" should be parsed to message`, function() {
        let msg = parser.parseLine(msgLine1);
        expect(msg.type).to.equal('message');
        expect(msg.sender).to.equal('Test User');
        expect(msg.body).to.equal('Hello World! :)');
    });

    const msgLine2 = '1/31/17, 6:15 PM - ‪+358 50 3599555‬: This is the first line of multi line message.';
    const msgLine3 = 'This is the second line of multi line message';
    it(`"${msgLine3}" should be parsed to message`, function() {
        let msg1 = parser.parseLine(msgLine2);
        let msg2 = parser.parseLine(msgLine3, msg1);
        expect(msg2.type).to.equal('message');
        expect(msg2.sender).to.equal('‪+358 50 3599555‬');
        expect(msg2.body).to.equal('This is the second line of multi line message');
    });

});
