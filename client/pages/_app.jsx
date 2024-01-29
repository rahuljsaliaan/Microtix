import 'bootstrap/dist/css/bootstrap.css';
import '../styles/style.css';
import buildClient from '../api/buildClient';
import Header from '../components/Header';

function MyApp({ Component, pageProps, currentUser }) {
  console.log(currentUser);
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </div>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { pageProps, ...data };
};

export default MyApp;
