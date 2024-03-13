import Link from 'next/link';
import buildClient from '../api/buildClient';

function index({ currentUser, tickets }) {
  return (
    <section className="py-5 px-5">
      <div className="row mt-5">
        {tickets.map((ticket, index) => (
          <div className="col-sm-2 d-flex" key={index}>
            <div className="card text-light bg-info bg-opacity-25 rounded-2 hover-effect flex-grow-1 d-flex flex-column">
              <Link
                href="/tickets/[ticketId]"
                className="nav-link"
                as={`/tickets/${ticket.id}`}
              >
                <div className="card-body overflow-hidden">
                  <img
                    className="ticket-img"
                    src="images/ticket.png"
                    alt="ticket"
                  />
                  <h5 className="card-title">{ticket.title}</h5>
                  <p className="card-text price-box mt-2">₹{ticket.price}</p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
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
