import ClientPShopperStream from "$store/islands/ClientPShopperStream.tsx";

export interface Props {
  productId: string;
}

const ClientPShopper = ({ productId }: Props) => {
  return <ClientPShopperStream productId={productId} />;
};

export default ClientPShopper;
