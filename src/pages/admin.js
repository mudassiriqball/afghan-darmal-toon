import React, { Component } from 'react';
import Router from 'next/router'
import axios from 'axios'
import Dashboard from '../components/admin/dashboard';
import DashboardSideDrawer from '../components/admin/dashboard-side-drawer';
import theme from '../constants/theme';
import urls from '../utils/urls/index'
import { checkTokenExpAuth, removeTokenFromStorage, getTokenFromStorage } from '../utils/services/auth';

export async function getServerSideProps(context) {
    let sliders_list = []
    let categories_list = []
    let sub_categories_list = []
    let home_categories_list = []

    let admins_count = 0
    let vendors_count = 5
    let new_vendors_count = 0
    let restricted_vendors_count = 0
    let customers_count = 0
    let restricted_customers_count = 0

    let pending_orders_count = 0
    let delivered_orders_count = 0
    let cancelled_orders_count = 0
    let returned_orders_count = 0

    await axios.get(urls.GET_REQUEST.ALL_CUSTOMER_COUNT).then((res) => {
        admins_count = res.data.admins_count
        vendors_count = res.data.vendors_count
        new_vendors_count = res.data.new_vendors_count
        restricted_vendors_count = res.data.restricted_vendors_count
        customers_count = res.data.customers_count
        restricted_customers_count = res.data.restricted_customers_count
    }).catch((error) => {
    })

    await axios.get(urls.GET_REQUEST.ALL_ORDERS_COUNT).then((res) => {
        pending_orders_count = res.data.pending_orders_count
        delivered_orders_count = res.data.delivered_orders_count
        cancelled_orders_count = res.data.cancelled_orders_count
        returned_orders_count = res.data.returned_orders_count
    }).catch((error) => {
    })

    await axios.get(urls.GET_REQUEST.SLIDERS).then((res) => {
        sliders_list = res.data.data
    }).catch((error) => {
    })

    await axios.get(urls.GET_REQUEST.CATEGORIES).then((res) => {
        categories_list = res.data.category.docs
        sub_categories_list = res.data.sub_category.docs
    }).catch((error) => {
    })

    await axios.get(urls.GET_REQUEST.HOME_CATEGORIES).then((res) => {
        home_categories_list = res.data.data
    }).catch((error) => {
    })

    return {
        props: {
            admins_count,
            vendors_count,
            new_vendors_count,
            restricted_vendors_count,
            customers_count,
            restricted_customers_count,

            pending_orders_count,
            delivered_orders_count,
            cancelled_orders_count,
            returned_orders_count,

            sliders_list,
            categories_list,
            sub_categories_list,
            home_categories_list
        },
    }
}


const BackDrop = props => (
    <div>
        <div onClick={props.click}>
        </div>
        <style jsx>{`
             position: fixed;
             width: 100%;
             height: 100%;
             top: 0;
             left: 0;
             background: rgba(0, 0, 0, 0.3);
             z-index: 100;
        `}</style>
    </div>
)

