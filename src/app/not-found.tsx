import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[900px] flex-col items-center justify-center px-4 py-24 text-center">
      <p className="eyebrow text-[#e50000]">Ошибка 404</p>
      <h1 className="display mt-5 text-[clamp(56px,14vw,160px)]">СТРАНИЦА ПОТЕРЯЛАСЬ</h1>
      <p className="mt-4 max-w-[420px] text-[14px] leading-relaxed text-[#8a8a8a]">
        Эта страница распродана, переехала или никогда не существовала. Вернёмся
        к хорошему.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="btn-red px-9 py-4 text-[12px] font-bold tracking-[0.2em] text-white"
        >
          НА ГЛАВНУЮ
        </Link>
        <Link
          href="/catalog"
          className="border border-[#111] px-9 py-4 text-[12px] font-bold tracking-[0.2em] transition-colors hover:bg-[#111] hover:text-white"
        >
          В КАТАЛОГ
        </Link>
      </div>
    </div>
  );
}
