import twilio from 'twilio';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

type TwilioConfig = {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
};

const config: TwilioConfig = {
  accountSid: 'ACe089f2059200a791501ef25273e35112',
  authToken: '36ca7dc915b2190e53fa316667252a53',
  phoneNumber: '+18558541536'
};

const client = twilio(config.accountSid, config.authToken);

async function sendSMS(to: string, body: string): Promise<void> {
  try {
    const message = await client.messages.create({
      body,
      from: config.phoneNumber,
      to
    });

    console.log(`Message sent! SID: ${message.sid}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Unknown error occurred');
    }
  }
}

rl.question('Enter phone number: ', (to: string) => {
  rl.question('Enter message: ', (body: string) => {
    sendSMS(to, body).finally(() => rl.close());
  });
});