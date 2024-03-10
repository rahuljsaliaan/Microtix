import Stripe from 'stripe';

// Define the structure of the Stripe data
interface StripeData {
  data: {
    object: {
      client_reference_id: string;
    };
  };
  type?: string;
}

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
          object: { client_reference_id: orderId },
        },
      } = body;

      // Create a new StripeData object
      const newStripeData: StripeData = {
        data: { object: { client_reference_id: orderId } },
        type: 'checkout.session.completed',
      };

      return newStripeData;
    },
  },
};
