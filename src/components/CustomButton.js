import React from 'react'
import { Button, Spinner } from 'react-bootstrap'

export default function CustomButton(props) {
    const { type, block, disabled, href, size, variant, loading, title, spinnerVariant, onClick } = props;
    return (
        <Button variant={variant ? variant : 'danger'} {...props}>
            {loading && <Spinner animation="border" size={'sm'} style={{ marginRight: 5 }} role="status" variant={spinnerVariant} />}
            {props.children}
            {title}
        </Button>
    )
}
