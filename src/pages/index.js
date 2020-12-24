import Head from 'next/head'
import { useEffect, useState } from 'react';
import Layout from '../components/customer/Layout'
import jwt_decode from 'jwt-decode';
import { getDecodedTokenFromStorage } from '../utils/services/auth';
import theme from '../constants/theme';
import Footer from '../components/customer/footer';
import urls from '../utils/urls';
import axios from 'axios';

export default function Home() {
  const [user, setUser] = useState({ _id: '', fullName: '', mobile: '', city: '', licenseNo: '', address: '', email: '', status: '', role: '', wishList: '', cart: '', entry_date: '' })
  const [cart_count, setsetCart_count] = useState(0);

  useEffect(() => {
    const getDecodedToken = async () => {
      const decodedToken = await getDecodedTokenFromStorage();
      if (decodedToken !== null) {
        setUser(decodedToken);
        getUser(decodedToken._id);
      }
    }
    getDecodedToken();
    return () => { }
  }, []);

  async function getUser(id) {
    await axios.get(urls.GET_REQUEST.USER_BY_ID + id).then((res) => {
      setUser(res.data.data[0])
      if ('cart' in res.data.data[0])
        setCart_count(res.data.data[0].cart.length);
    }).catch((err) => {
      console.log('Get user error in profile', err);
    })
  }

  return (
    <div className="_container">
      <Head>
        <title>afghandarmaltoon</title>
        <link rel="icon" href="/logo.jpg" />
        <link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet" />
        <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossOrigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossOrigin="anonymous"></script>
      </Head>
      <main>
        <Layout user={user}>
          <h5 style={{ height: '500px', textAlign: 'center', marginTop: '200px' }}>
            Welcome to <a href="#">Afghan Darmal Toon</a>
          </h5>
        </Layout>
        <Footer />
      </main>
      <style jsx>{`
        ._container {
          background: ${theme.COLORS.WHITE};
          min-height: 100vh;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
        }
      `}</style>
      <style jsx global>{`
        html,
        body {
          min-height: 100vh;
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div >
  )
}
