import React from "react";

const StarRating = ({ rating = 0, totalStars = 5, size = 32 }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isFull = starValue <= Math.floor(rating);
        const isHalf = !isFull && rating > index && rating < starValue + 1;

        return (
          <span key={index}>
            {isFull ? (
              // ⭐ Full Star
              <svg
                stroke="currentColor"
                fill="#c58b39"
                strokeWidth="0"
                viewBox="0 0 576 512"
                height={size}
                width={size}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 
                3.8-36.7 36.1-17.7 54.6l105.7 103-25 
                145.5c-4.5 26.3 23.2 46 46.4 
                33.7L288 439.6l130.7 68.7c23.2 
                12.2 50.9-7.4 46.4-33.7l-25-145.5 
                105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 
                150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 
                0z"></path>
              </svg>
            ) : isHalf ? (
              // ⯨ Half Star (with thick border, same size as others)
              <svg
                viewBox="-30 -30 636 572"
                height={size}
                width={size}
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`half-${index}`}>
                    <stop offset="50%" stopColor="#c58b39" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                {/* Main star shape with half fill */}
                <path
                  fill={`url(#half-${index})`}
                  stroke="#c58b39"
                  strokeWidth="40"
                  d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 
                  3.8-36.7 36.1-17.7 54.6l105.7 103-25 
                  145.5c-4.5 26.3 23.2 46 46.4 
                  33.7L288 439.6l130.7 68.7c23.2 
                  12.2 50.9-7.4 46.4-33.7l-25-145.5 
                  105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 
                  150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 
                  0z"
                />
              </svg>
            ) : (
              // ☆ Empty Star
              <svg
                stroke="currentColor"
                fill="#e0e0e0"
                strokeWidth="0"
                viewBox="0 0 576 512"
                height={size}
                width={size}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 
                3.8-36.7 36.1-17.7 54.6l105.7 103-25 
                145.5c-4.5 26.3 23.2 46 46.4 
                33.7L288 439.6l130.7 68.7c23.2 
                12.2 50.9-7.4 46.4-33.7l-25-145.5 
                105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 
                150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 
                0z"></path>
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;