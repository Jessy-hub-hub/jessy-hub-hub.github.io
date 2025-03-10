import { gql } from '@apollo/client';

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!, $attributes: AttributesInput!) {
    addToCart(productId: $productId, quantity: $quantity, attributes: $attributes) {
      productId
      quantity
      totalPrice
      attributes {
        size
        color
      }
    }
  }
`;
