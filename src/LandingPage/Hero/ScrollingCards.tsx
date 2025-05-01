import React from "react";
import "./ScrollingCards.css";
import libraryImg from "../../assets/images/library.jpg";
import childonglasses from "../../assets/images/childonglasses.jpg";
import crayons from "../../assets/images/crayons.jpg";
import pencils from "../../assets/images/pencils.jpg";
import arabchildren from "../../assets/images/arabchildren.jpg";

const cardsData = [
  {
    title: "Digital Library",
    description: "Access millions of books at your fingertips.",
    image: libraryImg,
  },
  {
    title: "Virtual Labs",
    description: "Experiment and learn from anywhere.",
    image: childonglasses,
  },
  {
    title: "AI Tutors",
    description: "Get help 24/7 from intelligent assistants.",
    image: crayons,
  },
  {
    title: "Scholarships",
    description: "Explore funding options and apply easily.",
    image: arabchildren,
  },
  {
    title: "Study Groups",
    description: "Connect with learners around the world.",
    image: pencils,
  },
];

const ScrollingCards: React.FC = () => {
  return (
    <div className="scrolling-container">
      <div className="scrolling-track">
        {[...cardsData, ...cardsData].map((card, index) => (
          <div
            className="scroll-card"
            key={index}
            style={{
              backgroundImage: `url(${card.image})`,
              marginTop: index % 2 === 0 ? "-64px" : "0",
            }}
          >
            <div className="card-overlay">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingCards;
