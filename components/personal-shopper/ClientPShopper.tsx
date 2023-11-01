import ClientPShopperStream from "deco-sites/hugo-estudos/islands/ClientPShopperStream.tsx";

export interface Props {
  productId : string
}

const ClientPShopper = ({productId}: Props) => {
  return <ClientPShopperStream productId={productId} />;
};

export default ClientPShopper;
