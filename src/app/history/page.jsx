"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"


export default function HistoryPage() {

    const router = useRouter()

    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
async function deleteAnalysis(id){

    const token =
    localStorage.getItem("token");
if (!confirm("Are you sure you want to delete this analysis?")) {
        return;
    }

    const response =
    await fetch(

        `/api/history/${id}`,

        {

            method:"DELETE",

            headers:{
                Authorization:
                `Bearer ${token}`
            }

        }

    );


    if(response.ok){

        setHistory(

            history.filter(

                (item)=>item.id !== id

            )
            


        );

        alert("Analysis deleted successfully!");

    }

}


    useEffect(() => {


        async function fetchHistory() {


            const token =
                localStorage.getItem("token")


            const response =
                await fetch(
                    "/api/history",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                )


            const data =
                await response.json()


            setHistory(data.history)

            setLoading(false)


        }


        fetchHistory()


    }, [])



    if (loading) {

        return (

            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">

                Loading History...

            </div>

        )

    }




    return (


        <div className="min-h-screen bg-gray-950 text-white p-8">



            {/* Header */}


            <div className="mb-10">


                <h1 className="text-4xl font-bold">

                    Analysis History

                </h1>


                <p className="text-gray-400 mt-2">

                    View all your previously analyzed websites

                </p>


            </div>





            {/* Cards */}



            {
                history.length === 0 ?

                    (

                        <div className="
            bg-gray-900
            rounded-xl
            p-10
            text-center
            ">

                            <h2 className="text-xl">

                                No analysis found

                            </h2>


                        </div>

                    )


                    :


                    (

                        <div className="
        grid
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
        ">


                            {
                                history.map((item) => (



                                    <div
                                        key={item.id}
                                        className="
                bg-gray-900
                border
                border-gray-800
                rounded-2xl
                p-6
                shadow-xl
                hover:border-blue-500
                transition
                "
                                    >



                                        {/* URL */}


                                        <h2
                                            className="
                    text-lg
                    font-bold
                    truncate
                    "
                                        >

                                            {item.url}

                                        </h2>




                                        <p className="
                    text-gray-400
                    text-sm
                    mt-2
                    ">

                                            {
                                                new Date(
                                                    item.createdAt
                                                ).toLocaleDateString()
                                            }

                                        </p>





                                        {/* Score */}



                                        <div className="
                    flex
                    justify-between
                    items-center
                    mt-6
                    ">



                                            <div
                                                className="
                        w-20
                        h-20
                        rounded-full
                        bg-blue-600
                        flex
                        items-center
                        justify-center
                        text-2xl
                        font-bold
                        "
                                            >

                                                {item.overallScore}

                                            </div>




                                            <div className="text-right">


                                                <p className="
                            text-green-400
                            font-semibold
                            ">

                                                    {item.health}

                                                </p>


                                                <p className="
                            text-yellow-400
                            font-bold
                            mt-1
                            ">

                                                    Grade {item.grade}

                                                </p>


                                            </div>


                                        </div>







                                        {/* Buttons */}



                                        <div className="
                                                        flex
                                                        gap-3
                                                        mt-6
                                                        ">



                                            <button

                                                onClick={() => router.push(
                                                    `/score?id=${item.id}`
                                                )}

                                                className="
                                                                flex-1
                                                                bg-blue-600
                                                                hover:bg-blue-700
                                                                py-2
                                                                rounded-lg
                                                                "

                                            >

                                                View

                                            </button>





                                           <button

onClick={()=>deleteAnalysis(item.id)}

className="
flex-1
bg-red-600
hover:bg-red-700
py-2
rounded-lg
"

>

Delete

</button>



                                        </div>




                                    </div>


                                ))

                            }


                        </div>

                    )


            }




        </div>


    )

}