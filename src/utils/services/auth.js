
// export default AuthenticationService;
import * as jwt_decode from 'jwt-decode'
import Router from 'next/router'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlzX2RlbGV0ZWQiOjAsIl9pZCI6IjVmMmM3M2VhNjYwZDIzMGIwOGNmZDY4NyIsIm1vYmlsZSI6Iis5MjM0MjE1NTYwMjgiLCJmdWxsX25hbWUiOiJNdWRhc3NpciBJcWJhbCIsImVtYWlsIjoibXVkYXNzaXIuaXFiYWxsQGhvdG1haWwuY29tIiwiY291bnRhcnkiOiJLU0EiLCJjaXR5IjoiSXNsYW1hYmFkZCIsInJvbGUiOiJhZG1pbiIsImFkZHJlc3MiOiJEYXJ5YSBraGFuIiwiZ2VuZGVyIjoiTWFsZSIsImVudHJ5X2RhdGUiOiIyMDIwLTA4LTA2VDIxOjE5OjM4LjIzMloiLCJzdGF0dXMiOiJhcHByb3ZlZCIsImNhcnQiOltdLCJfX3YiOjAsImF2YXRhciI6Imh0dHBzOi8vc2xpZGVyLWltYWdlcy5zMy5tZS1zb3V0aC0xLmFtYXpvbmF3cy5jb20vMTU5NzQzNDg2NDA1MyIsIndpc2hfbGlzdCI6W119LCJyb2xlIjoiVXNlciIsImlhdCI6MTYwNzQ1MzE0MywiZXhwIjoxNjA4MDU3OTQzfQ.GXlHn36mvDcVcgI20E3GWioCsQERSbER1mRwU8vwP-A'

const AuthenticationService = () => (
    <div></div>
)

export async function saveTokenToStorage(token) {
    await localStorage.setItem('token', token)
}
export function getDecodedTokenFromStorage() {
    // const token = localStorage.getItem('token')
    if (token) {
        const decodedToken = jwt_decode(token);
        return decodedToken.data;
    }
    return null
}

export function getTokenFromStorage() {
    // return localStorage.getItem('token');
    return token;
}

export async function removeTokenFromStorage() {
    try {
        await localStorage.removeItem('token')
        return true
    } catch (err) {
        return false
    }
}


export function checkTokenExpAuth() {
    // const token = localStorage.getItem('token')
    if (token != null) {
        const decodedToken = jwt_decode(token);
        console.log('token:', decodedToken)
        if (decodedToken.exp < Date.now() / 1000) {
            localStorage.removeItem('token')
            Router.push('/')
            Router.reload('/')
        } else {
            return decodedToken.data;
        }
    } else
        return;
}

export function checkAuth(current_role) {
    // const token = localStorage.getItem('token')
    if (token == null) {
        if (current_role == '/login' || current_role == '/signup' || current_role == '/vendor-signup') {
            Router.replace(current_role)
        } else
            Router.replace('/')
    } else {
        const decodedToken = jwt_decode(token);
        if (decodedToken.exp < Date.now() / 1000) {
            localStorage.removeItem('token')
            Router.push('/')
        } else if (decodedToken.data.role == current_role) {
            return decodedToken.data;
        } else if (current_role == '/vendor-signup' && decodedToken.data.role == 'customer') {
            Router.replace(current_role)
        } else {
            Router.replace('/')
        }
    }
}

export default AuthenticationService;