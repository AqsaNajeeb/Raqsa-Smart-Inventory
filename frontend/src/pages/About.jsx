import React from "react";
import { Link } from "react-router-dom";
import aboutImage from "../assets/Raqsa.png";
import { Shield, Star, Heart, ArrowRight } from "lucide-react";

const About = () => {
  const values = [
    {
      title: "Quality First",
      description:
        "Every product on Raqsa is carefully selected and reviewed to meet high standards of quality and reliability.",
      icon: <Star className="w-8 h-8" />,
    },
    {
      title: "Honesty & Trust",
      description:
        "We believe in transparent pricing, clear communication, and building long-term trust with our customers.",
      icon: <Shield className="w-8 h-8" />,
    },
    {
      title: "Growth Through Learning",
      description:
        "Raqsa is built on continuous improvement, learning from challenges, and evolving with customer needs.",
      icon: <Heart className="w-8 h-8" />,
    },
  ];

  return (
    <div className="relative min-h-screen py-16 overflow-hidden animate-fade-in">
      {/* 🌈 BACKGROUND BLOBS */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[60rem] h-[60rem]
          bg-gradient-to-br from-purple-600 via-pink-500 to-pink-300
          opacity-35 rounded-full blur-[140px] animate-blob" />

        <div className="absolute -bottom-56 -right-56 w-[65rem] h-[65rem]
          bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-400
          opacity-30 rounded-full blur-[160px] animate-blob animation-delay-2s" />

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2
          w-[70rem] h-[70rem]
          bg-gradient-to-tl from-pink-600 via-purple-700 to-blue-500
          opacity-20 rounded-full blur-[180px] animate-blob animation-delay-4s" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* HERO */}
        <section className="flex flex-col md:flex-row items-center gap-10 mb-20">
          <div className="w-full md:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-xl bg-white/60 backdrop-blur-md">
              <img
                src={aboutImage}
                alt="About Raqsa"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-6">
              Our Story at <span className="text-pink-600">Raqsa</span>
            </h1>

            <p className="text-purple-700 mb-4 text-lg">
              Raqsa is more than just an e-commerce platform. It is the result of
              passion, persistence, and countless hours of learning and problem-solving.
            </p>

            <p className="text-purple-700 mb-4">
              What started as a personal vision grew into a full-scale platform
              designed to provide a modern, secure, and enjoyable shopping experience.
            </p>

            <p className="text-purple-700">
              Every feature, design choice, and improvement reflects dedication,
              resilience, and the courage to keep going despite challenges.
            </p>
          </div>
        </section>

        {/* OBJECTIVE & JOURNEY */}
<section className="mb-20 bg-white/50 backdrop-blur-md p-10 rounded-xl shadow-lg">
  <h2 className="text-3xl font-bold mb-6 text-purple-900 text-center">
    Objective & Journey
  </h2>

  <div className="max-w-4xl mx-auto text-center space-y-4">
    <p className="text-purple-700 text-md">
      The objective of Raqsa is to build a reliable, scalable, and visually
      pleasing platform that customers can trust, from browsing products
      to completing secure purchases.
    </p>

    <p className="text-purple-700 text-md">
      The journey was not easy. Backend logic, APIs, database relationships,
      authentication, payments, and UI consistency all presented real
      challenges. Bugs, failed integrations, and late-night debugging
      were part of the process.
    </p>

    <p className="text-purple-700 text-md">
      Instead of giving up, each obstacle became a lesson. Raqsa stands
      today as proof that growth comes through persistence, patience,
      and continuous learning.
    </p>
  </div>
</section>


        {/* FOUNDER NOTE */}
<section className="mb-20">
  <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-md p-8 rounded-xl shadow-lg text-center">
    <h3 className="text-2xl font-semibold text-purple-900 mb-3">
      Founder's Note
    </h3>

    <p className="text-purple-700 mb-4">
      Raqsa is the result of a collaborative journey built with dedication,
      curiosity, and persistence by
      <span className="font-semibold text-purple-900"> Aqsa Najeeb</span> and
      <span className="font-semibold text-purple-900"> Iqra Hafeez</span>.
    </p>

    <p className="text-purple-700">
      From brainstorming ideas to overcoming technical challenges, this platform
      reflects shared learning, mutual support, and a common goal of creating
      a meaningful and reliable digital experience.
    </p>
  </div>
</section>


        {/* VALUES */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-900">
            What We Stand For
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg
                hover:shadow-xl hover:-translate-y-1 transition text-center"
              >
                <div className="inline-flex items-center justify-center
                  w-16 h-16 rounded-full mb-4
                  bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {value.icon}
                </div>

                <h3 className="text-xl font-semibold mb-2 text-purple-900">
                  {value.title}
                </h3>

                <p className="text-purple-700">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center p-12 rounded-xl bg-white/40 backdrop-blur-md shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-900">
            Thank You for Being Here
          </h2>

          <p className="text-purple-700 mb-6 text-lg">
            Raqsa is growing every day, and you are now part of this journey.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2
            bg-gradient-to-r from-purple-500 to-pink-500
            text-white py-3 px-10 rounded-full shadow-md
            hover:from-pink-500 hover:to-purple-500 transition
            group"
          >
            Explore Our Store
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
      </div>

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes blob {
            0%,100% { transform: translate(0,0) scale(1); }
            33% { transform: translate(30px,-50px) scale(1.1); }
            66% { transform: translate(-20px,20px) scale(0.9); }
          }
          .animate-blob { animation: blob 12s infinite; }
          .animation-delay-2s { animation-delay: 2s; }
          .animation-delay-4s { animation-delay: 4s; }
          @media (prefers-reduced-motion: reduce) {
            .animate-blob { animation: none; }
          }
        `}
      </style>
    </div>
  );
};

export default About;
