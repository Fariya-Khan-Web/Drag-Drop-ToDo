import React, { createContext, useEffect, useState } from 'react';
import app from '../firebase/firebase.init';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState()
    const [loading, setLoading] = useState()

    const auth = getAuth(app)

    const googleProvider = new GoogleAuthProvider()

    const googleSignIn = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }

    const authInfo = {
        user,
        setUser,
        loading,
        setLoading,
        googleSignIn,
    }

    useEffect(() => {
        
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;