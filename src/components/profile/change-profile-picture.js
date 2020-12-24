import React from 'react'
import axios from 'axios'
import { Card, Form, Col, Row, Image, Button, InputGroup, Spinner } from 'react-bootstrap'
import urls from '../../utils/urls'
import theme from '../../constants/theme'
import CustomButton from '../CustomButton'

import { BsUpload } from 'react-icons/bs';

export default function ChangrProfilePicture(props) {
    const [token, setToken] = React.useState(null)
    const [img, setImg] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)

    function handleImgUpload() {
        setIsLoading(true);
        let uploaded = false;
        let secure_url = '';
        this.setState({ isLoading: true });
        const data = new FormData();
        data.append('file', img);
        data.append('upload_preset', 'afghandarmaltoon');
        fetch('https://api.cloudinary.com/v1_1/dhm7n3lg7/image/upload', {
            method: 'POST',
            body: data,
        }).then(async res => {
            uploaded = true;
            let dataa = await res.json();
            secure_url = dataa.secure_url;
            console.log('ImageUrl:', dataa.secure_url)
            setIsLoading(false);
        }).catch(err => {
            uploaded = false;
            console.log('error:', err)
            setIsLoading(false);
            alert("Error", "An Error Occured While Uploading")
            return;
        })
        if (uploaded) {
            axios.put(urls.PUT_REQUEST.UPDATE_USER_PROFILE + props._id, { avatar: secure_url }, {
                headers: {
                    'authorization': props.token,
                }
            }).then((response) => {
                setIsLoading(false)
                setImg('')
                props.showAlert('Image Uploaded Successfully')
                props.reloadUser()
            }).catch((error) => {
                setIsLoading(false)
                alert('Error');
            });
        }
    }

    return (
        <div className='change_picture'>
            {!props.isMobile && <label className='heading'>{'Change Profile Picture'}</label>}
            <Card>
                <Card.Body className='card_body'>
                    <Form.Group as={Row} className='profile_img_col'>
                        <Image src={img != '' ? URL.createObjectURL(img) : props.avatar} roundedCircle thumbnail fluid
                            style={{ minWidth: '100px', maxWidth: '100px', minHeight: '100px', maxHeight: '100px' }} />
                    </Form.Group>
                    <hr />
                    <Form.Group as={Col}>
                        <InputGroup className='profile_img_col'>
                            <Form.File
                                size='sm'
                                className="position-relative"
                                style={{ color: 'gray' }}
                                required
                                name="file"
                                onChange={(e) => setImg(e.target.files[0])}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Row} className='profile_img_col btn_row mt-5'>
                        <CustomButton
                            block
                            loading={isLoading}
                            disabled={img == '' || isLoading}
                            title={'Upload'}
                            onClick={handleImgUpload}
                        >
                            {!isLoading && <BsUpload style={{ fontSize: '20px', marginRight: '10px', color: theme.COLORS.WHITE }} />}
                        </CustomButton>
                    </Form.Group>
                </Card.Body>
            </Card>
            <style type="text/css">{`
                .change_picture .card {
                    border: none;
                    background: rgb(165,64,162);
                    // background: linear-gradient(135deg, ${theme.COLORS.MAIN} 0%, ${theme.COLORS.SEC} 100%);
                    background: white;
                    min-height: 200px;
                }
                .change_picture .card-header {
                    display: inline-flex;
                    align-items: center;
                    font-size: 15px;
                    font-weight: bold;
                    color: ${theme.COLORS.TEXT};
                    border: none;
                    padding-bottom: 0%;
                    background: none;
                }
                .change_picture .profile_pic_div {
                    padding: 5px;
                }
                .change_picture .heading {
                    font-size: 18px;
                    margin-top: 10px;
                    width: 100%;
                }
                .change_picture .profile_img_col {
                    display:flex;
                    align-items: center;
                    justify-content: center;
                }
                 @media (max-width: 767px){
                    .change_picture {
                        padding: 1.5%;
                    }
                    .change_picture .profile_img_col {
                        padding: 0%;
                    }
                    .change_picture .card_body {
                        padding: 5%;
                    }
                    .btn_row {
                        margin: 0%;
                    }
                }
            `}</style>
        </div>
    )
}