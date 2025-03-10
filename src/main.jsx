// Check if the URL contains a 'redirect' query parameter and update the URL if so.
if (window.location.search.includes('redirect=')) {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectPath = urlParams.get('redirect');
  if (redirectPath) {
    // Remove the query string without reloading the page so that React Router sees the proper path.
    window.history.replaceState({}, document.title, redirectPath);
  }
}

import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import client from "./graphql/apolloClient";

// Render your app using React 18's createRoot API.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
