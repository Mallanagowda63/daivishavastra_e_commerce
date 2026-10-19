// Store policies, opened from the footer links.

export type PolicyId = 'refund' | 'shipping' | 'privacy' | 'terms';

export interface PolicySection {
  heading: string;
  text: string;
}

export interface Policy {
  title: string;
  subtitle: string;
  sections: PolicySection[];
}

/** Order the policy tabs appear in. */
export const POLICY_TABS: { id: PolicyId; label: string }[] = [
  { id: 'refund', label: 'Returns & Exchange' },
  { id: 'shipping', label: 'Shipping & Logistics' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms & Conditions' },
];

export const POLICIES: Record<PolicyId, Policy> = {
  refund: {
    title: 'Returns & Exchange Policy',
    subtitle: 'No monetary refunds',
    sections: [
      {
        heading: 'No Refunds',
        text: 'Payments are non-refundable. We do not provide monetary refunds once an order has been confirmed.',
      },
      {
        heading: 'Return or Exchange Only',
        text: 'Eligible items may be returned for exchange or replacement only, subject to inspection and approval. Returns do not mean a cash refund.',
      },
      {
        heading: 'Report an Issue Promptly',
        text: 'Contact us as soon as possible after delivery if the item received is damaged, defective or incorrect. Share your order details and clear photos so we can review the request.',
      },
      {
        heading: 'Conditions',
        text: 'Items should be unused, unwashed, unaltered and returned with original tags and packaging. Final eligibility, return window and shipping responsibility should be confirmed with us before dispatching an item back.',
      },
    ],
  },

  shipping: {
    title: 'Shipping & Logistics',
    subtitle: 'A clear, careful journey from us to you',
    sections: [
      {
        heading: 'Prepaid Orders Only',
        text: 'Cash on Delivery (COD) is not available. All orders must be paid for in advance.',
      },
      {
        heading: 'Shipping Charges',
        text: 'Shipping charges, estimated dispatch timelines and delivery details will be shared before order confirmation.',
      },
      {
        heading: 'Delivery Timelines',
        text: 'Delivery times may vary by destination, courier operations, weather and other factors outside our control. Tracking details will be shared when available.',
      },
      {
        heading: 'Please Check Your Parcel',
        text: 'If the parcel appears damaged or the item received is incorrect, contact us promptly with the order details and photos so we can review the issue.',
      },
      {
        heading: 'Returns & Exchanges',
        text: 'No monetary refunds. Eligible returns are for exchange or replacement only, subject to the Returns & Exchange Policy.',
      },
    ],
  },

  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Your information should be handled with care',
    sections: [
      {
        heading: 'Information We Collect',
        text: 'We may collect the name, phone number, delivery address, order details and messages you choose to share when enquiring or placing an order.',
      },
      {
        heading: 'How We Use It',
        text: 'Information is used to respond to enquiries, process orders, arrange delivery, provide order updates and support eligible return or exchange requests.',
      },
      {
        heading: 'Sharing & Security',
        text: 'Necessary details may be shared with payment or shipping service providers to fulfil your order. We aim to limit access and do not intend to sell personal information.',
      },
      {
        heading: 'Your Choices',
        text: 'Contact us to ask about the information associated with your order or to request correction of inaccurate contact or delivery details.',
      },
    ],
  },

  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Please review before placing an order',
    sections: [
      {
        heading: 'Product Details',
        text: 'Colours may appear slightly different across screens. Product details, fabric names, borders and embellishments are listed to the best of our available information; please ask us to confirm any detail before ordering.',
      },
      {
        heading: 'Orders & Payment',
        text: 'Orders are confirmed after payment and availability confirmation. Cash on Delivery (COD) is not available; orders must be prepaid.',
      },
      {
        heading: 'Pricing & Availability',
        text: 'Prices and stock are subject to confirmation. Shipping charges, where applicable, are communicated before the order is finalised.',
      },
      {
        heading: 'Customer Responsibility',
        text: 'Please check the order summary, delivery details and product selection before payment. Keep packaging and order details if you need to request an exchange or return.',
      },
    ],
  },
};
