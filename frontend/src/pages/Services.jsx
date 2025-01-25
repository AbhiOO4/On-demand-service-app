import React from 'react'
import Layout from '../components/Layout';
import Navbar from "../components/Navbar";
import Searchbar from "../components/searchbar";
import Topbar from "../components/Topbar";
import Showservice from "../components/Showservice";
import cleaning from "../assets/images/cleaning-service.png";
import landscaping from "../assets/images/landscaping.png";
import fan from "../assets/images/fan.png";
import bath from "../assets/images/bath.png";
import washing from "../assets/images/washing.png";
import post from "../assets/images/post.png";
import homefull from "../assets/images/home-full.png";
import profile from "../assets/images/profile.png";

const Services = () => {
  return (
    <Layout>
      <div className='border border-gray-500/30 rounded-xl shadow-sm p-6 mb-6 mt-4'>
        <h1 className='text-2xl font-semibold mb-4'>Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Topbar servicesBg="bg-yellow-400" />
          <Searchbar />
          <Showservice
            image={cleaning}
            title="Home Cleaning Service"
            price="Rs 2000"
          />
          <Showservice
            image={landscaping}
            title="Landscaping service"
            price="Rs 1000/sq-feet"
          />
          <Showservice image={fan} title="Fan installation" price="Rs 500" />
          <Showservice image={bath} title="Bathroom installation" price="Rs 5000" />
          <Showservice
            image={washing}
            title="Washing machine installation"
            price="Rs 899"
          />
          <Showservice
            image={cleaning}
            title="Home Cleaning Service"
            price="Rs 2000"
          />
          <Navbar posticon={post} homeicon={homefull} profileicon={profile} />
        </div>
      </div>
    </Layout>
  )
}

export default Services
