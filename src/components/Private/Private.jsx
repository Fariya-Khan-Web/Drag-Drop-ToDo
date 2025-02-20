import React, { useContext } from 'react';
import { Navigate, replace, useLocation } from 'react-router-dom';
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
        setLoading(false)
        return children
    }

    return <Navigate to='/auth' 
    // state={{from: location}} replace
    />
};

export default Private;