import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Provider/AuthProvider';

const Private = ({children}) => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext)
    const location = useLocation()

    if (loading) {
        return <div className='flex justify-center items-center h-screen'>
            <span className="loading loading-dots loading-lg"></span>
        </div>
    }

    if(user){
        return children
    }

    return <Navigate to='/auth' state={{from: location.pathname}} replace
    />
};

export default Private;