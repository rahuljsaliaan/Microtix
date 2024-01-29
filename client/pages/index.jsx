import buildClient from '../api/buildClient';

function index({ currentUser }) {
  return (
    <h1 className="text-light">
      {currentUser ? 'You are signed in' : 'Your are not signed in...!'}
    </h1>
  );
}

export async function getServerSideProps(context) {
  try {
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');
    return { props: data };
  } catch (error) {
    console.log(error.message);
    return {
      props: {},
    };
  }
}

export default index;
