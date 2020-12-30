import React from 'react'
import { Button, Spinner } from 'react-bootstrap'

export default function CustomButton(props) {
    const { variant, loading, title, spinnerVariant } = props;
    return (
        <Button
            variant={variant ? variant : 'danger'}
            {...props}
        >
            {loading && <Spinner animation="border" size={'sm'} style={{ marginRight: 5 }} role="status" variant={spinnerVariant} />}
            {props.children}
            {title}
        </Button>
    )
}
