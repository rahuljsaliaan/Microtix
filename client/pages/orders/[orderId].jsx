import { useEffect } from 'react';
import createPaymentSession from '../../services/createPaymentSession';

function OrderShow({ orderId }) {
  useEffect(() => {
    // Call createPaymentSession when the component mounts
    createPaymentSession(orderId);
  }, [orderId]);

  return (
    <div className="center-div">
      <h1>Redirecting...</h1>
    </div>
  );
}

export default OrderShow;

export async function getServerSideProps(context) {
  const { orderId } = context.query;

  // Pass orderId as a prop to your component
  return { props: { orderId } };
}
