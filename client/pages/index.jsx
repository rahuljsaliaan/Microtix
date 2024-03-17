
import buildClient from '../api/buildClient';
import TicketList from '../components/TicketList';

function index({ currentUser, tickets = [] }) {
  return <TicketList tickets={tickets} />;
}

export async function getServerSideProps(context) {
  try {
    const client = buildClient(context);
    const { data: user } = await client.get('/api/users/currentuser');
    const { data: tickets } = await client.get('/api/tickets');
    return { props: { user, tickets } };
  } catch (error) {
    console.error(error.message);
    return {
      props: {},
    };
  }
}

export default index;
