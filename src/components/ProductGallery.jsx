import React, { useState } from "react";
import "./ProductGallery.css";

const ProductGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div data-testid="product-gallery" className="product-gallery">
      <div className="gallery-thumbnails">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            className={`thumbnail ${index === currentIndex ? "active" : ""}`}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>
      <div className="gallery-main">
        <button className="arrow left" onClick={handlePrev}>
          &#8592;
        </button>
        <img src={images[currentIndex]} alt="Main" className="main-image" />
        <button className="arrow right" onClick={handleNext}>
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default ProductGallery;
