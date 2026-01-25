/**
 * ClickUp CRM Integration
 * Sends form submissions to ClickUp as tasks
 * Uses OAuth2 authentication with custom fields (fallback to description if limit reached)
 */

const CLICKUP_API_BASE = 'https://api.clickup.com/api/v2';

// OAuth2 Access Token (obtained from OAuth flow)
const CLICKUP_ACCESS_TOKEN = process.env.CLICKUP_ACCESS_TOKEN || '95603081_be41589dd91db3a82264084cf0e2b28367b2e58222b037c42ab0d3eaf990ef93';

// OAuth2 credentials (for re-authorization if needed)
const CLICKUP_CLIENT_ID = process.env.CLICKUP_CLIENT_ID || '9M53WAXCHZGD3DNDVSJ39OOQLU4QKLQX';
const CLICKUP_CLIENT_SECRET = process.env.CLICKUP_CLIENT_SECRET || '3MQJ1LKGR9EZH9QJDARNGQTS15ZM4A7M9QAWB204RX4PR3AKUJZ4OHEUPEM55N1J';

// NEW List IDs for each form type (updated for new workspace)
const LIST_IDS = {
  CONTACT: '901815074416',  // WEBSITE - CONTACT US SUPPORT form
  QUOTE: '901815116534',    // WEBSITE - PRICE QUOTATION form
  CAREERS: '901815116560',  // WEBSITE - JOB APPLICATION form
};

// NEW Custom Field IDs (updated for new workspace)
const FIELD_IDS = {
  // Shared fields (Parent FOLDER level - Website forms Submission)
  LEAD_NAME: '57cf4e63-25e9-44ea-bdff-a4fe553835b7',
  LEAD_PHONE: '83414550-9cdc-47f2-8f75-684b79906474',
  LEAD_EMAIL: '5d6d1f27-8c05-4979-a6b4-94d115f1e8d9',
  LEAD_COMPANY: 'c1fc56fc-82c6-49d4-84c5-ba2338a427e0',
  LEAD_MESSAGE: '6ca86997-1ce5-4a77-943a-2faec370f4a0',
  
  // Contact form specific (LISTING level - Website - CONTACT US form)
  INQUIRE_SUBJECT: '8a26eaec-666a-4055-830c-231cb74796e6',
  INQUIRE_TYPE: '6d17c81b-016c-4e03-9afc-179ce247f11a',
  
  // Quote form specific (LISTING level - Website - REQUEST QUOTE form)
  SERVICE_TYPE: '8722400e-f247-4249-a7f3-39d6c3ba6c1d',
  EXPECTED_VOLUME: '86db5ec9-7ea5-4759-89d8-249e035824ac',
  
  // Careers form specific (LISTING level - Website - CAREERS form)
  DESIRED_POSITION: 'cf2da352-75ae-4737-98e0-13799488feee',
};

interface BaseFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  company?: string;
}

interface ContactFormData extends BaseFormData {
  type: string;
  subject: string;
}

interface QuoteFormData extends BaseFormData {
  serviceType: string;
  estimatedVolume?: string;
}

interface CareersFormData extends BaseFormData {
  position: string;
}

/**
 * Generate tags based on form type and data
 */
