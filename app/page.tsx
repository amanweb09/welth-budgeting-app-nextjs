import Hero from '@/components/hero'
import { statsData } from '@/data/landing'
import React from 'react'

const Home = () => {
  return (
    <div className='pt-20'>
      <Hero />

      <section className='py-20 bg-blue-50'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {
              statsData.map((d, i) => (
                <div key={i} className='text-center'>
                  <div className='text-4xl font-bold text-blue-600 mb-2'>
                    {d.value}
                  </div>
                  <div className='text-gray-600'>
                    {d.label}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home