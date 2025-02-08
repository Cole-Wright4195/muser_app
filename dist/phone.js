"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = __importDefault(require("twilio"));
const readline_1 = __importDefault(require("readline"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const config = {
    accountSid: 'ACe089f2059200a791501ef25273e35112',
    authToken: '36ca7dc915b2190e53fa316667252a53',
    phoneNumber: '+18558541536'
};
const client = (0, twilio_1.default)(config.accountSid, config.authToken);
async function sendSMS(to, body) {
    try {
        const message = await client.messages.create({
            body,
            from: config.phoneNumber,
            to
        });
        console.log(`Message sent! SID: ${message.sid}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        }
        else {
            console.error('Unknown error occurred');
        }
    }
}
rl.question('Enter phone number: ', (to) => {
    rl.question('Enter message: ', (body) => {
        sendSMS(to, body).finally(() => rl.close());
    });
});