function generateTags(formType: 'contact' | 'quote' | 'careers', data: any): string[] {
  const tags: string[] = [];

  if (formType === 'contact') {
    tags.push('website-support');
    const typeMap: Record<string, string> = {
      'general': 'general-inquiry',
      'sales': 'sales',
      'support': 'technical-support',
      'technical': 'technical-support',
      'partnership': 'partnership',
    };
    if (data.type && typeMap[data.type]) {
      tags.push(typeMap[data.type]);
    }
  } else if (formType === 'quote') {
    tags.push('website-quote');
    const serviceMap: Record<string, string> = {
      'delivery': 'express-delivery',
      'express': 'express-delivery',
      'storage': 'fulfillment-service',
      'fulfillment': 'fulfillment-service',
      'returns': 'returns-management',
    };
    if (data.serviceType) {
      const serviceKey = data.serviceType.toLowerCase();
      for (const [key, tag] of Object.entries(serviceMap)) {
        if (serviceKey.includes(key)) {
          tags.push(tag);
          break;
        }
      }
    }
    if (data.estimatedVolume) {
      const volumeMap: Record<string, string> = {
        '1-50': '1-50-orders-month',
        '51-200': '51-200-orders-month',
        '201-500': '201-500-orders-month',
        '501-1000': '501-1000-orders-month',
        '1000+': 'above-1000-orders-month',
        '1000': 'above-1000-orders-month',
      };
      for (const [key, tag] of Object.entries(volumeMap)) {
        if (data.estimatedVolume.includes(key)) {
          tags.push(tag);
          break;
        }
      }
    }
  } else if (formType === 'careers') {
    tags.push('website-careers');
    const positionMap: Record<string, string> = {
      'driver': 'delivery-driver',
      'delivery driver': 'delivery-driver',
      'customerservice': 'customer-service',
      'customer service': 'customer-service',
      'warehouse': 'warehouse-operations',
      'operations': 'operations',
      'sales': 'sales',
      'it': 'it-technology-team',
      'other': 'other',
    };
    if (data.position) {
      const positionLower = data.position.toLowerCase();
      for (const [key, tag] of Object.entries(positionMap)) {
        if (positionLower.includes(key) || positionLower === key) {
          tags.push(tag);
          break;
        }
      }
    }
  }

  return tags;
}

/**
 * Generate description for fallback (when custom fields fail)
 */
function generateContactDescription(data: ContactFormData): string {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CONTACT FORM SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: ${data.name}
📧 Email: ${data.email}
📱 Phone: ${data.phone || 'Not provided'}
🏢 Company: ${data.company || 'Not provided'}
🏷️ Inquiry Type: ${data.type}
📝 Subject: ${data.subject}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message}
  `.trim();
}

function generateQuoteDescription(data: QuoteFormData): string {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 QUOTE REQUEST SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚚 Service Type: ${data.serviceType}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${data.name}
🏢 Company: ${data.company || 'Not provided'}
📧 Email: ${data.email}
📱 Phone: ${data.phone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 SHIPPING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Expected Volume: ${data.estimatedVolume || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 ADDITIONAL DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message || 'None'}
  `.trim();
}

