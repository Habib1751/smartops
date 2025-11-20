// lib/whatsapp.ts
import axios from 'axios';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

export class WhatsAppClient {
  private apiKey: string;
  private phoneNumberId: string;

  constructor() {
    this.apiKey = process.env.WHATSAPP_API_KEY || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  }

  async sendMessage(to: string, message: string) {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('WhatsApp send error:', error);
      throw error;
    }
  }

  async sendTemplate(to: string, templateName: string, parameters: any[]) {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: parameters,
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('WhatsApp template error:', error);
      throw error;
    }
  }
}

export const whatsappClient = new WhatsAppClient();
