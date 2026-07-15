export interface Product {
  id: number;
  brand: string;
  name: string;
  description: string;
  price: number;
  salePrice: number;
  discountRate: number;
  category: "원두" | "분쇄커피" | "커피믹스";
  weight: string;
  origin: string;
  rating: number;
  reviewCount: number;
  likeCount: number;
  stock: number;
  delivery: string;
  tags: string[];
  isNew: boolean;
  isBest: boolean;
  /** 실제 상품 이미지가 준비되기 전까지 사용하는 이미지 설명 텍스트 */
  image: string;
  soldOut: boolean;
}
