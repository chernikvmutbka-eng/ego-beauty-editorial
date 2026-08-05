"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { useStore } from "./store-provider";

const prizeLabels = ["Гайд по ассортименту", "Гайд по продвижению", "Промокод 1", "Промокод 2", "Суперприз"];
type Result = { label: string; code: string; discount: number; expiresAt: number; segmentIndex: number; repeated?: boolean; verification?: string };

export function FortuneClient() {
  const { applyPromo } = useStore();
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [sound, setSound] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    track("wheel_open");
    queueMicrotask(() => {
      try { const saved = JSON.parse(localStorage.getItem("ego-wheel-prize") ?? "null") as Result | null; if (saved?.code) setResult(saved); } catch {}
    });
  }, []);

  function playWin() {
    if (!sound) return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = audioRef.current ?? new AudioContextClass();
    audioRef.current = context;
    [523, 659, 784].forEach((frequency, index) => {
      const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.0001, context.currentTime); gain.gain.exponentialRampToValueAtTime(.1, context.currentTime + .02 + index * .08); gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .28 + index * .08);
      oscillator.connect(gain).connect(context.destination); oscillator.start(context.currentTime + index * .08); oscillator.stop(context.currentTime + .35 + index * .08);
    });
  }

  async function spin(event: FormEvent) {
    event.preventDefault(); setError(""); setResult(null);
    if (!consent || !/^@?[A-Za-z0-9_]{5,32}$/.test(contact.trim())) { setError("Введите корректный ник Telegram и примите правила акции."); return; }
    setSpinning(true); track("wheel_spin");
    try {
      const response = await fetch("/api/wheel", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contact, consent, requestId: crypto.randomUUID() }) });
      const body = await response.json() as Result & { error?: string };
      if (!response.ok && response.status !== 409 && response.status !== 429) throw new Error(body.error ?? "Не удалось прокрутить колесо");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const segment = 360 / prizeLabels.length;
      setRotation((current) => current + 1440 + (360 - (body.segmentIndex * segment + segment / 2)));
      window.setTimeout(() => { setResult(body); setSpinning(false); localStorage.setItem("ego-wheel-prize", JSON.stringify(body)); track("wheel_prize", { label: body.label, code: body.code }); playWin(); }, reduced ? 40 : 4300);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Не удалось прокрутить колесо"); setSpinning(false); }
  }

  function claim() {
    if (!result) return;
    if (result.discount) { applyPromo(result.code, result.discount); window.location.href = "/cart"; return; }
    navigator.clipboard?.writeText(result.code);
  }

  return <>
    <section className="wheel-page">
      <div className="wheel-copy"><p className="eyebrow light">EGO Fortune / один честный шанс</p><h1>Вам<br />точно<br /><em>повезёт</em></h1><p>Подпишитесь на Telegram EGO Beauty, укажите свой ник и испытайте удачу. Каждый 300-й участник получает суперприз.</p><a className="telegram-subscribe" href="https://t.me/egobeauty_professional" target="_blank" rel="noreferrer">Подписаться на Telegram ↗</a><button className="sound-toggle" onClick={() => setSound((value) => !value)}>{sound ? "Звук включён" : "Звук выключен"}</button></div>
      <div className="wheel-stage"><div className="wheel-pointer" aria-hidden="true" /><div className="fortune-wheel" style={{ transform: `rotate(${rotation}deg)`, transitionDuration: spinning ? "4.2s" : "0s" }} aria-label="Колесо призов">{prizeLabels.map((label, index) => <span key={label} style={{ transform: `rotate(${index * (360 / prizeLabels.length) + 36}deg) translateY(-41%)` }}>{label}</span>)}<i className="wheel-core">EGO</i></div></div>
      <form className="wheel-form" onSubmit={spin}><label>Ник в Telegram<input value={contact} onChange={(event) => setContact(event.target.value)} type="text" autoComplete="username" placeholder="@username" disabled={spinning} /></label><label className="consent-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} disabled={spinning} /><span>Я подписан(а) на канал, принимаю <a href="#rules">правила акции</a> и обработку данных</span></label>{error && <p role="alert" className="wheel-error">{error}</p>}<button className="spin-button" disabled={spinning}>{spinning ? "Колесо вращается…" : "Крутить"}</button></form>
      {result && <div className="prize-modal" role="dialog" aria-modal="true" aria-labelledby="prize-title"><button className="modal-close" type="button" aria-label="Закрыть результат" onClick={() => setResult(null)}>×</button><div className="confetti" aria-hidden="true">{Array.from({ length: 18 }).map((_, index) => <i key={index} style={{ left: `${(index * 37) % 100}%`, animationDelay: `${(index % 6) * .1}s` }} />)}</div><p className="eyebrow">Ваш приз</p><h2 id="prize-title">{result.label}</h2><p>{result.discount ? `Промокод действует до ${new Date(result.expiresAt).toLocaleDateString("ru-RU")}.` : "Сохраните код — команда EGO Beauty отправит приз после проверки условий акции."}</p><button className="promo-code" onClick={() => navigator.clipboard?.writeText(result.code)}>{result.code}<span>Копировать</span></button><div><button className="primary-button" onClick={claim}>{result.discount ? "Применить промокод" : "Скопировать код"}</button><Link href="/catalog">Открыть каталог →</Link></div></div>}
    </section>
    <section className="wheel-rules shell" id="rules"><div><p className="eyebrow">Правила</p><h2>Один Telegram.<br />Один честный шанс.</h2></div><div><ol><li><strong>Подписка</strong><p>Перед участием подпишитесь на Telegram-канал EGO Beauty и укажите свой публичный ник.</p></li><li><strong>Одна попытка</strong><p>Один Telegram-аккаунт участвует один раз. Повторные запросы сохраняют первый результат.</p></li><li><strong>Призы</strong><p>Гайды, промокоды и специальный суперприз для каждого 300-го зарегистрированного участника.</p></li><li><strong>Проверка</strong><p>Автоматическая проверка подписки включается после подключения бота. До этого команда подтверждает подписку перед выдачей приза.</p></li></ol></div></section>
  </>;
}
