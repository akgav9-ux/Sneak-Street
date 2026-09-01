"use client";

import { useEffect, useState } from "react";
import type { QuestionDTO } from "@/db/queries";
import { useStore } from "@/components/store";
import { cx, formatDate, plural } from "@/lib/format";
import { CheckIcon, SpinnerIcon } from "@/components/icons";

export function ProductQuestions({
  slug,
  productName,
  initial,
}: {
  slug: string;
  productName: string;
  initial: QuestionDTO[];
}) {
  const { pushToast, profile, ready } = useStore();
  const [items, setItems] = useState<QuestionDTO[]>(initial);
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (ready && !author) setAuthor(profile.name);
  }, [ready, profile.name, author]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim().length < 5) {
      pushToast({ title: "Опишите вопрос подробнее", tone: "error" });
      return;
    }
    setSending(true);
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productSlug: slug,
        productName,
        author,
        email,
        question,
      }),
    });
    setSending(false);
    if (res.ok) {
      setQuestion("");
      setSent(true);
      pushToast({
        title: "Вопрос отправлен",
        description: "Ответим в течение нескольких часов",
        tone: "success",
      });
      window.setTimeout(() => setSent(false), 5000);
      const fresh = await fetch(`/api/questions?slug=${slug}`).then((r) => r.json());
      setItems(fresh.items ?? []);
    } else {
      pushToast({ title: "Не удалось отправить вопрос", tone: "error" });
    }
  };

  return (
    <section id="questions" className="mt-20 border-t border-black/[0.07] pt-12">
      <div className="grid gap-10 lg:grid-cols-[340px_1fr]">
        <div>
          <p className="eyebrow text-[#8a8a8a]">Вопрос — ответ</p>
          <h2 className="display mt-3 text-[34px]">ЕСТЬ ВОПРОС?</h2>
          <p className="mt-4 max-w-[320px] text-[13.5px] leading-relaxed text-[#8a8a8a]">
            Спросите про размер, посадку, материал или сроки доставки. Отвечаем
            лично — обычно в течение пары часов, ответ появится на этой странице.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-3">
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ваше имя"
              className="h-12 w-full border border-black/15 px-3 text-[13.5px] outline-none focus:border-[#111]"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail (необязательно)"
              className="h-12 w-full border border-black/15 px-3 text-[13.5px] outline-none focus:border-[#111]"
            />
            <textarea
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Например: какой размер брать при росте 180 и весе 75 кг?"
              className="w-full resize-y border border-black/15 p-3 text-[13.5px] leading-relaxed outline-none focus:border-[#111]"
            />
            <button
              type="submit"
              disabled={sending}
              className={cx(
                "btn-red flex w-full items-center justify-center gap-2 py-4 text-[12px] font-bold tracking-[0.18em] text-white transition-transform duration-300 hover:-translate-y-0.5",
                sending && "opacity-70",
              )}
            >
              {sending ? (
                <>
                  <SpinnerIcon width={16} height={16} /> ОТПРАВЛЯЕМ…
                </>
              ) : sent ? (
                <>
                  <CheckIcon width={16} height={16} /> ВОПРОС ОТПРАВЛЕН
                </>
              ) : (
                "ЗАДАТЬ ВОПРОС"
              )}
            </button>
          </form>
        </div>

        <div>
          <p className="text-[13px] font-bold tracking-[0.14em]">
            {items.length}{" "}
            {plural(items.length, "ОТВЕТ", "ОТВЕТА", "ОТВЕТОВ").toUpperCase()} НА
            ВОПРОСЫ ПОКУПАТЕЛЕЙ
          </p>

          {items.length === 0 ? (
            <div className="mt-5 border border-dashed border-black/12 p-10 text-center">
              <p className="text-[14.5px] font-semibold">
                По этому товару пока нет вопросов
              </p>
              <p className="mt-2 text-[13px] text-[#8a8a8a]">
                Будьте первым — мы ответим и опубликуем ответ здесь.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {items.map((q) => (
                <article
                  key={q.id}
                  className="border border-black/[0.08] p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0f0f2] text-[12px] font-bold">
                      В
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14.5px] font-semibold leading-snug">
                        {q.question}
                      </p>
                      <p className="mt-1 text-[11.5px] text-[#8a8a8a]">
                        {q.author} · {formatDate(q.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-3 border-l-2 border-[#e50000] bg-[#fafafa] p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111] text-[11px] font-bold text-white">
                      S&S
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold tracking-[0.14em] text-[#e50000]">
                        ОТВЕТ МАГАЗИНА
                      </p>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#3f3f43]">
                        {q.answer}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
