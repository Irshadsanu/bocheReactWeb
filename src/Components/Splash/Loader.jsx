import React, { useEffect, useState } from "react";
import "./Splash.css"; // Import your CSS file for styling (optional)

const Loader = () => {
  const [letters, setLetters] = useState([]);
  const word = "BOCHEMART";

  useEffect(() => {
    const letterArray = word.split("");
    const delay = 200; // Adjust delay between each letter (in milliseconds)

    // Function to set letters with delay
    const addLetterWithDelay = (index) => {
      setTimeout(() => {
        setLetters((prevLetters) => [...prevLetters, letterArray[index]]);
      }, index * delay);
    };

    // Loop through each letter and set with delay
    letterArray.forEach((letter, index) => {
      addLetterWithDelay(index);
    });
  }, []);

  return (
    <div className="loader-container">
      <div className="loader">{letters.join("")}</div>
    </div>
  );
};

export default Loader;
