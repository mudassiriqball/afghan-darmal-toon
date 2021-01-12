import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Row } from 'react-bootstrap';
import Footer from '../components/customer/footer';
import StickyBottomNavbar from '../components/customer/sticky-bottom-navbar';
import Toolbar from '../components/customer/toolbar'
import constants from '../constants';
import { checkTokenExpAuth } from '../utils/services/auth';
import urls from '../utils/urls';

export default function PrivacyPolicy(props) {
    const [user, setUser] = useState({
        _id: '', fullName: '', mobile: '', city: '', licenseNo: '', address: '',
        email: '', status: '', role: '', wishList: '', cart: '', entry_date: ''
    })

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        async function getData() {
            const _decoded_token = await checkTokenExpAuth()
            if (_decoded_token != null) {
                setUser(_decoded_token);
                await getUser(_decoded_token._id);
            }
        }
        getData()
        return () => {
            source.cancel();
            getData;
        };
    }, []);

    async function getUser(id) {
        await axios.get(urls.GET_REQUEST.USER_BY_ID + id).then((res) => {
            setUser(res.data.data[0]);
        }).catch((err) => {
            console.log('Get user error in PrivacyPolicy', err);
        })
    }
    return (
        <div className='div_main_help'>
            <Toolbar user={user} />
            <div className='_help'>
                <p>
                    Showing results for antipyretics background
                    Search instead for antiperytics background


                    Brief History of Antipyretic Therapy | Clinical Infectious Diseasesacademic.oup.com › cid › article › Supplement_5
                    Oct 1, 2000 — The origin of antipyretic therapy is not known. When Alexander the Great was stricken with the mysterious febrile illness that would take his life in 323 BC, the Babylonian physicians who cared for him prescribed cool baths as treatment for his unremitting fever [1].
                    by PA Mackowiak · ‎2000 · ‎Cited by 121 · ‎Related articles
                    Showing results for antipyretics background
                    Search instead for antiperytics background


                    Brief History of Antipyretic Therapy | Clinical Infectious Diseasesacademic.oup.com › cid › article › Supplement_5
                    Oct 1, 2000 — The origin of antipyretic therapy is not known. When Alexander the Great was stricken with the mysterious febrile illness that would take his life in 323 BC, the Babylonian physicians who cared for him prescribed cool baths as treatment for his unremitting fever [1].
                    by PA Mackowiak · ‎2000 · ‎Cited by 121 · ‎Related articles

                    Showing results for antipyretics background
                    Search instead for antiperytics background


                    Brief History of Antipyretic Therapy | Clinical Infectious Diseasesacademic.oup.com › cid › article › Supplement_5
                    Oct 1, 2000 — The origin of antipyretic therapy is not known. When Alexander the Great was stricken with the mysterious febrile illness that would take his life in 323 BC, the Babylonian physicians who cared for him prescribed cool baths as treatment for his unremitting fever [1].
                    by PA Mackowiak · ‎2000 · ‎Cited by 121 · ‎Related articles

                    Showing results for antipyretics background
                    Search instead for antiperytics background


                    Brief History of Antipyretic Therapy | Clinical Infectious Diseasesacademic.oup.com › cid › article › Supplement_5
                    Oct 1, 2000 — The origin of antipyretic therapy is not known. When Alexander the Great was stricken with the mysterious febrile illness that would take his life in 323 BC, the Babylonian physicians who cared for him prescribed cool baths as treatment for his unremitting fever [1].
                    by PA Mackowiak · ‎2000 · ‎Cited by 121 · ‎Related articles

                </p>
            </div>
            <Footer />
            <StickyBottomNavbar user={user} />
            <style type='text/css'>{`
                ._help{
                    padding: 2% 15%;
                    min-height: 90vh;
                }
                @media (max-width: 1199px){
                    ._help{
                        padding: 2% 12%;
                    }
                }
                @media (max-width: 991px){
                    ._help{
                        padding: 2% 9%;
                    }
                }
                 @media (max-width: 767px){
                    ._help{
                        padding: 2% 7%;
                    }
                }
                 @media (max-width: 575px){
                    ._help{
                        padding: 2% 5%;
                    }
                }
            `}</style>
            <style jsx>{`
                .div_main__cart {
                    min-height: 100vh;
                    background: ${constants.COLORS.WHITE};
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                }
            `}</style>
            <style jsx global>{`
                * {
                    font-family: Oswald,sans-serif;
                }
            `}</style>
        </div>
    )
}
