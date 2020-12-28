import { Row } from 'react-bootstrap'

export default function NoDataFound() {
    return (
        <div className='min-vw-100 d-flex  justify-content-center align-items-center' style={{ minHeight: '70vh' }}>
            <h6 className='text-center w-100' style={{ color: 'gray' }}>{'No Data Found'}</h6>
        </div>
    )
}
