import React from 'react'
import Navbar from '@/components/Home/Navbar'
import HeroSection from '@/components/Home/HeroSection'
import ALuminiAchievements from '@/components/Home/ALuminiAchievements'
import UpcomingEvents from '@/components/Home/UpcomingEvents'
import Gallery from '@/components/Home/Gallery'
import Footer from '@/components/Home/Footer'

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection/>
      <ALuminiAchievements/>
      <UpcomingEvents/>
      <Gallery/>
      <Footer/>
    </div>
  )
}

export default Home