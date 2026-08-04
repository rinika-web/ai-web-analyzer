"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)



    useEffect(() => {


        async function fetchDashboard() {


            const token =
                localStorage.getItem("token")


            const response =
                await fetch(
                    "/api/dashboard",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                )


            const result =
                await response.json()


            setData(result)

            setLoading(false)

        }


        fetchDashboard()


    }, [])



    if (loading) {

        return <h1>Loading...</h1>

    }



    return (

<div className="min-h-screen bg-gray-950 text-white p-8">


    {/* Header */}

    <div className="flex justify-between items-center mb-10">


        <div>

            <h1 className="text-4xl font-bold">
                Welcome Back 👋
            </h1>

            <p className="text-gray-400 mt-2">
                Analyze, monitor and improve your websites
            </p>

        </div>


        {/* Analyze Button */}

        <button
        className="
        bg-blue-600
        hover:bg-blue-700
        px-6
        py-3
        rounded-xl
        font-semibold
        shadow-lg
        transition
        "
        onClick={()=>router.push("/analyze")}
        >

            + Analyze Website

        </button>


    </div>




    {/* Stats */}


    <div className="grid md:grid-cols-2 gap-6 mb-10">


        <div
        className="
        bg-gradient-to-br 
        from-blue-600 
        to-blue-900
        rounded-2xl
        p-7
        shadow-xl
        "
        >

            <p className="text-blue-100">
                Total Reports
            </p>

            <h2 className="text-5xl font-bold mt-3">
                {data.total}
            </h2>

            <p className="mt-2 text-sm text-blue-200">
                Websites analyzed
            </p>


        </div>




        <div
        className="
        bg-gradient-to-br 
        from-green-600 
        to-green-900
        rounded-2xl
        p-7
        shadow-xl
        "
        >

            <p className="text-green-100">
                Average Score
            </p>

            <h2 className="text-5xl font-bold mt-3">
                {data.averageScore}%
            </h2>

            <p className="mt-2 text-sm text-green-200">
                Overall website health
            </p>


        </div>


    </div>





    {/* Recent Reports */}


    <div>


        <div className="flex justify-between items-center mb-6">


            <h2 className="text-2xl font-bold">
                Recent Analysis
            </h2>


            <button
            className="
            text-blue-400
            hover:text-blue-300
            "
            >
                View All
            </button>


        </div>





        <div className="
        grid 
        md:grid-cols-2 
        lg:grid-cols-3 
        gap-6
        ">


        {
            data.recent.map((item)=>(


                <div
                key={item.id}
                className="
                bg-gray-900
                border
                border-gray-800
                rounded-2xl
                p-6
                hover:border-blue-500
                transition
                shadow-lg
                "
                >


                    <div className="flex justify-between">


                        <div className="overflow-hidden">


                            <h3 className="
                            font-semibold
                            truncate
                            "
                            >

                                {item.url}

                            </h3>


                            <p className="
                            text-gray-400
                            text-sm
                            mt-2
                            "
                            >

                            {new Date(
                                item.createdAt
                            ).toLocaleDateString()}

                            </p>


                        </div>



                        <div
                        className="
                        bg-blue-600
                        w-14
                        h-14
                        rounded-full
                        flex
                        items-center
                        justify-center
                        font-bold
                        "
                        >

                            {item.overallScore}

                        </div>


                    </div>





                    <div className="
                    mt-6
                    flex
                    justify-between
                    ">


                        <span
                        className="
                        bg-green-900
                        text-green-300
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        "
                        >

                            {item.health}

                        </span>



                        <span
                        className="
                        text-yellow-400
                        "
                        >

                            Grade {item.grade}

                        </span>


                    </div>


                </div>


            ))
        }


        </div>


    </div>


</div>

)

}