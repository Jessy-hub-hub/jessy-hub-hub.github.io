import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { slugify } from "../utils/slugify.js";
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

  // 1) Determine which category to show (default to "all")
  const segments = location.pathname.split("/").filter(Boolean);
  const selectedCategory = segments[0] || "all";

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // 2) Filter products by category if needed, else show all
  const filteredProducts =
    selectedCategory === "all"
      ? data.products
      : data.products.filter((p) => p.category === selectedCategory);

  // 3) Clicking a product => go to /product/<slugified-name>
  const handleProductClick = (product) => {
    const slug = slugify(product.name); // e.g. "PlayStation 5" -> "playstation-5"
    navigate(`/product/${slug}`);
  };

  // (Optional) Quick Shop
  const handleQuickShop = (e, product) => {
    e.stopPropagation();
    const defaultOptions =
      product.attributes?.reduce((acc, attribute) => {
        if (attribute.items?.length) {
          acc[attribute.id] = attribute.items[0].value;
        }
        return acc;
      }, {}) || {};

    const productWithPrice = { ...product, price: product.prices[0] };
    addToCart(productWithPrice, defaultOptions);
    alert(`Quick Shop: Added ${product.name} to cart with default options!`);
  };

  return (
    <div className="product-listing-page">
      <h1 className="category-title">
        {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
      </h1>

      <div className="product-grid">
        {filteredProducts.map((product) => {
          const slug = slugify(product.name); // "PlayStation 5" -> "playstation-5"
          return (
            <div
              key={product.id}
              className={`product-card ${product.inStock ? "" : "out-of-stock"}`}
              data-testid={`product-${slug}`} // => product-playstation-5
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
