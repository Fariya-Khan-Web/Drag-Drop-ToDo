import React, { createContext, useEffect, useState } from 'react';
import app from '../firebase/firebase.init';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState()
    const [dark, setDark] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)
    // const [tasks, setTasks] = useState({ todo: [], inprogress: [], done: [] });
    const [tasks, setTasks] = useState({ todo: [], inprogress: [], done: [] });

    

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


    // context fetchTask data get 
    const fetchTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/tasks/${user?.email}`);
            const taskData = response.data;

            const categorizedTasks = { todo: [], inprogress: [], done: [] };

            response.data.forEach((task) => {
                if (categorizedTasks[task.category]) {
                    categorizedTasks[task.category].push(task);
                } else {
                    console.warn("Unexpected category:", task.category, "for task:", task);
                }
            });

            setTasks(categorizedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to load tasks!");
        }
    };


    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser)
            setLoading(false)
        })

        return () => unsubscribe()
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
        showModal, 
        setShowModal
    }


    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;