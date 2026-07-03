import { logger } from './logger';

// Africa's Talking SMS — scaffolded, enable with real credentials
let client: any = null;

async function getClient() {
  if (client) return client;

  const apiKey = process.env.AT_API_KEY;
  const username = process.env.AT_USERNAME;

  if (!apiKey || apiKey === 'CHANGE_ME' || !username || username === 'CHANGE_ME') {
    logger.warn('Africa\'s Talking SMS not configured. SMS alerts disabled.');
    return null;
  }

  try {
    const AfricasTalking = (await import('africastalking')).default;
    const at = AfricasTalking({ apiKey, username });
    client = at.SMS;
    return client;
  } catch (err) {
    logger.error('Failed to initialize Africa\'s Talking client:', err);
    return null;
  }
}

export async function sendSmsAlert(params: {
  message: string;
  to?: string;
}) {
  const smsClient = await getClient();
  if (!smsClient) return;

  const to = params.to || process.env.ADMIN_PHONE;
  if (!to) {
    logger.warn('No admin phone number configured for SMS alerts');
    return;
  }

  try {
    await smsClient.send({
      to: [to],
      message: params.message,
      from: process.env.AT_SENDER_ID || 'IMARA',
    });
    logger.info(`SMS alert sent to ${to}`);
  } catch (err) {
    logger.error('Failed to send SMS alert:', err);
  }
}

export async function sendNewInquirySmsAlert(params: {
  clientName: string;
  inquiryType: string;
  referenceId: string;
}) {
  await sendSmsAlert({
    message: `[IMARA] New ${params.inquiryType} inquiry from ${params.clientName}. Ref: ${params.referenceId.slice(0, 8).toUpperCase()}. Check dashboard.`,
  });
}
