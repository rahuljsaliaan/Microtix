import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRequest } from '../../hooks/useRequest';
import toast from 'react-hot-toast';

function NewTicket() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const router = useRouter();
  const { doRequest, isLoading, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => {
      router.push('/');
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();

    toast.promise(doRequest(), {
      loading: 'Loading',
      success: 'Ticket created successfully',
      error: 'Error when creating ticket',
    });

    setTitle('');
    setPrice('');
  }

  function onBlur() {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="text-light mb-5">Create a ticket</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-info bg-opacity-25 py-4 px-5 w-25 rounded-2"
      >
        <h2 className="text-info text-center mb-3">Enter ticket details</h2>
        <div className="form-group mb-3">
          <label htmlFor="ticket-title" className="text-light">
            Title
          </label>
          <input
            className="form-control"
            disabled={isLoading}
            type="test"
            id="ticket-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="ticket-price" className="text-light">
            Price
          </label>
          <input
            className="form-control"
            disabled={isLoading}
            type="number"
            id="ticket-price"
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {errors}
        <button className="btn btn-info text-light fw-semibold">Create</button>
      </form>
    </div>
  );
}

export default NewTicket;
