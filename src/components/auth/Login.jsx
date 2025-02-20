import { useContext } from "react";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../../Provider/AuthProvider";


const Login = () => {
    const {setUser, setLoading , googleSignIn} = useContext(AuthContext)

    const handleGoogle = () => {
        googleSignIn()
        .then((result) => {
            console.log(result.user)
            setUser(result.user)
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <div className="min-h-screen bg-[#efe9e1] text-[#322d29] flex justify-center items-center">
            <div className="w-[92%] mx-auto ">

                <div className="text-start border-l-2 px-3 md:px-5 border-[#322d29] min-w-fit md:w-1/2 mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold">Welcome to <i><u>ListIt</u></i> !</h1>
                    <p className="md:w-2/3 md:text-xl w-90% my-3">Effortlessly organize your tasks – drag, drop, and stay on top of your workflow!</p>
                    <button onClick={handleGoogle} className="btn btn-sm bg-transparent hover:bg-[#322d29] text-[#322d29] hover:text-[#efe9e1] my-2 flex items-center gap-1 mt-5"><FaGoogle />Start with Google</button>
                </div>

            </div>
        </div>
    );
};

export default Login;