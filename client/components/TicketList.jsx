import Placeholder from './Placeholder';
import Link from 'next/link';

function TicketCardBody({ ticket, type = 'tickets' }) {
  const orderStatusStyles = {
    cancelled: 'btn-danger',
    created: 'btn-info',
    complete: 'btn-success',
  };

  return (
    <div className="card-body overflow-hidden">
      <img className="ticket-img" src="images/ticket.png" alt="ticket" />
      <h5 className="card-title">{ticket.title}</h5>
      <p className="card-text price-box mt-2">₹{ticket.price}</p>
      {type === 'orders' && (
        <p className={`card-test mt-2 btn ${orderStatusStyles[ticket.status]}`}>
          {ticket.status}
        </p>
      )}
    </div>
  );
}

function TicketList({
  tickets,
  type = 'tickets',
  notFoundMessage = 'No Tickets yet...!',
}) {
  return (
    <section className="py-5 px-5">
      <div className="row mt-5">
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <div className="col-sm-2 d-flex" key={index}>
              <div className="card text-light bg-info bg-opacity-25 rounded-2 hover-effect flex-grow-1 d-flex flex-column">
                {type === 'tickets' ? (
                  <Link
                    href="/tickets/[ticketId]"
                    className="nav-link"
                    as={`/tickets/${ticket.id}`}
                  >
                    <TicketCardBody ticket={ticket} />
                  </Link>
                ) : (
                  <TicketCardBody ticket={ticket} type={type} />
                )}
              </div>
            </div>
          ))
        ) : (
          <Placeholder
            source="images/not-found.svg"
            message={notFoundMessage}
          />
        )}
      </div>
    </section>
  );
}

export default TicketList;
