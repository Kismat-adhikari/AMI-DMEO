import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Ami = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-4">Welcome to AMI</h1>
          <p className="text-gray-600">This is the main app page. Replace with your app UI.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Ami;
