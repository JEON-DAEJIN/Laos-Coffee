import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white px-4 py-8 dark:border-zinc-800 dark:bg-zinc-950 sm:px-8">
        <p className="text-sm font-medium text-amber-700">Lao Aroma</p>
        <h1 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          라오스 유기농 커피, 여행의 기억을 다시 선물합니다
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500 sm:text-base">
          루앙프라방의 골목길, 메콩강의 아침, 볼라벤 고원의 커피 농장 —
          그 순간을 다시 떠올리게 하는 유기농 커피를 만나보세요.
        </p>
      </header>

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            전체 상품
          </h2>
          <span className="text-sm text-zinc-500">
            {products.length}개 상품
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
