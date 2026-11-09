import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Detection from './pages/Detection';
import Samples from './pages/Samples';
import Analytics from './pages/Analytics';
import ModelPerformance from './pages/ModelPerformance';
import History from './pages/History';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-agri-500 selection:text-white">
        <Navbar />

        <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
          <Sidebar />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detect" element={<Detection />} />
              <Route path="/samples" element={<Samples />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/performance" element={<ModelPerformance />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
