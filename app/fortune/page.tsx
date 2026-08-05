import type { Metadata } from "next";
import { FortuneClient } from "../components/fortune-client";

export const metadata: Metadata = { title: "Колесо фортуны", description: "Одна честная попытка каждые 30 дней: скидка, доставка или подарок от EGO Beauty." };
export default function FortunePage() { return <FortuneClient />; }
