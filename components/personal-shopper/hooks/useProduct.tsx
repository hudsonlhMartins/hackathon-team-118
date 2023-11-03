import { Product } from "$store/components/personal-shopper/types.ts";
import { useEffect, useState } from "preact/hooks";

export default function useProduct(productId: string) {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // INFO: por algum motivo a integração com a vtex está voltando o mesmo valor tanto para productId quanto para sku. Ambos na realidade retornam o skuId, por isso estou utilizando o endpoint com ?fq=skuId
  const url = "/api/catalog_system/pub/products/search/?fq=skuId:" + productId;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data: data ? data[0] : null, loading, error };
}
