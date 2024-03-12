import buildClient from '../api/buildClient';

function index({ currentUser, tickets }) {
  return (
    <h1 className="text-light">
      {currentUser ? 'You are signed in' : 'Your are not signed in...!'}
    </h1>
  );
}

export async function getServerSideProps(context) {
  try {
    const client = buildClient(context);
    const { data: user } = await client.get('/api/users/currentuser');
    const { data: tickets } = await client.get('/api/tickets');
    return { props: { user, tickets } };
  } catch (error) {
    console.log(error.message);
    return {
      props: {},
    };
  }
}

export default index;
