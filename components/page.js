import Head from "next/head";
import { AppBar, Container, Divider } from "@mui/material";

const Page = ({ children, subHeader }) => (
  <>
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <header>
      <AppBar color="background">
        <Container maxWidth="xl" disableGutters>
          <img src="/logo.svg" alt="Mockingbird" height={70} />
        </Container>
        {subHeader && (
          <>
            <Divider />
            {subHeader}
          </>
        )}
      </AppBar>
    </header>
    <main>
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          mt: "70px",
        }}
      >
        {children}
      </Container>
    </main>
  </>
);

export default Page;
