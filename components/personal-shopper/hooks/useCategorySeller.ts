import { useCallback, useEffect, useState } from "preact/hooks";

import { SellerType } from "$store/service/repositories/ISellerRepository.ts";

import {Product} from '$store/components/personal-shopper/types.ts'


export default function useCategorySeller(productId: string) {

  const [loading, setLoading] = useState(false)
  const [hasSeller, setHasSeller] = useState(true)

  

  const getProductById = async(productId:string)=>{
    const url = `/api/catalog_system/pub/products/search/?fq=skuId:${productId}`

    try {

      const res = await fetch(url)
      const data = await res.json() as Product[]

      return data[0].categoryId

    } catch(err){
      return null
    }
   
  }
  const sellerVerify = useCallback(async()=>{
  
    setLoading(true)
  
    try{
      const res = await fetch('/list-sellers')
      const sellerList = await res.json() as SellerType[] | []

      console.log("sellerList",sellerList)
      if(!sellerList.length){
        setHasSeller(false)
        return
      }

      const categoryId = await getProductById(productId)

    
      if(!categoryId){

        setHasSeller(false)
        return
      }

      const filterSellersActive = sellerList.filter(seller => seller.isActive === true)

      if(!filterSellersActive.length) {
        setHasSeller(false)
        return
      }

      for(let filterSellerActive of filterSellersActive){
        const categorysIds = filterSellerActive.sellerCategoryIds
        if(!categorysIds) continue

        const arrayCategoryIds = categorysIds.split('/')

        console.log('arrayCategoryIds.includes(categoryId)', arrayCategoryIds.includes(categoryId))
        console.log('categoryId', categoryId)
        if(arrayCategoryIds.includes(categoryId)){
          setHasSeller(true)
          break
        }
      }




    }catch(err){
      console.log('err', err)
    }
    finally{
      setLoading(false)
    }

  },[])


  useEffect(()=>{
    sellerVerify()
  },[sellerVerify])



  // TODO: validar se ha um vendedor para essa caregoria
  //pegando do tabela cliente o vendedor com o cluester de vendedor que tbm tem a flag de ativo. 
  return { 
    hasSeller, 
    loading 
  };
}
