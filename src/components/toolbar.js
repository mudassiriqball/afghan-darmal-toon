import React from 'react'
import { Navbar, Image, Nav } from 'react-bootstrap'
import GlobalStyleSheet from '../../styleSheet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Router from 'next/router'


export default function Toolbar(props) {
    const [isSticky, setSticky] = React.useState(false);
    const ref = React.useRef(null);
    const handleScroll = () => {
        if (ref.current) {
            setSticky(ref.current.getBoundingClientRect().top < 0);
        }
    };
    React.useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', () => handleScroll);
        };
    }, []);

    return (
        <div className='simple_toolbar'>
            <div className={`sticky-wrapper${isSticky ? ' sticky' : ''}`} ref={ref}>
                <Navbar className='sticky-inner p-1' >
                    <Nav.Link className='arrow_back' onClick={() => Router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.fontawesome} />
                    </Nav.Link>
                    <div className='mr-auto'></div>
                    <Navbar.Brand className='logo' onClick={props.home} >
                        <Image src="/muhalik.jpg" className='mahaalk_img' fluid />
                        <h4 className="text_animation">Mahaalk.com</h4>
                    </Navbar.Brand>
                    <Navbar.Brand className='heading'>{props.title}</Navbar.Brand>
                    <div className='mr-auto'></div>
                    <div className='mr-auto'></div>
                </Navbar>
            </div>
            <style type="text/css">{`
                .simple_toolbar .sticky-wrapper {
                    position: relative;
                    background: white;
                }
               .simple_toolbar .sticky .sticky-inner {
                    background: white;
                    position: fixed;
                    align-items: center;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000000;
                }
                .simple_toolbar .mahaalk_img{
                    width: 60px;
                    max-width: 60px;
                    height: 60px;
                    max-height: 60px;
                }

                .simple_toolbar .arrow_back{
                    display: none;
                }
                .simple_toolbar .logo{
                    display: inline-flex;
                    align-items: center;
                    cursor: pointer;
                    padding: 0%;
                    margin: 0%;
                }
                .simple_toolbar .heading {
                    display: none;
                }

                @media (max-width: 767px) {
                    .simple_toolbar .mahaalk_img{
                        width: 50px;
                        max-width: 50px;
                        height: 50px;
                        max-height: 50px;
                    }
                    .simple_toolbar .arrow_back{
                        display: flex;
                        align-items: center;
                    }
                    .simple_toolbar .logo{
                        display: none;
                    }
                    .simple_toolbar .heading {
                        display: flex;
                        color: ${GlobalStyleSheet.primry_color};
                    }
                }
            `}</style>
            <style jsx>{`
                .simple_toolbar .text_animation{
                    cusror: pointer;
                    animation: mymove 5s infinite;
                    color:  ${GlobalStyleSheet.primry_color};
                    margin: 0%;
                }
                @keyframes mymove {
                    50% {text-shadow: 10px 15px 3px ${GlobalStyleSheet.primry_color}}
                }

            `}</style>
            <style jsx global>{`
                html,
                body {
                    padding: 0;
                    margin: 0;
                    font-family: Roboto, Helvetica Neue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;
                }
            `}</style>
        </div >
    )
}

const styles = {
    fontawesome: {
        color: `${GlobalStyleSheet.primry_color}`,
        width: '20px',
        height: '20px',
        maxHeight: '20px',
        maxWidth: '20px',
    },
}
