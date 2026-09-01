"use client";

import { useState } from "react";
import { cx } from "@/lib/format";
import { ArrowRight, SpinnerIcon } from "./icons";
import { useStore } from "./store";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const { pushToast } = useStore();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      pushToast({ title: "Введите корректный e-mail", tone: "error" });
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
      setEmail("");
      pushToast({
        title: "Вы подписаны",
        description: "Промокод STREET30 уже в вашей почте.",
        tone: "success",
      });
      window.setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("idle");
      pushToast({ title: "Что-то пошло не так", tone: "error" });
    }
  };

  return (
    <form onSubmit={submit} className="flex w-full">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ваш@email.ru"
        className={cx(
          "h-12 min-w-0 flex-1 border px-4 text-[13px] outline-none transition-colors",
          dark
            ? "border-white/20 bg-transparent text-white placeholder:text-white/40 focus:border-white"
            : "border-black/15 bg-white placeholder:text-[#8a8a8a] focus:border-[#111]",
        )}
      />
      <button
        type="submit"
        disabled={state !== "idle"}
        className="btn-red flex h-12 items-center gap-2 px-5 text-[11px] font-bold tracking-[0.16em] text-white disabled:opacity-70"
      >
        {state === "loading" ? (
          <SpinnerIcon width={15} height={15} />
        ) : state === "done" ? (
          "ГОТОВО ✓"
        ) : (
          <>
            ПОДПИСАТЬСЯ <ArrowRight width={15} height={15} />
          </>
        )}
      </button>
    </form>
  );
}
