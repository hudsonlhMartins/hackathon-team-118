export interface Product {
  productId: string;
  productName: string;
  brand: string;
  brandId: number;
  brandImageUrl?: null;
  linkText: string;
  productReference: string;
  productReferenceCode?: string;
  categoryId: string;
  productTitle?: string;
  metaTagDescription?: string;
  releaseDate: string;
  clusterHighlights: ClusterHighlights;
  productClusters: ProductClusters;
  searchableClusters?: SearchableClusters;
  categories?: (string)[] | null;
  categoriesIds?: (string)[] | null;
  link: string;
  allSpecifications?: (string)[] | null;
  allSpecificationsGroups?: (string)[] | null;
  description: string;
  items?: (ItemsEntity)[] | null;
}
export interface ClusterHighlights {
}
export interface ProductClusters {
}
export interface SearchableClusters {
}
export interface ItemsEntity {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  ean: string;
  referenceId?: (ReferenceIdEntity)[] | null;
  measurementUnit: string;
  unitMultiplier: number;
  modalType?: null;
  isKit: boolean;
  images?: (ImagesEntity)[] | null;
  sellers?: (SellersEntity)[] | null;
  Videos?: (null)[] | null;
  estimatedDateArrival?: null;
}
export interface ReferenceIdEntity {
  Key: string;
  Value: string;
}
export interface ImagesEntity {
  imageId: string;
  imageLabel: string;
  imageTag: string;
  imageUrl: string;
  imageText: string;
  imageLastModified: string;
}
export interface SellersEntity {
  sellerId: string;
  sellerName: string;
  addToCartLink: string;
  sellerDefault: boolean;
  commertialOffer: CommertialOffer;
}
export interface CommertialOffer {
  DeliverySlaSamplesPerRegion: DeliverySlaSamplesPerRegion;
  Installments?: (InstallmentsEntity)[] | null;
  DiscountHighLight?: (null)[] | null;
  GiftSkuIds?: (null)[] | null;
  Teasers?: (null)[] | null;
  PromotionTeasers?: (null)[] | null;
  BuyTogether?: (null)[] | null;
  ItemMetadataAttachment?: (null)[] | null;
  Price: number;
  ListPrice: number;
  PriceWithoutDiscount: number;
  RewardValue: number;
  PriceValidUntil: string;
  AvailableQuantity: number;
  IsAvailable: boolean;
  Tax: number;
  DeliverySlaSamples?: (DeliverySlaSamplesEntity)[] | null;
  GetInfoErrorMessage?: null;
  CacheVersionUsedToCallCheckout: string;
  PaymentOptions: PaymentOptions;
}
export interface DeliverySlaSamplesPerRegion {
  0: DeliverySlaSamplesEntity;
}
export interface DeliverySlaSamplesEntity {
  DeliverySlaPerTypes?: (null)[] | null;
  Region?: null;
}
export interface InstallmentsEntity {
  Value: number;
  InterestRate: number;
  TotalValuePlusInterestRate: number;
  NumberOfInstallments: number;
  PaymentSystemName: string;
  PaymentSystemGroupName: string;
  Name: string;
}
export interface PaymentOptions {
  installmentOptions?: (InstallmentOptionsEntity)[] | null;
  paymentSystems?: (PaymentSystemsEntity)[] | null;
  payments?: (null)[] | null;
  giftCards?: (null)[] | null;
  giftCardMessages?: (null)[] | null;
  availableAccounts?: (null)[] | null;
  availableTokens?: (null)[] | null;
}
export interface InstallmentOptionsEntity {
  paymentSystem: string;
  bin?: null;
  paymentName: string;
  paymentGroupName: string;
  value: number;
  installments?: (InstallmentsEntity1)[] | null;
}
export interface InstallmentsEntity1 {
  count: number;
  hasInterestRate: boolean;
  interestRate: number;
  value: number;
  total: number;
  sellerMerchantInstallments?: (SellerMerchantInstallmentsEntity)[] | null;
}
export interface SellerMerchantInstallmentsEntity {
  id: string;
  count: number;
  hasInterestRate: boolean;
  interestRate: number;
  value: number;
  total: number;
}
export interface PaymentSystemsEntity {
  id: number;
  name: string;
  groupName: string;
  validator?: null;
  stringId: string;
  template: string;
  requiresDocument: boolean;
  isCustom: boolean;
  description?: null;
  requiresAuthentication: boolean;
  dueDate: string;
  availablePayments?: null;
}

export interface UserInfo {
  UserId: string;
  IsReturningUser: boolean;
  IsUserDefined: boolean;
  IsPJ: boolean;
  FirstName: string;
  LastName: string;
  Gender: string;
  Email: string;
}
