import React from 'react'
import { Access_token, getitem } from '../Utils/Localstorage';
import { Navigate, Outlet } from 'react-router-dom';

const Loginout = () => {
    const user = getitem(Access_token);
    return (
        user ? <Navigate to='/' /> : <Outlet />
    )
}

export default Loginout