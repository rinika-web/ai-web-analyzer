"use client"

import {useEffect,useState} from "react"
import {useParams} from "next/navigation"


export default function ReportPage(){


    const params = useParams()

    const id = params.id


    const [analysis,setAnalysis] = useState(null)

    const [loading,setLoading] = useState(true)



    useEffect(()=>{


        async function fetchReport(){


            const token =
            localStorage.getItem("token")



            const response =
            await fetch(
                `/api/history/${id}`,
                {
                    headers:{
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            )


            const data =
            await response.json()


            setAnalysis(data.analysis)

            setLoading(false)


        }


        fetchReport()


    },[id])




    if(loading){

        return(

            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">

                Loading Report...

            </div>

        )

    }





    if(!analysis){

        return(

            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">

                Report not found

            </div>

        )

    }





    return(

<div className="min-h-screen bg-gray-950 text-white p-8">


    <h1 className="text-4xl font-bold mb-3">

        Website Report

    </h1>


    <p className="text-gray-400 mb-10">

        {analysis.url}

    </p>




    {/* Score Cards */}


    <div className="grid md:grid-cols-4 gap-6">



        <ScoreCard
        title="Overall"
        value={analysis.overallScore}
        />



        <ScoreCard
        title="SEO"
        value={analysis.seoScore}
        />



        <ScoreCard
        title="Performance"
        value={analysis.performanceScore}
        />



        <ScoreCard
        title="Accessibility"
        value={analysis.accessibilityScore}
        />


    </div>





    {/* Grade */}


    <div className="mt-10 bg-gray-900 p-6 rounded-xl">


        <h2 className="text-2xl font-bold">

            Health

        </h2>


        <p className="text-green-400 text-xl mt-3">

            {analysis.health}

        </p>


        <p className="text-yellow-400 mt-2">

            Grade: {analysis.grade}

        </p>


    </div>






    {/* Issues */}


    <div className="mt-10">


        <h2 className="text-2xl font-bold mb-5">

            Issues

        </h2>



        {
            analysis.issues.map(issue=>(


                <div
                key={issue.id}
                className="bg-gray-900 p-4 rounded-lg mb-3"
                >

                    {issue.message}

                </div>


            ))
        }



    </div>






</div>

    )

}





function ScoreCard({title,value}){


    return(

        <div className="bg-gray-900 p-6 rounded-xl">

            <p className="text-gray-400">

                {title}

            </p>


            <h2 className="text-4xl font-bold mt-3">

                {value}

            </h2>


        </div>

    )

}