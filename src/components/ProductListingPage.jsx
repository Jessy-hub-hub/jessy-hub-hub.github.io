import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify.js";
import { useCart } from "../context/CartContext";
import "./ProductListingPage.css";

const GET_CATEGORIES_AND_PRODUCTS = gql`
  query GetCategoriesAndProducts {
    products {
      id
      name
      inStock
      gallery
      prices {
        amount
        currency {
          symbol
        }
      }
      category
      attributes {
        id
        name
        type
        items {
          id
          displayValue
          value
        }
      }
    }
  }
`;

const getSlug = (product) => slugify(product.name);

const ProductListingPage = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES_AND_PRODUCTS);
  const { addToCart, openCartOverlay } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Determine the selected category from the URL path or default to "all"
  const selectedCategory =
    location.pathname.split("/").filter(Boolean)[0] || "all";

  // Filter products based on the selected category
  const filteredProducts =
    selectedCategory === "all"
      ? data.products
      : data.products.filter((p) => p.category === selectedCategory);

  const handleProductClick = (product) => {
    navigate(`/product/${getSlug(product)}`);
  };

  const handleQuickShop = (e, product) => {
    e.stopPropagation();

    if (!product.inStock) return;

    // Automatically select the first option for each attribute
    const defaultOptions =
      product.attributes?.reduce((acc, attribute) => {
        if (attribute.items?.length) {
          acc[attribute.id] = attribute.items[0].value;
        }
        return acc;
      }, {}) || {};

    // Use the first price available for the product
    const productWithPrice = { ...product, price: product.prices[0] };

    // Add the product to the cart and open the cart overlay
    addToCart(productWithPrice, defaultOptions);
    openCartOverlay();

    alert(`Quick Shop: Added ${product.name} to cart with default options!`);
  };

  return (
    <div className="product-listing-page">
      <h1 className="category-title">
        {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
      </h1>
      <div className="product-grid">
        {filteredProducts.map((product) => {
          const slug = getSlug(product);
          return (
            <div
              key={product.id}
              className={`product-card ${product.inStock ? "" : "out-of-stock"}`}
              data-testid={`product-${slug}`} // Added dynamic data-testid attribute
              onClick={() => handleProductClick(product)}
            >
              <div className="image-container">
                <img src={product.gallery[0]} alt={product.name} />
                {!product.inStock && (
                  <div className="out-of-stock-overlay">Out of Stock</div>
                )}
              </div>
              <div className="product-details">
                <p className="product-name">{product.name}</p>
                <p className="product-price">
                  {product.prices[0]?.currency.symbol}
                  {product.prices[0]?.amount.toFixed(2)}
                </p>
              </div>
              {product.inStock && (
                <button
                  className="quick-shop"
                  onClick={(e) => handleQuickShop(e, product)}
                >
                  🛒
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductListingPage;
