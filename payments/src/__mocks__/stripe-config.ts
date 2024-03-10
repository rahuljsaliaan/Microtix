import Stripe from 'stripe';

// Define the structure of the Stripe data
interface StripeData {
  data: {
    object: {
      client_reference_id: string;
      id: string;
    };
  };
  type?: string;
}

const generateFakeStripeId = (): string => {
  // Generate a random alphanumeric string of length 24
  const randomId = [...Array(24)]
    .map(() => Math.random().toString(36)[2])
    .join('');

  return `cs_${randomId}`;
};

// Define the Stripe object
export const stripe = {
  webhooks: {
    // This function constructs a Stripe event
    constructEvent: (
      body: StripeData,
      signature: string,
      secret: string
    ): StripeData => {
      // Extract the order ID from the body
      const {
        data: {
          object: { client_reference_id: orderId, id },
        },
      } = body;

      // Create a new StripeData object
      const newStripeData: StripeData = {
        data: {
          object: { client_reference_id: orderId, id },
        },
        type: 'checkout.session.completed',
      };

      return newStripeData;
    },
  },
};
