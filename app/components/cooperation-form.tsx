"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { track } from "@/lib/analytics";
import { cooperationSchema, CooperationValues } from "@/lib/validation";

export function CooperationForm() {
  const [successId, setSuccessId] = useState("");
  const [serverError, setServerError] = useState("");
  const form = useForm<CooperationValues>({ resolver: zodResolver(cooperationSchema), defaultValues: { name: "", phone: "", email: "", telegram: "", location: "", partnershipType: "wholesale", company: "", website: "", monthlyVolume: "", comment: "", consent: false } });
  async function submit(values: CooperationValues) { setServerError(""); track("cooperation_submit", { type: values.partnershipType }); try { const response = await fetch("/api/cooperation", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) }); const body = await response.json() as { id?: string; error?: string }; if (!response.ok || !body.id) throw new Error(body.error ?? "Не удалось отправить заявку"); setSuccessId(body.id); form.reset(); } catch (error) { setServerError(error instanceof Error ? error.message : "Не удалось отправить заявку"); } }
  if (successId) return <div className="coop-success"><span>✓</span><h3>Заявка принята</h3><p>Номер: {successId}. Команда увидит её в административном разделе.</p><button onClick={() => setSuccessId("")}>Отправить ещё одну</button></div>;
  const error = (name: keyof CooperationValues) => form.formState.errors[name]?.message;
  return <form className="coop-form" onSubmit={form.handleSubmit(submit)}>
    <div className="form-grid"><label>Имя *<input {...form.register("name")} />{error("name") && <small>{error("name")}</small>}</label><label>Телефон *<input type="tel" {...form.register("phone")} />{error("phone") && <small>{error("phone")}</small>}</label><label>Email *<input type="email" {...form.register("email")} />{error("email") && <small>{error("email")}</small>}</label><label>Telegram<input {...form.register("telegram")} placeholder="@username" /></label><label className="wide">Город и страна *<input {...form.register("location")} />{error("location") && <small>{error("location")}</small>}</label></div>
    <label className="select-field">Тип сотрудничества *<select {...form.register("partnershipType")}><option value="wholesale">Опт и дистрибуция</option><option value="studio">Магазин, салон или студия</option><option value="education">Школа или преподаватель</option><option value="ambassador">Мастер, блогер или амбассадор</option></select></label>
    <div className="form-grid"><label>Компания / проект<input {...form.register("company")} /></label><label>Сайт / соцсети<input {...form.register("website")} /></label><label className="wide">Ориентировочный объём в месяц<input {...form.register("monthlyVolume")} placeholder="Например: 50 000–100 000 ₽" /></label></div>
    <label className="comment-field">Комментарий<textarea {...form.register("comment")} rows={5} /></label><label className="consent-check"><input type="checkbox" {...form.register("consent")} /><span>Согласен(на) на обработку персональных данных *</span></label>{error("consent") && <p className="form-error">{error("consent")}</p>}{serverError && <p className="server-error" role="alert">{serverError}</p>}<button className="primary-button" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Отправляем…" : "Отправить заявку"}</button>
  </form>;
}
