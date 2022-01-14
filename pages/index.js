import ApolloClient, { gql, InMemoryCache } from "apollo-boost";
import { useQuery } from "react-apollo";
import { useEffect, useState } from "react";
import { Stack, Typography, Link, Divider, Container } from "@mui/material";
import { ProductGrid, Page } from "../components";


const SHOP_PRODUCTS_QUERY = gql`
  query ShopProducts {
    shop {
      name
      primaryDomain {
        url
      }
    }
    products(first: 4) {
      edges {
        node {
          id
          title
          images(first: 1) {
            edges {
              node {
                id
                altText
                originalSrc
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          onlineStoreUrl
        }
      }
    }
  }
`;

const ShopSection = ({ domain, storefrontAccessToken }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const client = new ApolloClient({
        uri: `https://${domain}/api/2021-10/graphql.json`,
        headers: {
          "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        },
        cache: new InMemoryCache(),
      });
      const { data } = await client.query({
        query: SHOP_PRODUCTS_QUERY,
      });
      setData(data);
    }
    fetchData();
  }, [domain, storefrontAccessToken]);

  if (!data) {
    return null;
  }

  const { edges } = data.products;
  const products = edges.map(({ node }) => node);

  return (
    <>
      <Stack
        mt={6}
        mb={4}
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        position="relative"
      >
        <Typography variant="h2">{data.shop.name}</Typography>
        <Link variant="button" href={data.shop.primaryDomain.url} target="_blank">
          View all products
        </Link>
      </Stack>
      <ProductGrid products={products} />
    </>
  );
}


const ShopsSection = ({ shops }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const shopsPerPage = 5;
  const currentShopIndex = pageIndex * shopsPerPage;
  const nextPageLimit = currentShopIndex + shopsPerPage;
  const numberOfPages = shops ? Math.ceil(shops.length / shopsPerPage) : 0;
  const hasNextPage = pageIndex < (numberOfPages - 1);
  const hasPreviousPage = pageIndex > 0;

  useEffect(() => {
    if (pageIndex > 0) {
      window.scrollTo(0, 0);
    }
  }, [pageIndex]);

  useEffect(() => {
    setPageIndex(0);
  }, [shops]);

  if (!shops) {
    return (
      <Stack mt={15} alignItems="center">
        <Typography variant="h3" component="span">
          No shops
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack mt={8} mb={7} divider={<Divider />}>
      {shops.slice(currentShopIndex, nextPageLimit).map((props) => (
        <ShopSection key={props.id} {...props} />
      ))}
      {numberOfPages > 1 && <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        mt={4} mb={4}
      >
        {hasPreviousPage ? <Link variant="button" component="button" onClick={() => setPageIndex(current => current - 1)}>Previous Page</Link> : <span />}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <FormControl>
            <InputLabel id="shop-page-select-label">Page </InputLabel>
            <Select
              labelId="shop-page-select-label"
              id="shop-page-select"
              label="Page"
              value={pageIndex}
              onChange={e => setPageIndex(e.target.value)}
            >
              {[...Array(numberOfPages).keys()].map(pageNumber => <MenuItem key={pageNumber} value={pageNumber}>{pageNumber + 1}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body1" sx={{p: 1}}>{`of ${numberOfPages}`}</Typography>
        </Stack>
        {hasNextPage ? <Link variant="button" component="button" onClick={() => setPageIndex(current => current + 1)}>Next Page</Link> : <span />}
      </Stack>}
    </Stack>
  );
}

const SHOPS_QUERY = gql`
  query Shops {
    shops {
      id
      domain
      storefrontAccessToken
    }
  }
`;

const Index = () => {
  const { data } = useQuery(SHOPS_QUERY);
  return (
    <Page>
      <Container maxWidth="xl">
        <ShopsSection shops={data?.shops} />
      </Container>
    </Page>
  );
};

export default Index;
