import { Heading, Page } from "@shopify/polaris";
import { LoadingCard, OverviewPage, ProductStatusSection } from "@shopify/channels-ui";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo";

const ADMIN_SHOP_QUERY = gql`
  query AdminShop {
    adminShop {
      id
      domain
      publicationId
      availableProductCount
      appHandle
    }
  }
`;

const Index = () => {
  const { data } = useQuery(ADMIN_SHOP_QUERY);
  const loadingContent = (
    <LoadingCard wrapped basic>
      Loading...
    </LoadingCard>
  );

  const content = !data ? loadingContent : (
    <ProductStatusSection
      summary={`${data.adminShop.availableProductCount} product(s) available to Mockingbird`}
      manageAction={{
        content: "Manage availability",
        external: true,
        url: `https://${data.adminShop.domain}/admin/bulk?resource_name=Product&edit=publications.${data.adminShop.publicationId}.published_at`,
      }}
      productStatuses={[
        {
          badge: {
            status: "info",
            children: "Published",
          },
          label: {
            content: `${data.adminShop.availableProductCount} product(s)`,
            external: true,
            url: `https://${data.adminShop.domain}/admin/products?selectedView=all&published_status=${data.adminShop.appHandle}%3Avisible`,
          },
        },
      ]}
    />
  )
  return (
    <OverviewPage title="Mockingbird channel overview">
      <OverviewPage.Section title="Product status on Mockingbird">
        {content}
      </OverviewPage.Section>
    </OverviewPage>
  )
}

export default Index;
