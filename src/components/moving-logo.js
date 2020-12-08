import React from 'react'
import { Image } from 'react-bootstrap'
export default function MovingLogo() {
    return (
        <div className='moving_logo'>
            <Image className='react-logo'
                src='/muhalik.jpg'
            />
            <style type="text/css">{`
                .moving_logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .react-logo {
                    animation-name:rotate;
                    animation-duration: 5s;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                }
                .react-logo , .react-logo:before , .react-logo:after{
                    width: 70px;
                    height: 70px;
                    // max-height: 70px;
                }
                .react-logo:before , .react-logo:after{
                    content:"";
                }
                .react-logo:after{
                    transform:rotate(-57deg);
                }
                .react-logo:before{
                    transform:rotate(57deg);
                }
                @keyframes rotate{
                    100%{
                        transform:rotate(360deg);
                    }
                }
            `}</style>
        </div>
    )
}
