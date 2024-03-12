import 'bootstrap/dist/css/bootstrap.css';
import '../styles/style.css';
import buildClient from '../api/buildClient';
import Header from '../components/Header';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <main className="text-light">
        <Component {...pageProps} currentUser={currentUser} />
        <Toaster
          position="top-center"
          reverseOrder={false}
          duration={3}
          toastOptions={{
            style: {
              background: 'linear-gradient(to bottom right, #011a22, #012a22)',
              color: 'whitesmoke',
            },
          }}
        />
      </main>
    </div>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return { pageProps, ...data };
};

export default MyApp;
