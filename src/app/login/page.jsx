"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage(){

    const router = useRouter()

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const [error,setError] = useState("")


    async function handleLogin(e){

        e.preventDefault()

        try{

            const response = await fetch(
                "/api/auth/login",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        email,
                        password
                    })
                }
            )


            const data = await response.json()


            if(!response.ok){
                throw new Error(data.message)
            }


            // save JWT

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



    return(

        <div className="min-h-screen flex items-center justify-center bg-gray-500">


            <form
                onSubmit={handleLogin}
                className="bg-gray-100 p-8 rounded-xl shadow-md w-96"
            >

                <h1 className="text-2xl font-bold mb-6 text-center text-black">
                    Login
                </h1>


                {
                    error &&
                    <p className="text-red-500 mb-4">
                        {error}
                    </p>
                }



                <input

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={(e)=>setEmail(e.target.value)}

                    className="w-full border border-gray-900 text-gray-700 p-3 rounded mb-4"

                />



                <input

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e)=>setPassword(e.target.value)}

                    className="w-full border border-gray-900 text-gray-700 p-3 rounded mb-4"

                />



                <button

                    className="w-full bg-black text-white p-3 rounded"

                >

                    Login

                </button>
                <p className="text-center mt-4 text-gray-700">

    Do not have an account?

    <Link
        href="/register"
        className="text-blue-500 ml-1"
    >
        Register
    </Link>

</p>


            </form>


        </div>

    )

}