'use client'
import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const Home = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleAnalyze() {
    if (!url.trim()) {
      setError("Please enter a website URL")
      return
    }

    setError("")
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    router.push(`/score?url=${encodeURIComponent(url)}`)
  }

  return (
    <div className='grid grid-cols-12 gap-4 h-screen w-screen justify-center items-center '>
      <div className="col-span-2">
        
      </div>
      <div className="col-span-8">
        <div className=' pb-10'>
          <h1 className="flex flex-col justify-center items-center font-sans lg:text-7xl text-4xl  text-white">
            AI Web Analyzer
          </h1>
        </div>
        <div className="flex justify-center items-center">
          <input
            type="text"
            name='link'
            placeholder='Enter website URL'
            className='bg-[#292929] w-160 h-10 text-white text-center rounded-3xl border-white/10 border-2'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-red-500 mt-2 text-center">
            {error}
          </p>
        )}
        <div className="flex justify-center items-center">
          <button
            className='bg-[#292929] lg:w-32 lg:h-10 w-24 h-10 text-white text-center rounded-3xl border-white/10 border-2 mt-5 hover:bg-blue-400 disabled:opacity-50
disabled:cursor-not-allowed'
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
                <button
    onClick={() => router.back()}
    className="bg-[#292929] lg:w-32 lg:h-10 w-24 h-10 text-white text-center rounded-3xl border-white/10 border-2 mt-5 ml-2 hover:bg-blue-400 disabled:opacity-50
disabled:cursor-not-allowed"
>
    Back
</button>
        </div>
      </div>
      <div className="col-span-2"></div>
    </div>

  )
}

export default Home