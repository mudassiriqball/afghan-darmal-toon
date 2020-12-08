import React, { Component } from 'react';
import axios from 'axios'
import { Form, Col, Button, Spinner } from 'react-bootstrap'
import { faListAlt, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'

import urls from '../../../../utils/urls'
import theme from '../../../../constants/theme'

import AlertModal from '../../../alert-modal';
import TitleRow from '../../../title-row';
import CardAccordion from '../../../card-accordion';

import { Formik } from 'formik';
import * as yup from 'yup';
import CreatableSelect from 'react-select/creatable';
import ConfirmModal from '../../../confirm-modal';

const schema = yup.object({
    sub_category: yup.string()
});

class HomeScreenCategories extends Component {
    state = {
        token: this.props.token,
        isLoading: false,
        showToast: false,
        toastMsg: '',
        showConfirmDeleteModal: false,

        home_categories_list: this.props.home_categories_list,
        categories_list: this.props.categories_list,

        category: '',

        delete_obj: {},
        delete_index: '',
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            token: nextProps.token,
            home_categories_list: nextProps.home_categories_list,
            categories_list: nextProps.categories_list,
        });
    }

    async addHomeCategory(values, currentComponent) {
        let data = {}
        data = {
            category_id: this.state.category._id,
            value: this.state.category.value,
            url: this.state.category.url
        }
        await axios.post(urls.POST_REQUEST.ADD_HOME_CATEGORY, data, {
            headers: {
                'authorization': currentComponent.state.token,
            }
        }).then(function (response) {
            currentComponent.setState({
                isLoading: false,
                toastMsg: 'Home Category Added Successfully',
                showToast: true,
                category: '',
            })
            currentComponent.props.homeCategoriesReloadHandler()
        }).catch(function (error) {
            currentComponent.setState({ isLoading: false });
            try {
                alert('Error: ', error.response.data.message);
            } catch (err) {
                console.log('Request Failed:', error)
            }
        });
    }
    handleCategoryChange = (e) => {
        this.setState({ category: e })
    }

    handleDelete(element, index) {
        this.setState({ showConfirmDeleteModal: true, delete_obj: element, delete_index: index })
    }

    async handleDeleteHomeCategory() {
        this.setState({ showConfirmDeleteModal: false })
        const currentComponent = this
        let copyArray = Object.assign([], this.state.home_categories_list)
        let obj = copyArray[this.state.delete_index]
        obj['isLoading'] = true
        copyArray[this.state.delete_index] = obj

        this.setState({ home_categories_list: copyArray })

        await axios.delete(urls.DELETE_REQUEST.DELETE_HOME_CATEGORY + this.state.delete_obj._id, {
            headers: {
                'authorization': currentComponent.state.token,
            }
        }).then(function (response) {
            currentComponent.setState({ toastMsg: 'Home Category Deleted Successfully', showToast: true })
            currentComponent.props.homeCategoriesReloadHandler()
        }).catch(function (error) {
            copyArray[this.state.delete_index].isLoading = false
            currentComponent.setState({ home_categories_list: copyArray });
            try {
                alert('Error: ', error.response.data.message);
            } catch (err) {
                console.log('Request Failed:', error)
            }
        });
    }

    render() {
        return (
            <Formik
                validationSchema={schema}
                initialValues={{ sub_category: '' }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    if (this.state.category == '') {
                        this.setState({ categoryError: 'Select/Enter Value' })
                    } else {
                        this.setState({ isLoading: true });
                        setSubmitting(true);
                        setTimeout(() => {
                            this.addHomeCategory(values, this)
                            setSubmitting(false);
                        }, 500);
                    }
                }}
            >
                {
                    ({
                        handleSubmit,
                        handleChange,
                        values,
                        touched,
                        isValid,
                        errors,
                        handleBlur,
                        isSubmitting
                    }) => (
                        <div className='add_home_category'>
                            <AlertModal
                                onHide={(e) => this.setState({ showToast: false })}
                                show={this.state.showToast}
                                header={'Success'}
                                message={this.state.toastMsg}
                                iconname={faThumbsUp}
                                color={"#00b300"}
                            />
                            <ConfirmModal
                                onHide={() => this.setState({ showConfirmDeleteModal: false })}
                                show={this.state.showConfirmDeleteModal}
                                iconname={faTrash}
                                color={'red'}
                                title={'Delete Home Category'}
                                _id={this.state.delete_obj._id}
                                name={this.state.delete_obj.value}
                                confirm={this.handleDeleteHomeCategory.bind(this)}
                            />
                            <TitleRow icon={faListAlt} title={' Admin Dashboard / Home Screen Categories'} />
                            <CardAccordion title={'Add New'}>
                                <Form.Row className='d-flex align-items-center justify-content-center'>
                                    <Form.Group as={Col} lg={6} md={6} sm={6} xs={12}>
                                        <Form.Label style={styles.label}> Select Category <span> * </span></Form.Label>
                                        <CreatableSelect
                                            id={'1'}
                                            instanceId={'1'}
                                            inputId={'1'}
                                            isClearable={false}
                                            value={this.state.category}
                                            onChange={this.handleCategoryChange}
                                            options={this.state.categories_list}
                                        />
                                        <Form.Row style={{ color: `${theme.COLORS.ERROR}`, fontSize: '13px', marginLeft: '2px' }}>
                                            {this.state.categoryError}
                                        </Form.Row>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row className='d-flex align-items-center justify-content-center'>
                                    <Form.Group as={Col} lg={6} md={6} sm={6} xs={12}>
                                        <Button onClick={handleSubmit} size='sm' disabled={this.state.isLoading || this.state.category == ''} block className='mt-5'>
                                            {this.state.isLoading ? 'Uploading' : 'Add Category'}
                                            {this.state.isLoading ? <Spinner animation="grow" size="sm" /> : null}
                                        </Button>
                                    </Form.Group>
                                </Form.Row>
                            </CardAccordion>
                            <CardAccordion title={'All Home Categories'}>
                                {this.state.home_categories_list && this.state.home_categories_list.map((element, index) =>
                                    <Form.Row key={index}>
                                        <Form.Group as={Col} lg={5} md={5} sm={5} xs={12}>
                                            <Form.Control
                                                value={element.category_id}
                                                disabled={true}
                                                size='sm'
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} lg={5} md={5} sm={5} xs={12}>
                                            <Form.Control
                                                value={element.value}
                                                disabled={true}
                                                size='sm'
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} lg={2} md={2} sm={2} xs={12}>
                                            <Button onClick={() => this.handleDelete(element, index)} variant='outline-danger' size='sm' disabled={element.isLoading} block >
                                                {element.isLoading ? 'Deleting' : 'Delete'}
                                                {element.isLoading ? <Spinner animation="grow" size="sm" /> : null}
                                            </Button>
                                        </Form.Group>
                                    </Form.Row>
                                )}
                            </CardAccordion>
                            <style type="text/css">{`
                                    .add_home_category .card-body{
                                        height: 50vh;
                                    }
                                `}</style>
                            <style jsx>{`
                                    .add_home_category p{
                                        font-size: 13px;
                                        text-align: center;
                                        align-self: center;
                                        width: 100%;
                                        margin-top: 5px;
                                    }
                                    .add_home_category span{
                                        color: red;
                                    }
                                `}</style>
                        </div >
                    )
                }
            </Formik>
        );
    }
}

export default HomeScreenCategories;

const styles = {
    label: {
        fontSize: `${theme.SIZES.LABEL}`
    },
}
