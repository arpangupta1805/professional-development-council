import React, { useEffect, useState } from "react";
import { TeamData } from "../../data/CurrentTeamData";
import AOS from "aos";
import "aos/dist/aos.css";
import Head from "next/head";
import Image from "next/image";
import useMasonry from "../../hooks/useMasonry";

const Team = () => {
  const { containerRef, resizeAllGridItems } = useMasonry(TeamData, 4);
  const [flippedCards, setFlippedCards] = useState({});
  
  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    // Trigger masonry recalculation after AOS animations
    const timer = setTimeout(() => {
      resizeAllGridItems();
    }, 1000);

    return () => clearTimeout(timer);
  }, [resizeAllGridItems]);

  // Recalculate masonry when flip states change
  useEffect(() => {
    const timer = setTimeout(() => {
      resizeAllGridItems();
    }, 100);

    return () => clearTimeout(timer);
  }, [flippedCards, resizeAllGridItems]);

  const handleCardFlip = (index) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    
    // Immediate recalculation
    requestAnimationFrame(() => {
      resizeAllGridItems();
    });
    
    // Multiple recalculations during flip animation for smooth masonry adjustment
    setTimeout(() => resizeAllGridItems(), 50);   // Very early
    setTimeout(() => resizeAllGridItems(), 150);  // Early calculation
    setTimeout(() => resizeAllGridItems(), 300);  // Mid animation
    setTimeout(() => resizeAllGridItems(), 450);  // Late mid animation
    setTimeout(() => resizeAllGridItems(), 600);  // Animation complete
    setTimeout(() => resizeAllGridItems(), 750);  // Final adjustment
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
          <div className="masonry-container" ref={containerRef}>
            {TeamData.map((item, index) => {
              return (
                <div
                  className="masonry-item"
                  key={index}
                  data-aos="fade-up"
                >
                  <div 
                    className={`flip-card ${flippedCards[index] ? 'flipped' : ''}`}
                    onClick={() => handleCardFlip(index)}
                  >
                    <div className="flip-card-inner">
                      {/* Front Side */}
                      <div className="flip-card-front">
                        <div className="item">
                          <div className="thumb">
                            <Image
                              className="team-image"
                              src={item.image}
                              alt={item.name}
                              width={300}
                              height={300}
                              style={{
                                width: '100%',
                                height: '300px',
                                objectFit: 'cover'
                              }}
                            />
                            <div className="overlay">
                              <h4>{item.name}</h4>
                              <p>{item.bio}</p>
                            </div>
                          </div>
                          <div className="info">
                            <span className="message">
                              {item.linkedin && (
                                <a href={item.linkedin} target="_blank" onClick={(e) => e.stopPropagation()}>
                                  <i
                                    className="fab fa-linkedin"
                                    style={{ fontSize: "25px" }}
                                  ></i>
                                </a>
                              )}
                              {item.email && (
                                <a href={`mailto:${item.email}`} target="_blank" onClick={(e) => e.stopPropagation()}>
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
                                  onClick={(e) => e.stopPropagation()}
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
                                  onClick={(e) => e.stopPropagation()}
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
                            <div className="flip-hint">
                              <i className="fas fa-sync-alt"></i>
                              <span>Click to flip</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Back Side */}
                      <div className="flip-card-back">
                        <div className="item back-content">
                          <div className="back-info">
                            <div className="back-header">
                              <Image
                                className="back-avatar"
                                src={item.image}
                                alt={item.name}
                                width={80}
                                height={80}
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  objectFit: 'cover',
                                  borderRadius: '50%'
                                }}
                              />
                              <h4>{item.name}</h4>
                              <span>{item.position}</span>
                            </div>
                            <div className="back-description">
                              <p>{item.back || "No additional information available."}</p>
                            </div>
                            <div className="back-footer">
                              <div className="social-links">
                                {item.linkedin && (
                                  <a href={item.linkedin} target="_blank" onClick={(e) => e.stopPropagation()}>
                                    <i className="fab fa-linkedin"></i>
                                  </a>
                                )}
                                {item.email && (
                                  <a href={`mailto:${item.email}`} target="_blank" onClick={(e) => e.stopPropagation()}>
                                    <i className="fas fa-envelope-open"></i>
                                  </a>
                                )}
                                {item.position === "Webmaster" && item.github ? (
                                  <a href={item.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    <i className="fab fa-github"></i>
                                  </a>
                                ) : item.profile ? (
                                  <a href={item.profile} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    <i className="fas fa-user"></i>
                                  </a>
                                ) : null}
                              </div>
                              <div className="flip-hint">
                                <i className="fas fa-undo-alt"></i>
                                <span>Click to flip back</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Team;