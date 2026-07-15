const GRADIENTS = [
  "from-amber-800 to-amber-950",
  "from-stone-700 to-stone-950",
  "from-orange-800 to-stone-900",
  "from-teal-700 to-stone-900",
];

function pickGradient(seed: number) {
  return GRADIENTS[seed % GRADIENTS.length];
}

interface ProductImagePlaceholderProps {
  seed: number;
  description: string;
  className?: string;
}

/**
 * 실제 상품 사진 에셋이 준비되기 전까지 사용하는 임시 이미지.
 * PRD의 mock 데이터 image 필드(이미지 설명 텍스트)를 그대로 노출한다.
 */
export function ProductImagePlaceholder({
  seed,
  description,
  className = "",
}: ProductImagePlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${pickGradient(
        seed
      )} p-4 text-center ${className}`}
      role="img"
      aria-label={description}
    >
      <span className="text-xs leading-snug text-amber-100/80">
        {description}
      </span>
    </div>
  );
}
