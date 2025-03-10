import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://rugurujane.xyz/backend/' }),
  cache: new InMemoryCache(),
});

export default client;
