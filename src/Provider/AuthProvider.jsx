import React, { createContext, useEffect, useState } from 'react';
import app from '../firebase/firebase.init';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDragAndDropContext } from './DragAndDropContext';

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState()
    const [dark, setDark] = useState(false)
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true)


    const auth = getAuth(app)

    const googleProvider = new GoogleAuthProvider()

    const googleSignIn = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }

    const logOut = () => {
        setLoading(true)
        return signOut(auth)
    }


    const fetchTasks = async () => {
        if (!user) {
            return <div className='flex justify-center items-center h-screen'>
                <span className="loading loading-dots loading-lg"></span>
            </div>
        } else {
            try {
                console.log(user.email)
                const response = await axios.get(`https://todo-drag-drop-rho.vercel.app/tasks/${user?.email}`);
                const taskData = response.data;

                console.log(taskData)

                setTasks(taskData);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                toast.error("Failed to load tasks!");
            }
        }
    };


    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser)
            setLoading(false)
        })

        return () => {
            fetchTasks()
            unsubscribe()
        }
    }, [])


    const authInfo = {
        user,
        setUser,
        dark,
        setDark,
        loading,
        setLoading,
        googleSignIn,
        logOut,
        fetchTasks,
        tasks,
        setTasks,
    }


    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;