// Redirect logic: Check for a 'redirect' query parameter at the very top
if (window.location.search.includes('redirect=')) {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    if (redirectPath) {
      // Update the URL without reloading the page
      window.history.replaceState({}, document.title, redirectPath);
    }
  }
  
  import React from "react";
  import ReactDOM from "react-dom/client";
  import { ApolloProvider } from "@apollo/client";
  import { BrowserRouter } from "react-router-dom";
  import App from "./App";
  import client from "./graphql/apolloClient";
  
  // Use React 18's createRoot API to render your app
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </React.StrictMode>
  );
  