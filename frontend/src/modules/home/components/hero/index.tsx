import React from 'react';
import Link from 'next/link';
import '@styles/hero.css';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title font-sans">Paletas Villaizan</h1>
        <p className="hero-subtitle font-sans">Descubre todos los sabores que tenemos para ti</p>
        <Link href="/comprar" passHref>
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold ">
                Catálogo de Paletas
            </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;