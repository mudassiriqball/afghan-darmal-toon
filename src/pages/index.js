import Head from 'next/head'
import { useEffect, useState } from 'react';
import Layout from '../components/customer/Layout'
import jwt_decode from 'jwt-decode';
import { getDecodedTokenFromStorage, getTokenFromStorage } from '../utils/services/auth';
import consts from '../constants';
import Footer from '../components/customer/footer';
import urls from '../utils/urls';
import axios from 'axios';
import SliderCarousel from '../components/customer/slider-carousel';
import Loading from '../components/loading';
import InfoRow from '../components/customer/info-row';
import MultiCarosuel from '../components/customer/multi-carosuel';
import StickyBottomNavbar from '../components/customer/sticky-bottom-navbar';

export async function getServerSideProps(context) {
  let sliders_list = []
  let categories_list = []
  let sub_categories_list = []

  await axios.get(urls.GET_REQUEST.SLIDERS).then((res) => {
    sliders_list = res.data.data
  }).catch((err) => {
  })

  await axios.get(urls.GET_REQUEST.CATEGORIES).then((res) => {
    categories_list = res.data.category.docs
    sub_categories_list = res.data.sub_category.docs
  }).catch((err) => {
  })

  return {
    props: {
      sliders_list,
      categories_list,
      sub_categories_list,
    },
  }
}

export default function Home(props) {
  const [user, setUser] = useState({ _id: '', fullName: '', mobile: '', city: '', licenseNo: '', address: '', email: '', status: '', role: '', wishList: '', cart: '', entry_date: '' })
  const [token, setToken] = useState('');
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
    const getDecodedToken = async () => {
      const decodedToken = await getDecodedTokenFromStorage();
      if (decodedToken !== null) {
        setUser(decodedToken);
        getUser(decodedToken._id);
        const _token = await getTokenFromStorage();
        if (_token !== null)
          setToken(_token);
      }
    }
    getDecodedToken();

    return () => { }
  }, []);

  const getUser = async (id) => {
    await axios.get(urls.GET_REQUEST.USER_BY_ID + id).then((res) => {
      setUser(res.data.data[0]);
    }).catch((err) => {
      console.log('Get user err in profile', err);
    })
  }
  if (!showChild) {
    return <Loading />;
  }

  return (
    <div className="_container">
      <Head>
        <title>afghandarmaltoon</title>
        <link rel="icon" href="/logo.jpg" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
          integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
          crossorigin="anonymous"
        />
        {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"></link> */}
        {/* <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossOrigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossOrigin="anonymous"></script> */}
        <link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet" />
        <script src="https://unpkg.com/react/umd/react.production.min.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js" crossorigin></script>
        <script src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js" crossorigin></script>
      </Head>
      <main>
        <Layout
          user={user}
          categories_list={props.categories_list}
          sub_categories_list={props.sub_categories_list}
        >
          <SliderCarousel
            sliders_list={props.sliders_list}
          />
          <InfoRow />
        </Layout>
        <MultiCarosuel
          user={user}
          token={token}
          getUser={() => getUser(user._id)}
          categories_list={props.categories_list}
          sub_categories_list={props.sub_categories_list}
        />
        <Footer />
        <StickyBottomNavbar user={user} />
      </main>
      <style jsx>{`
        ._container {
          background: ${consts.COLORS.WHITE};
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
