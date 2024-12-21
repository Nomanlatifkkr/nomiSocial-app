import React from 'react'
import { Access_token, getitem } from '../Utils/Localstorage'
import { Navigate, Outlet } from 'react-router-dom';

const UserReuired = () => {
    const user = getitem(Access_token);
    return (
        user ? <Outlet /> : <Navigate to='/login' />
    )
}

export default UserReuired