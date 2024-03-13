import toast from 'react-hot-toast';
import buildClient from '../api/buildClient';

const stripeKey =
  'pk_test_51OsSDESAuuW6V045w1WgSQ8S5jjF7fMbcQqRpAQg6JfQ85gnHh57getk11fgiZ0daXNrqW7YJKMQdaxGJhSXe27Z00fdo6OrMK';

async function createPaymentSession(orderId) {
  try {
    const client = buildClient();

    const session = await client.get(
      `/api/payments/checkout-session/${orderId}`
    );

    console.log(session);

    // 2) Create checkout form + charge credit card
    if (window.Stripe) {
      const stripe = window.Stripe(stripeKey);
      await stripe.redirectToCheckout({
        sessionId: session.data.id,
      });
    }
  } catch (error) {
    console.error(error.message);
    toast.error(error.message);
  }
}

export default createPaymentSession;
