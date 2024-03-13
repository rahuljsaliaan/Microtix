import { useRouter } from 'next/router';
import buildClient from '../../api/buildClient';
import { useRequest } from '../../hooks/useRequest';
import createPaymentSession from '../../services/createPaymentSession';

function TicketShow({ ticket }) {
  const router = useRouter();
  const { doRequest, isLoading, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div className="card text-light bg-info bg-opacity-25 rounded-2 center-div">
      <div className="card-body">
        <div className="w-100 d-flex justify-content-center align-items-center">
          <img className="ticket-img-2" src="/images/ticket.png" alt="ticket" />
        </div>
        <h2>{ticket.title}</h2>
        <div className="w-100 mt-3 d-flex justify-content-between align-items-center">
          <p className="price-box mt-2">₹{ticket.price}</p>
          <button
            disabled={isLoading}
            onClick={doRequest}
            className="btn btn-info text-light fw-bold display-4"
          >
            {isLoading ? 'Purchasing' : 'Purchase'}
          </button>
        </div>
      </div>
      {errors}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const client = buildClient(context);
    const { ticketId } = context.query;
    const { data: ticket } = await client.get(`/api/tickets/${ticketId}`);
    return { props: { ticket } };
  } catch (error) {
    console.error(error.message);
    return {
      props: {},
    };
  }
}

export default TicketShow;
