import React, { useEffect, useState } from "react";
import { TeamData } from "../../data/CurrentTeamData";
import AOS from "aos";
import "aos/dist/aos.css";
import Head from "next/head";
import Image from "next/image";

const Team = () => {
  const [flippedIndex, setFlippedIndex] = useState(null);
  
  useEffect(() => {
    AOS.init();
  }, []);

  const handleFlip = (index) => {
    setFlippedIndex(prev => prev === index ? null : index);
  };

  const handleMouseLeave = (index) => {
    if (flippedIndex === index) {
      setFlippedIndex(null);
    }
  };

  // Group team members by position
  const groupedTeam = {
    Secretary: TeamData.filter(item => item.position.toLowerCase().includes("secretary")),
    Coordinators: TeamData.filter(item => item.position.toLowerCase().includes("coordinator")),
    Webmasters: TeamData.filter(item => item.position.toLowerCase().includes("webmaster")),
    "General Council Members": TeamData.filter(item => item.position.toLowerCase().includes("general council")),
    "Social Media Managers": TeamData.filter(item => item.position.toLowerCase().includes("social media")),
  };

  return (
    <div className="main-container team-page">
      <Head>
        <title>Team | Current Team</title>
        <meta name="description" content="" />
      </Head>
      <header id="page-header">
        <div className="page-heading hero-content">
          <h2>Current Team</h2>
        </div>
      </header>

      <div className="page-container">
        <section id="team" className="team-area">
          {Object.entries(groupedTeam).map(([roleTitle, members]) => (
            members.length > 0 && (
              <div key={roleTitle} className="mb-24">
                <h3 className="text-3xl font-bold text-center mb-12 text-gray-800 relative pb-8">
                  {roleTitle}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500 rounded"></div>
                </h3>
                
                <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto px-8 place-items-start">
                  {members.map((item, index) => {
                    const globalIndex = `${roleTitle}-${index}`;
                    return (
                      <div
                        key={globalIndex}
                        data-aos="fade-up"
                        onMouseLeave={() => handleMouseLeave(globalIndex)}
                        className="w-full"
                      >
                        <div className={`flip-card h-full ${flippedIndex === globalIndex ? "flipped" : ""}`}>
                          <div className="flip-card-inner">
                            
                            <div className="flip-card-front">
                              <div className="item h-full flex flex-col">
                                <div className="thumb">
                                  <Image
                                    className="team-image"
                                    src={item.image}
                                    alt="Thumb"
                                    width={300}
                                    height={300}
                                  />
                                  <div className="overlay">
                                    <h4>{item.name}</h4>
                                    <p>{item.bio}</p>
                                  </div>
                                </div>
                                <div className="info flex-1 flex flex-col">
                                  <span className="message">
                                    {item.linkedin && (
                                      <a href={item.linkedin} target="_blank" rel="noopener noreferrer">
                                        <i
                                          className="fab fa-linkedin"
                                          style={{ fontSize: "25px" }}
                                        ></i>
                                      </a>
                                    )}
                                    {item.email && (
                                      <a href={`mailto:${item.email}`} target="_blank" rel="noopener noreferrer">
                                        <i
                                          className="fas fa-envelope-open"
                                          style={{ fontWeight: "500" }}
                                        ></i>
                                      </a>
                                    )}
                                    {item.position === "Webmaster" && item.github ? (
                                      <a
                                        href={item.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <i
                                          className="fab fa-github"
                                          style={{ fontSize: "25px" }}
                                        ></i>
                                      </a>
                                    ) : item.profile ? (
                                      <a
                                        href={item.profile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <i
                                          className="fas fa-user"
                                          style={{ fontSize: "25px" }}
                                        ></i>
                                      </a>
                                    ) : null}
                                  </span>
                                  <h4>{item.name}</h4>
                                  <span style={{ fontSize: "1.05rem" }}>
                                    {item.position}
                                  </span>
                                  <p
                                    style={{
                                      fontSize: "0.85rem",
                                      fontWeight: "600",
                                      opacity: "0.6",
                                    }}
                                  >
                                    Contact no: +91 {item.contact}
                                  </p>
                                  
                                  {/* Flip Trigger */}
                                  <div 
                                    className="mt-auto pt-4 flex items-center justify-center cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFlip(globalIndex);
                                    }}
                                  >
                                    <span className="text-2xl mr-2">⤾</span>
                                    <span className="text-sm font-medium">Click to flip</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Back Side - New Design */}
                            <div className="flip-card-back bg-gradient-to-br from-slate-600 to-slate-800 text-white rounded-xl shadow-lg p-4 flex flex-col justify-center">
                              <div className="text-center h-full flex flex-col justify-center space-y-3">
                                <h2 className="text-lg font-bold mb-2">
                                  👋 Hi, I'm {item.name}
                                </h2>
                                <div className="mb-3">
                                  <h4 className="text-sm font-semibold bg-white bg-opacity-20 rounded-full px-3 py-1 inline-block">
                                    {item.position}
                                  </h4>
                                </div>
                                <div className="mb-3 flex-1 flex items-center justify-center">
                                  <p className="text-[0.65rem] leading-relaxed">
                                    {item.back ? item.back.split('\n').map((line, idx) => (
                                      <React.Fragment key={idx}>
                                        {line}
                                        {idx < item.back.split('\n').length - 1 && <br />}
                                      </React.Fragment>
                                    )) : item.bio}
                                  </p>
                                </div>
                                <p className="text-xs font-medium bg-white bg-opacity-20 rounded-lg px-2 py-1">
                                  🤝 Always open to partnerships!
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </section>
      </div>

      <style jsx>{`
        .flip-card {
          background-color: transparent;
          perspective: 1000px;
          min-height: 500px;
          width: 280px;
          max-width: 280px;
          margin: 10px;
        }

        /* Force horizontal layout */
        .grid {
          display: grid !important;
        }
        
        .grid-cols-4 {
          grid-template-columns: repeat(4, 1fr) !important;
        }

        /* Add spacing */
        .grid > * {
          margin: 15px 10px;
        }

        /* Fix flip animation */
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s ease-in-out;
          transform-style: preserve-3d;
        }

        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: inherit;
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }

        /* Section spacing */
        .team-area > div:not(:last-child) {
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 5rem;
        }
      `}</style>
    </div>
  );a
};

export default Team;