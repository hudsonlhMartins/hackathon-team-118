import { useEffect, useState } from "preact/hooks";

export default function useCategorySeller(productId: string) {
  //   const [data, setData] = useState<any | null>(null);
  //   const [loading, setLoading] = useState<boolean>(true);
  //   const [error, setError] = useState<Error | null>(null);
  //    const url = "https://www.stylestore.com.ar/api/catalog_system/pub/products/search/?fq=productId:" + productId
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await fetch(url);
  //         if (!response.ok) {
  //           throw new Error(`Request failed with status: ${response.status}`);
  //         }
  //         const result = await response.json();
  //         setData(result);
  //         setLoading(false);
  //       } catch (err) {
  //         setError(err);
  //         setLoading(false);
  //       }
  //     };

  //     fetchData();
  //   }, [url]);

  //   return { data, loading, error };

  // TODO: validar se ha um vendedor para essa caregoria
  //pegando do tabela cliente o vendedor com o cluester de vendedor que tbm tem a flag de ativo. 
  return { hasSeller: true };
}
