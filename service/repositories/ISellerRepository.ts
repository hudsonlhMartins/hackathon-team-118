export type SellerType = {
    userId: string,
    email: string,
    categoryId: string,
    isSeller: boolean,
    sellerCategoryIds: string,
    isActive: boolean
}

export interface ISellerRepository{
    findByEmail?(email:string):Promise<SellerType>
    updateStatus(email:string, status:boolean):Promise<void>
}