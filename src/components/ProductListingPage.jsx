import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { slugify } from "../utils/slugify";
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

const ProductListingPage = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES_AND_PRODUCTS);
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Determine category from URL path; default to "all" (the “all listing”)
  const segments = location.pathname.split("/").filter(Boolean);
  const selectedCategory = segments[0] || "all";

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // When category is "all", show every product.
  const filteredProducts =
    selectedCategory === "all"
      ? data.products
      : data.products.filter((p) => p.category === selectedCategory);

  const handleQuickShop = (e, product) => {
    e.stopPropagation(); // Prevent card click from firing
    const defaultOptions =
      product.attributes?.reduce((acc, attribute) => {
        if (attribute.items && attribute.items.length > 0) {
          acc[attribute.id] = attribute.items[0].value;
        }
        return acc;
      }, {}) || {};

    const productWithPrice = { ...product, price: product.prices[0] };
    addToCart(productWithPrice, defaultOptions);
    alert(`Quick Shop: Added ${product.name} to cart with default options!`);
  };

  const handleProductClick = (product) => {
    // Generate a slug using the product name
    const slug = slugify(product.name);
    // Navigate to /product/:slug
    navigate(`/product/${slug}`);
  };

  return (
    <div className="product-listing-page">
      <h1 className="category-title">
        {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
      </h1>

      <div className="product-grid">
        {filteredProducts.map((product) => {
          const slug = slugify(product.name); // e.g., "PlayStation 5" → "playstation-5"
          return (
            <div
              key={product.id}
              className={`product-card ${product.inStock ? "" : "out-of-stock"}`}
              data-testid={`product-${slug}`}
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