function generateCareersDescription(data: CareersFormData): string {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 JOB APPLICATION SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: ${data.name}
📧 Email: ${data.email}
📱 Phone: ${data.phone}
💼 Desired Position: ${data.position}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 COVER LETTER / MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message || 'None'}
  `.trim();
}

/**
 * Check if error is related to custom field limits
 */
function isCustomFieldLimitError(errorText: string): boolean {
  return errorText.includes('FIELD_033') || 
         errorText.includes('Custom field usages exceeded') ||
         errorText.includes('custom_field') ||
         errorText.includes('limit');
}

/**
 * Send contact form submission to ClickUp
 */
export async function sendContactToClickUp(data: ContactFormData): Promise<void> {
  try {
    console.log('[ClickUp] Sending contact form to ClickUp:', data.name);
    const tags = generateTags('contact', data);
    
    // Build custom fields array
    const customFields = [
      { id: FIELD_IDS.LEAD_NAME, value: data.name },
      { id: FIELD_IDS.LEAD_EMAIL, value: data.email },
      { id: FIELD_IDS.LEAD_PHONE, value: data.phone || '' },
      { id: FIELD_IDS.LEAD_MESSAGE, value: data.message },
      { id: FIELD_IDS.INQUIRE_TYPE, value: data.type },
      { id: FIELD_IDS.INQUIRE_SUBJECT, value: data.subject },
    ];
    
    if (data.company) {
      customFields.push({ id: FIELD_IDS.LEAD_COMPANY, value: data.company });
    }

    const payload = {
      name: `SUPPORT CONTACT US - ${data.name}`,
      description: '', // Empty description when using custom fields
      priority: 1,
      tags,
      custom_fields: customFields,
    };

    try {
      await createClickUpTask(LIST_IDS.CONTACT, payload);
      console.log('[ClickUp] Contact form sent successfully with custom fields');
    } catch (error: any) {
      // If custom fields fail, retry with description fallback
      if (isCustomFieldLimitError(error.message || '')) {
        console.log('[ClickUp] Custom field limit reached, using description fallback');
        const fallbackPayload = {
          name: `SUPPORT CONTACT US - ${data.name}`,
          description: generateContactDescription(data),
          priority: 1,
          tags,
        };
        await createClickUpTask(LIST_IDS.CONTACT, fallbackPayload);
        console.log('[ClickUp] Contact form sent successfully with description fallback');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('[ClickUp] Failed to send contact to ClickUp:', error);
  }
}

/**
 * Send quote form submission to ClickUp
 */
export async function sendQuoteToClickUp(data: QuoteFormData): Promise<void> {
  try {
    console.log('[ClickUp] Sending quote form to ClickUp:', data.name);
    const tags = generateTags('quote', data);
    
    // Build custom fields array
    const customFields = [
      { id: FIELD_IDS.LEAD_NAME, value: data.name },
      { id: FIELD_IDS.LEAD_EMAIL, value: data.email },
      { id: FIELD_IDS.LEAD_PHONE, value: data.phone },
      { id: FIELD_IDS.SERVICE_TYPE, value: data.serviceType },
    ];
    
    if (data.company) {
      customFields.push({ id: FIELD_IDS.LEAD_COMPANY, value: data.company });
    }
    if (data.estimatedVolume) {
      customFields.push({ id: FIELD_IDS.EXPECTED_VOLUME, value: data.estimatedVolume });
    }
    if (data.message) {
      customFields.push({ id: FIELD_IDS.LEAD_MESSAGE, value: data.message });
    }

    const payload = {
      name: `PRICE QUOTE - ${data.name}`,
      description: '',
      priority: 1,
      tags,
      custom_fields: customFields,
    };

    try {
      await createClickUpTask(LIST_IDS.QUOTE, payload);
      console.log('[ClickUp] Quote form sent successfully with custom fields');
    } catch (error: any) {
      if (isCustomFieldLimitError(error.message || '')) {
        console.log('[ClickUp] Custom field limit reached, using description fallback');
        const fallbackPayload = {
          name: `PRICE QUOTE - ${data.name}`,
          description: generateQuoteDescription(data),
          priority: 1,
          tags,
        };
        await createClickUpTask(LIST_IDS.QUOTE, fallbackPayload);
        console.log('[ClickUp] Quote form sent successfully with description fallback');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('[ClickUp] Failed to send quote to ClickUp:', error);
  }
}

/**
 * Send careers form submission to ClickUp
 */
export async function sendCareersToClickUp(data: CareersFormData): Promise<void> {
  try {
    console.log('[ClickUp] Sending careers form to ClickUp:', data.name);
    const tags = generateTags('careers', data);
    
    // Build custom fields array
    const customFields = [
      { id: FIELD_IDS.LEAD_NAME, value: data.name },
      { id: FIELD_IDS.LEAD_EMAIL, value: data.email },
      { id: FIELD_IDS.LEAD_PHONE, value: data.phone },
      { id: FIELD_IDS.DESIRED_POSITION, value: data.position },
    ];
    
    if (data.message) {
      customFields.push({ id: FIELD_IDS.LEAD_MESSAGE, value: data.message });
    }

    const payload = {
      name: `CAREERS JOB APPLICATION - ${data.name}`,
      description: '',
      priority: 1,
      tags,
      custom_fields: customFields,
    };

    try {
      await createClickUpTask(LIST_IDS.CAREERS, payload);
      console.log('[ClickUp] Careers form sent successfully with custom fields');
    } catch (error: any) {
      if (isCustomFieldLimitError(error.message || '')) {
        console.log('[ClickUp] Custom field limit reached, using description fallback');
        const fallbackPayload = {
          name: `CAREERS JOB APPLICATION - ${data.name}`,
          description: generateCareersDescription(data),
          priority: 1,
          tags,
        };
        await createClickUpTask(LIST_IDS.CAREERS, fallbackPayload);
        console.log('[ClickUp] Careers form sent successfully with description fallback');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('[ClickUp] Failed to send careers application to ClickUp:', error);
  }
}

/**
 * Create a task in ClickUp
 */
async function createClickUpTask(listId: string, payload: any): Promise<void> {
  const url = `${CLICKUP_API_BASE}/list/${listId}/task`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLICKUP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ClickUp API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log('[ClickUp] Task created:', result.id);
}

/**
 * Get OAuth2 authorization URL
 */
export function getClickUpAuthUrl(redirectUri: string): string {
  return `https://app.clickup.com/api?client_id=${CLICKUP_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;
}
