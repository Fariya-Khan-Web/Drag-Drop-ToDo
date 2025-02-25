import { useContext, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../../Provider/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const Login = () => {
    const { user, setUser, setLoading, googleSignIn } = useContext(AuthContext)

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from || "/";

    const handleGoogle = () => {
        googleSignIn()
            .then((result) => {
                
                setUser(result.user)

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.onmouseenter = Swal.stopTimer;
                      toast.onmouseleave = Swal.resumeTimer;
                    }
                  });
                  Toast.fire({
                    icon: "success",
                    title: "Signed in successfully"
                  });


                const userData = {
                    id: result.user.uid,
                    displayName: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL
                }

                fetch('https://todo-drag-drop-rho.vercel.app/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                })
                    .then(res => res.json())
                    .then(data => {
                        // console.log(data)
                    })
            })
            .catch(err => {
                // console.log(err)
            })
    }

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    return (
        <div className="min-h-screen bg-[#efe9e1] text-[#322d29] flex justify-center items-center">
            <div className="w-[92%] mx-auto ">

                <div className="text-start border-l-2 px-3 md:px-5 border-[#322d29] min-w-fit md:w-1/2 mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold">Welcome to <i><u>ListIt</u></i> !</h1>
                    <p className="md:w-2/3 md:text-xl w-90% my-3">Effortlessly organize your tasks – drag, drop, and stay on top of your workflow!</p>
                    <button onClick={handleGoogle} className="btn btn-sm bg-transparent border-[#322d29] hover:bg-[#322d29] text-[#322d29] hover:text-[#efe9e1] my-2 flex items-center gap-1 mt-5"><FaGoogle />Start with Google</button>
                </div>

            </div>
        </div>
    );
};

export default Login;