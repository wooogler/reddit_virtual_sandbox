import React from 'react';
import HomeLayout from '../components/home/HomeLayout';

function HomePage() {
  window.onbeforeunload =() => {
    console.log('refresh')
  }
  return <HomeLayout />;
}

export default HomePage;
