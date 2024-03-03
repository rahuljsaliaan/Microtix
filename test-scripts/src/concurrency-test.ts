import axios from 'axios';
import https from 'https';

interface Ticket {
  id: string;
  title: string;
  price: number;
  version: number;
}

let count = 1;

const registerUser = async () => {
  const response = await axios.post(
    'https://microtix.dev/api/users/signup',
    {
      email: `rahuljsaliaanss${count++}@gmail.com`,
      password: 'Rahul@123',
    },
    {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }
  );

  const cookie = response.headers['set-cookie'];

  return cookie?.[0] || '';
};

const createTicket = async (cookie: string): Promise<Ticket> => {
  const response = await axios.post(
    'https://microtix.dev/api/tickets',
    {
      title: 'test',
      price: 200,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        cookie,
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }
  );

  if (response.status !== 201) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.data;
};

const updateTicket = async (cookie: string, ticket: Ticket) => {
  const response = await axios.put(
    `https://microtix.dev/api/tickets/${ticket.id}`,
    {
      title: 'test',
      price: 400,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        cookie,
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }
  );

  if (response.status !== 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.data;
};

const doRequest = async () => {
  for (let i = 0; i < 100; i++) {
    const cookie = await registerUser();
    const ticket = await createTicket(cookie);
    await updateTicket(cookie, ticket);
  }
};

doRequest();