let token = ''
class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admins_count: this.props.admins_count,
            vendors_count: this.props.vendors_count,
            new_vendors_count: this.props.new_vendors_count,
            restricted_vendors_count: this.props.restricted_vendors_count,
            customers_count: this.props.customers_count,
            restricted_customers_count: this.props.restricted_customers_count,

            pending_orders_count: this.props.pending_orders_count,
            delivered_orders_count: this.props.delivered_orders_count,
            cancelled_orders_count: this.props.cancelled_orders_count,
            returned_orders_count: this.props.returned_orders_count,

            sideDrawerOpen: false,
            showWrapper: true,

            // products_list: [],
            users_count: this.props.users_count,
            vendors_list: [],
            new_vendors_list: [],
            restricted_vendors_list: [],

            customers_list: [],
            restricted_customers_list: [],

            categories_list: this.props.categories_list,
            sub_categories_list: this.props.sub_categories_list,
            home_categories_list: this.props.home_categories_list,

            fields_list: [],
            field_requests_list: [],

            sliders_list: this.props.sliders_list,

            token: null,
            user: {
                _id: null, role: '', mobile: '', full_name: '', gender: '', countary: '', city: '', address: '',
                email: '', shop_name: '', shop_category: '', shop_address: '', avatar: '', status: ''
            }
        }
    }

    unmounted = true
    CancelToken = axios.CancelToken;
    source = this.CancelToken.source();

    async componentDidMount() {
        // this.getFields()
        // const _decodedToken = await checkTokenExpAuth()
        // if (_decodedToken != null) {
        //     await this.authUser(_decodedToken.role)
        //     this.setState({ user: _decodedToken })
        //     this.getUser(_decodedToken._id)

        //     const _token = await getTokenFromStorage()
        //     this.setState({ token: _token })
        // } else {
        //     Router.push('/')
        // }
    }

    async authUser(role) {
        if (role != 'admin') {
            Router.push('/')
        }
    }

    async getUser(id) {
        let currentComponent = this
        await axios.get(urls.GET_REQUEST.USER_BY_ID + `/${id}`, { cancelToken: this.source.token }).then((res) => {
            if (currentComponent.unmounted) {
                currentComponent.setState({ user: res.data.data[0] })
            }
        }).catch((err) => {
            if (axios.isCancel(err)) return
        })
    }

    componentWillUnmount() {
        this.source.cancel();
        this.unmounted = false
    }

    // async getFields() {
    //     const currentComponent = this;
    //     const url_1 = urls.PATH + '/api/categories/fields';
    //     await axios.get(url_1, { cancelToken: this.source.token }).then((res) => {
    //         if (currentComponent.unmounted) {
    //             currentComponent.setState({
    //                 fields_list: res.data.data.docs,
    //             })
    //         }
    //     }).catch((error) => {
    //     })
    //     const url_2 = urls.PATH + '/api/categories/field-requests';
    //     await axios.get(url_2, { cancelToken: this.source.token }).then((res) => {
    //         if (currentComponent.unmounted) {
    //             currentComponent.setState({
    //                 field_requests_list: res.data.data.docs,
    //             })
    //         }
    //     }).catch((error) => {
    //     })
    // }


    drawerToggleClickHandler = () => {
        this.setState(prevState => {
            return { sideDrawerOpen: !prevState.sideDrawerOpen };
        });
    };
    ShowWrapperClickHandler = () => {
        this.setState(prevState => {
            return { showWrapper: !prevState.showWrapper };
        });
    };

    backdropClickHandler = () => {
        this.setState({ sideDrawerOpen: false });
    };



    async reloadCategories() {
        let currentComponent = this
        await axios.get(urls.GET_REQUEST.CATEGORIES, { cancelToken: this.source.token }).then((res) => {
            if (currentComponent.unmounted) {
                currentComponent.setState({
                    categories_list: res.data.category.docs,
                    sub_categories_list: res.data.sub_category.docs
                })
            }
        }).catch((error) => {
            console.log('Caterories Fetchig Error: ', error)
        })
    }
    async reloadSlider() {
        let currentComponent = this
        await axios.get(urls.GET_REQUEST.SLIDERS, { cancelToken: this.source.token }).then(function (res) {
            if (currentComponent.unmounted) {
                currentComponent.setState({
                    sliders_list: res.data.data,
                })
            }
        }).catch(function (error) {
            console.log('reload slider error:', error)
        })
    }
    async reloadHomeCategories() {
        let currentComponent = this
        await axios.get(urls.GET_REQUEST.SLIDERS, { cancelToken: this.source.token }).then((res) => {
            if (currentComponent.unmounted) {
                currentComponent.setState({
                    home_categories_list: res.data.data
                })
            }
        }).catch((error) => {
        })
    }
    async reloadUsersCount() {
        let currentComponent = this
        await axios.get(urls.GET_REQUEST.ALL_CUSTOMER_COUNT).then((res) => {
            if (currentComponent.unmounted) {
                currentComponent.setState({
                    admins_count: res.data.admins_count,
                    vendors_count: res.data.vendors_count,
                    new_vendors_count: res.data.new_vendors_count,
                    restricted_vendors_count: res.data.restricted_vendors_count,
                    customers_count: res.data.customers_count,
                    restricted_customers_count: res.data.restricted_customers_count,
                })
            }
        }).catch((error) => {
        })
    }
    async reloadOrdersCount() {
        let currentComponent = this
        await axios.get(urls.GET_REQUEST.ALL_ORDERS_COUNT).then((res) => {
            if (currentComponent.unmounted) {
                currentComponent.setState({
                    pending_orders_count: res.data.pending_orders_count,
                    delivered_orders_count: res.data.delivered_orders_count,
                    cancelled_orders_count: res.data.cancelled_orders_count,
                    returned_orders_count: res.data.returned_orders_count,
                })
            }
        }).catch((error) => {
        })
    }

    async logout() {
        if (await removeTokenFromStorage()) {
            Router.replace('/')
        }
    }

    render() {
        let backdrop;
        if (this.state.sideDrawerOpen) {
            backdrop = <BackDrop click={this.backdropClickHandler} />;
        }
        return (
            <div style={styles.body}>
                <Dashboard
                    user={this.state.user}
                    full_name={this.state.user.full_name}
                    avatar={this.state.user.avatar}

                    admins_count={this.state.admins_count}
                    vendors_count={this.state.vendors_count}
                    new_vendors_count={this.state.new_vendors_count}
                    restricted_vendors_count={this.state.restricted_vendors_count}
                    customers_count={this.state.customers_count}
                    restricted_customers_count={this.state.restricted_customers_count}
                    usersReloadCountHandler={this.reloadUsersCount.bind(this)}

                    pending_orders_count={this.state.pending_orders_count}
                    delivered_orders_count={this.state.delivered_orders_count}
                    cancelled_orders_count={this.state.cancelled_orders_count}
                    returned_orders_count={this.state.returned_orders_count}
                    ordersReloadCountHandler={this.reloadOrdersCount.bind(this)}

                    categories_list={this.state.categories_list}
                    sub_categories_list={this.state.sub_categories_list}
                    categoriesReloadHandler={this.reloadCategories.bind(this)}
                    home_categories_list={this.state.home_categories_list}
                    homeCategoriesReloadHandler={this.reloadHomeCategories.bind(this)}

                    fields_list={this.state.fields_list}
                    field_requests_list={this.state.field_requests_list}
                    // fieldsReloadHandler={this.getFields.bind(this)}

                    sliders_list={this.state.sliders_list}
                    sliderReloadHandler={this.reloadSlider.bind(this)}

                    token={this.state.token}
                    user_name={this.state.user.full_name}
                    show={this.state.showWrapper}
                    drawerClickHandler={this.drawerToggleClickHandler}
                    wrapperBtnClickHandler={this.ShowWrapperClickHandler}
                    logout={this.logout.bind(this)}
                />
                <DashboardSideDrawer
                    user={this.state.user}
                    full_name={this.state.user.full_name}
                    avatar={this.state.user.avatar}

                    admins_count={this.state.admins_count}
                    vendors_count={this.state.vendors_count}
                    new_vendors_count={this.state.new_vendors_count}
                    restricted_vendors_count={this.state.restricted_vendors_count}
                    customers_count={this.state.customers_count}
                    restricted_customers_count={this.state.restricted_customers_count}
                    usersReloadCountHandler={this.reloadUsersCount.bind(this)}

                    pending_orders_count={this.state.pending_orders_count}
                    delivered_orders_count={this.state.delivered_orders_count}
                    cancelled_orders_count={this.state.cancelled_orders_count}
                    returned_orders_count={this.state.returned_orders_count}
                    ordersReloadCountHandler={this.reloadOrdersCount.bind(this)}

                    categories_list={this.state.categories_list}
                    home_categories_list={this.state.home_categories_list}
                    sub_categories_list={this.state.sub_categories_list}
                    categoriesReloadHandler={this.reloadCategories.bind(this)}
                    homeCategoriesReloadHandler={this.reloadHomeCategories.bind(this)}

                    fields_list={this.state.fields_list}
                    field_requests_list={this.state.field_requests_list}
                    // fieldsReloadHandler={this.getFields.bind(this)}

                    sliders_list={this.state.sliders_list}
                    sliderReloadHandler={this.reloadSlider.bind(this)}

                    token={this.state.token}
                    user_name={this.state.user.full_name}
                    show={this.state.sideDrawerOpen}
                    click={this.backdropClickHandler}
                    logout={this.logout.bind(this)}
                />
                {backdrop}
                {/* </AdminLayout> */}
                <style jsx global>{`
                    html,
                    body {
                        padding: 0;
                        margin: 0;
                        font-family: Roboto, Helvetica Neue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;
                    }
                `}</style>
            </div>
        );
    }
}

const styles = {
    body: {
        background: `${theme.COLORS.SECONDARY}`,
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        minHeight: '100vh',
    },
}

export default Admin;