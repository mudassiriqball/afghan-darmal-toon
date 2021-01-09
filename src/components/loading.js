import React from 'react'
import { Spinner } from 'react-bootstrap'


export default function Loading() {
    return (
        <>
            <div className='_div' style={{ flex: 1 }}>
                <Spinner animation="border" variant="primary" />
            </div>
            <style jsx>{`
                ._div{
                    display: flex;
                    justify-content: center;
                    margin: 5%;
                    height: 100%;
                }
            `}</style>
        </>
    )
}
