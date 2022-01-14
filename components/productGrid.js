import { Link, Stack, Typography, Grid, Container } from "@mui/material";

const ProductTile = ({ title, image, onlineStoreUrl, priceRange }) => {
  const imgProps = image
    ? { src: image.originalSrc, alt: image.altText }
    : { src: "placeholder-image-src", alt: "" };

  const { amount, currencyCode } = priceRange.minVariantPrice;
  const formattedPrice = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currencyCode,
  }).format(priceRange.minVariantPrice.amount);
  const priceString = `${formattedPrice}${
    amount === priceRange.maxVariantPrice.amount ? "" : "+"
  }`;

  return (
  <>
    <Stack
      border="1px solid lightgrey"
      borderRadius="5px"
      overflow="hidden"
      flexGrow={1}
    >
      <img
        {...imgProps}
        style={{
          objectFit: "contain",
          height: "300px",
          maxWidth: "100%",
        }}
      />
    </Stack>
    <Stack spacing={1} mt={2} alignItems="start">
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body2">{priceString}</Typography>
      <Link variant="button" href={onlineStoreUrl} target="_blank">
        View on online store
      </Link>
    </Stack>
  </>
  );
};

const ProductGrid = ({ products }) => {
  if (products.length === 0) {
    return (
      <Container m={2}>
        <Typography variant="body2" align="center">
          No products
        </Typography>
      </Container>
    );
  }

  return (
    <Grid container rowSpacing={6} columnSpacing={2} mb={2}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={3}>
          <ProductTile
            {...product}
            image={product.images.edges[0] && product.images.edges[0].node}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
