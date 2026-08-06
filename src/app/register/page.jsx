"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"


export default function RegisterPage(){

    const router = useRouter()


    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const [error,setError] = useState("")
    const [message,setMessage] = useState("")



    async function handleRegister(e){

        e.preventDefault()
        console.log("Register button clicked")


        try{

            const response = await fetch(
                "/api/auth/register",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            )


            const data = await response.json()



            if(!response.ok){

                throw new Error(data.message)

            }



            setMessage("Registration successful")


            // go to login page after 1 second

            localStorage.setItem(
    "token",
    data.token
)

router.push("/home")



        }
        catch(err){

            setError(err.message)

        }

    }



    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-500">


            <form
                onSubmit={handleRegister}
                className="bg-white p-8 rounded-xl shadow-md w-96"
            >


                <h1 className="text-2xl font-bold text-center text-black mb-6">
                    Create Account
                </h1>



                {
                    error &&
                    <p className="text-red-500 mb-4">
                        {error}
                    </p>
                }



                {
                    message &&
                    <p className="text-green-500 mb-4">
                        {message}
                    </p>
                }



                <input

                    type="text"

                    placeholder="Name"

                    value={name}

                    onChange={(e)=>setName(e.target.value)}

                    className="w-full border p-3 rounded mb-4 border-gray-900 text-gray-700"

                />



                <input

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={(e)=>setEmail(e.target.value)}

                    className="w-full border p-3 rounded mb-4 border-gray-900 text-gray-700"

                />



                <input

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e)=>setPassword(e.target.value)}

                    className="w-full border p-3 rounded mb-4 border-gray-900 text-gray-700"

                />



                <button

                    className="w-full bg-black text-white p-3 rounded"

                >

                    Register

                </button>
                <p className="text-center text-gray-700 mt-4">
                
                have an account?
                
                    <Link
                        href="/login"
                        className="text-blue-500 ml-1"
                    >
                        Login
                    </Link>
                
                </p>


            </form>


        </div>

    )

}