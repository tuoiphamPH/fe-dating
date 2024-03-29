import { useState} from "react";
import axiosClient from "../../apis/AxiosClient.js";
import {ACCESS_TOKEN} from "../../constants/index.js";
import { useNavigate } from "react-router-dom";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../../firebase/index.js";
import AxiosClient from "../../apis/AxiosClient.js";
import showSuccessAlert from "../SwalAlert/showSuccessAlert.jsx";
import showErrorAlert from "../SwalAlert/showErrorAlert.jsx";
import showSigninAlert from "../SwalAlert/showSigninAlert.jsx";
import LogoLoveLink from "../../assets/images/welcome/logo-blur.png"
import Bglogin from "../../assets/images/welcome/Bg-login.png"

export  default function  LoginPage (){
    const [Account,setAccount] = useState("")
    const [Password,setPassword] = useState("")
    const navigate = useNavigate();


    const  handleLogin = ()=>{
        const Auth = {
            username : Account,
            password: Password
        }
        axiosClient.post("/authenticate",Auth).then((res)=>{
            showSuccessAlert("Đăng nhập thành công")
            localStorage.setItem(ACCESS_TOKEN,res)
            navigate("/home")
        }).catch((err)=>{
            showErrorAlert("error","Lỗi","Lỗi đăng nhập")
        })
    }


    const handleLoginGoogle = () => {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider).then((response) => {
            if (response){
                console.log(response)
                let ObjectProfile = {
                    "username" : response.user.displayName,
                    "email" : response.user.email,
                    "avatar": response.user.photoURL,
                    "activation_key": response.user.uid,
                    "password": response.user.uid,
                    "authorities" : ["ROLE_USER"]
                }

                // login system
                const loginSystem = ()=>{
                    AxiosClient.post("/custom-authenticate",ObjectProfile).then(
                        (res)=>{
                            showSigninAlert()
                            localStorage.setItem(ACCESS_TOKEN,res)
                            navigate("/profilepage")
                        }
                    ).catch(
                        (err)=>{
                            alert("Login Failed")
                            console.log(err)
                        }
                    )
                }

                // check register

                AxiosClient.post("/checkRegisterUser",ObjectProfile).then(
                    (res)=>{
                        if (res){
                            console.log(res)
                            // nếu đã có regis thì login
                            loginSystem()
                        }else{
                            // chưa có regis thì regis
                            AxiosClient.post("/register",ObjectProfile).then(
                                ()=>{
                                    loginSystem()
                                }
                            ).catch(
                                (err)=>{
                                    showErrorAlert(err)
                                }
                            )
                        }
                    }
                ).catch((err)=>{
                    showErrorAlert(err)})
            }
        }).catch((error) => {
            console.error("Facebook login error: ", error.message);
        });
    }



    return (
        <section className=" bg-cover bg-center bg-no-repeat w-full h-screen  flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0 bg-[url(https://i.pinimg.com/736x/01/ca/5e/01ca5ec396be5314e2d8d485cda5b389.jpg)]  ">
            <div className="md:w-1/3 max-w-sm">
                        <img
                           src={LogoLoveLink}
                            alt="Sample image" />
            </div>
            <div className="md:w-1/3 max-w-sm ">
                <div className="text-center md:text-left">

                    <button onClick={handleLoginGoogle}
                        type="button"
                            className="flex items-center border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm  text-gray-800 hover:bg-gray-200 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg"  width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" > <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
                        <span>Continue with Google</span>
                     </button>
                </div>
                <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                    <p className="mx-4 mb-0 text-center font-semibold text-slate-500">Or</p>
                </div>
                <input
                    onChange={(event)=>{setAccount((event.target.value))}}
                    className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" type="text" placeholder="Email Address" />
                <input
                    onChange={(event)=>{setPassword((event.target.value))}}
                    className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4" type="password" placeholder="Password" />
                <div className="mt-4 flex justify-between font-semibold text-sm">

                    <a className="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-4" href="#">Forgot Password?</a>
                </div>
                <div className="text-center md:text-left">
                    <button onClick={handleLogin}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
                        type="submit">Login</button>
                </div>
                <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
                   Bạn không thể đăng nhập ? <a className="text-red-600 hover:underline hover:underline-offset-4" href="#">Xem chi tiết</a>
                </div>
            </div>
        </section>
    );
}