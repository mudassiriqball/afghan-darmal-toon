import { Row } from 'react-bootstrap'
import translate from '../../i18n/translate'

export default function NoDataFound() {
    return (
        <Row className='h-100 p-5 w-100'>
            <div className='h-100 w-100 d-flex justify-content-center align-items-center'>
                <h6 className='text-center w-100' style={{ color: 'gray' }}>{translate('no_data_found')}</h6>
            </div>
        </Row>
    )
}
