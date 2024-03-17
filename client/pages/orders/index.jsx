import TicketList from '../../components/TicketList';
import buildClient from '../../api/buildClient';

function OrderIndex({ orders = [] }) {
  const tickets = orders.map((order) => ({
    ...order.ticket,
    status: order.status,
  }));

  return (
    <TicketList
      tickets={tickets}
      type="orders"
      notFoundMessage="There is nothing in your cart...!"
    />
  );
}

export async function getServerSideProps(context) {
  try {
    const client = buildClient(context);
    const { data: orders } = await client.get('/api/orders');
    return { props: { orders } };
  } catch (error) {
    console.error(error.message);
    return {
      props: {},
    };
  }
}

export default OrderIndex;
