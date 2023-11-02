export type SellerType = {
    userId: string,
    email: string,
    isSeller: boolean,
    isActive: boolean,
    id:string
}

export interface ISellerRepository{
    findByEmail?(email:string):Promise<SellerType | false>
    updateStatus(email:string, status:boolean):Promise<boolean>
}