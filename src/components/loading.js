import React from 'react'
import { Spinner } from 'react-bootstrap'


export default function Loading() {
    return (
        <>
            <div className='_div'>
                <Spinner animation="grow" variant="primary" />
                <Spinner animation="grow" variant="secondary" />
                <Spinner animation="grow" variant="success" />
                <Spinner animation="grow" variant="danger" />
                <Spinner animation="grow" variant="warning" />
                <Spinner animation="grow" variant="info" />
                <Spinner animation="grow" variant="dark" />
            </div>
            <style jsx>{`
                ._div{
                    display: flex;
                    justify-content: center;
                    margin: 5%;
                }
            `}</style>
        </>
    )
}
