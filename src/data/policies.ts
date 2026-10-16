// Store policies shown at /privacy, /terms and /refund (footer links).
// Have the text reviewed by a legal advisor before going live.

export const STORE_LEGAL = {
  businessName: 'Daivisha Vastra',
  email: '', // add a support email here to show it in the policies
  phone: '+91 81470 36004 (call or WhatsApp)',
  address: 'CC Swastik, C Block, RK Colony, Manjunatha Layout, JP Nagar 2nd Phase, Bengaluru 560078 (opposite SVS PG)',
  jurisdictionCity: 'Bengaluru',
  grievanceOfficer: 'the store owner', // replace with the grievance officer's name
};

export type PolicyId = 'privacy' | 'terms' | 'refund';

export interface PolicySection {
  heading: string;
  paragraphs?: string[];
  points?: string[];
}

export interface Policy {
  title: string;
  intro: string;
  updated: string;
  sections: PolicySection[];
}

const L = STORE_LEGAL;
const contactLine = [L.email && `Email ${L.email}`, `Phone ${L.phone}`, L.address].filter(Boolean).join(' · ');

export const POLICIES: Record<PolicyId, Policy> = {
  privacy: {
    title: 'Privacy Policy',
    updated: '16 October 2026',
    intro: `${L.businessName} respects your privacy. This policy explains what information we collect when you browse or shop with us, how we use it, and the choices you have. It is written to follow India's Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.`,
    sections: [
      {
        heading: 'Information we collect',
        points: [
          'Contact details you give us: name, email address, phone number and shipping / billing address.',
          'Order details: the sarees you buy, sizes or blouse preferences, order value and delivery status.',
          'Payment confirmation from our payment partners. We do not store your full card number, CVV or UPI PIN.',
          'Messages you send us on WhatsApp, email or phone, and appointment requests such as bridal consultations.',
          'Basic technical data such as browser type and pages visited, used to keep the website working well.',
        ],
      },
      {
        heading: 'How we use your information',
        points: [
          'To process, pack, ship and deliver your orders and send order updates by SMS, email or WhatsApp.',
          'To handle returns, exchanges, refunds and customer support requests.',
          'To schedule and confirm styling or bridal consultations you book with us.',
          'To send offers and new-collection updates — only if you have opted in. You can unsubscribe at any time.',
          'To prevent fraud and meet our legal, tax and accounting obligations.',
        ],
      },
      {
        heading: 'Who we share it with',
        paragraphs: [
          'We never sell your personal information. We share only what is needed with trusted partners who help us run the store — payment gateways, courier and logistics partners, and messaging providers — and only for the purposes above. We may also disclose information when required by law or a government authority.',
        ],
      },
      {
        heading: 'Cookies and browser storage',
        paragraphs: [
          'Our website stores small pieces of data in your browser (such as your shopping bag, wishlist and applied coupon) so they are remembered between visits. You can clear this at any time from your browser settings; some features may stop working until you add items again.',
        ],
      },
      {
        heading: 'How long we keep it',
        paragraphs: [
          'We keep order and invoice records for as long as Indian tax and accounting laws require. Other personal data is kept only as long as needed for the purposes above, and then deleted or anonymised.',
        ],
      },
      {
        heading: 'Your rights',
        points: [
          'Ask for a summary of the personal data we hold about you.',
          'Ask us to correct, update or complete your information.',
          'Ask us to delete your data, subject to records we must keep by law.',
          'Withdraw consent for marketing messages at any time.',
          'Nominate another person to exercise these rights on your behalf.',
        ],
      },
      {
        heading: 'Keeping your data safe',
        paragraphs: [
          'Payments are processed over encrypted connections by our payment partners. We limit access to personal data to people who need it to serve you, and we take reasonable security measures to protect it.',
        ],
      },
      {
        heading: 'Grievance officer & contact',
        paragraphs: [
          `For any privacy question, request or complaint, contact ${L.grievanceOfficer}. ${contactLine}. We aim to respond within 7 working days.`,
        ],
      },
    ],
  },

  terms: {
    title: 'Terms & Conditions',
    updated: '16 October 2026',
    intro: `These terms apply when you use the ${L.businessName} website or buy from us. By placing an order you agree to them, so please read them carefully.`,
    sections: [
      {
        heading: 'About our products',
        points: [
          'Our sarees are handwoven or hand-finished. Small irregularities in weave, colour or zari are a natural mark of handloom craft and are not defects.',
          'We photograph every saree carefully, but colours can look slightly different depending on your screen and lighting.',
          'Saree length, blouse piece and fabric details are listed on each product page. Please read them before ordering.',
        ],
      },
      {
        heading: 'Prices and payment',
        points: [
          'All prices are in Indian Rupees (₹) and include applicable GST unless stated otherwise.',
          'We accept UPI, debit and credit cards and net banking. Cash on Delivery is not available.',
          'Prices and offers may change without notice. The price shown when you place your order is the price you pay.',
          'If a product is listed at an obviously wrong price because of an error, we may cancel the order and refund you in full.',
        ],
      },
      {
        heading: 'Orders',
        points: [
          'An order is confirmed only when you receive our order confirmation.',
          'We may cancel an order if a product is out of stock, the payment fails, or the order looks fraudulent. Any amount paid will be refunded in full.',
          'Each customer may use a coupon code only as described in its offer. Coupons cannot be exchanged for cash and cannot be combined unless stated.',
        ],
      },
      {
        heading: 'Shipping and delivery',
        points: [
          'We ship across India. Estimated delivery dates are shown at checkout and in your order updates.',
          'Delivery times are estimates; delays caused by couriers, weather or events outside our control are not our responsibility, but we will always help you track your parcel.',
          'Please check the package on delivery. Report any visible damage or tampering as described in our Refund Policy.',
        ],
      },
      {
        heading: 'Returns and refunds',
        paragraphs: ['Returns, exchanges, cancellations and refunds are covered by our Refund Policy, which forms part of these terms.'],
      },
      {
        heading: 'Use of this website',
        points: [
          'All photographs, designs, text and the Daivisha Vastra name and logo belong to us. Please do not copy or reuse them without written permission.',
          'You agree not to misuse the website, attempt to break its security, or place orders using false information.',
        ],
      },
      {
        heading: 'Limitation of liability',
        paragraphs: [
          'To the extent allowed by law, our total liability for any order is limited to the amount you paid for that order. We are not liable for indirect or consequential losses.',
        ],
      },
      {
        heading: 'Governing law',
        paragraphs: [
          `These terms are governed by the laws of India. Any dispute will be subject to the exclusive jurisdiction of the courts in ${L.jurisdictionCity}.`,
        ],
      },
      {
        heading: 'Contact us',
        paragraphs: [`Questions about these terms? ${contactLine}.`],
      },
    ],
  },

  refund: {
    title: 'Refund & Return Policy',
    updated: '16 October 2026',
    intro: 'We want you to love every saree you receive. If something is not right, here is how returns, exchanges, cancellations and refunds work.',
    sections: [
      {
        heading: '48-hour returns, refunds & exchanges',
        points: [
          'Return, refund or exchange requests are accepted only within 48 hours of delivery.',
          'The saree must be unused, unwashed and unaltered, with all original tags, the blouse piece and packaging included.',
          'To start a return, contact us on WhatsApp or email with your order number and the reason.',
        ],
      },
      {
        heading: 'Items we cannot return',
        points: [
          'Sarees that have been worn, washed, altered, or had fall, pico or blouse stitching done.',
          'Custom, made-to-order or personalised pieces, including stitched blouses.',
          'Items marked as final sale or bought during clearance offers.',
          'Products returned without tags or the blouse piece.',
        ],
      },
      {
        heading: 'Damaged or wrong item',
        paragraphs: [
          'If your saree arrives damaged, defective or different from what you ordered, tell us within 48 hours of delivery and share photos and an unboxing video. Once approved, we will send a replacement or a refund.',
        ],
      },
      {
        heading: 'Cancellations',
        points: [
          'You can cancel for a full refund any time before your order is dispatched.',
          'Once dispatched, the order cannot be cancelled, but you may return it under this policy after delivery.',
        ],
      },
      {
        heading: 'Refunds',
        points: [
          'Once we receive and check your return, we will confirm by email or WhatsApp — usually within 2–3 working days.',
          'Approved refunds are made to the original payment method (UPI, card or net banking) within 5–7 working days.',
        ],
      },
      {
        heading: 'Contact us',
        paragraphs: [`For any return or refund help: ${contactLine}.`],
      },
    ],
  },
};
