"use client";

import { useState } from "react";
import { MONTHS } from "./months";
import PolaroidCard from "../components/PolaroidCard";
import MonthModal from "../components/MonthModal";

export default function Home() {
  const [openMonth, setOpenMonth] = useState(null);

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-8 sm:py-14">
      <header className="mx-auto mb-10 max-w-5xl text-center sm:mb-14">
        <h1 className="font-pixel text-5xl leading-none tracking-[0.06em] text-ink sm:text-7xl [text-shadow:3px_3px_0_rgba(0,0,0,0.18)]">
          <span className="inline-block">Flores</span>{" "}
          <span className="inline-block text-pink">para ti</span>
        </h1>
        <p className="mt-4 font-pixel text-xl text-ink/85 sm:text-2xl">
          Un ramo nuevo cada mes <span className="text-pink">♥</span>
        </p>
        <div className="mt-5 inline-block border-[3px] border-ink bg-polaroid px-5 py-2 pixel-shadow">
          <p className="font-pixel text-base tracking-[0.18em] text-ink sm:text-lg">
            ELIGE UN MES Y ABRE TU SORPRESA
          </p>
        </div>
      </header>

      <section
        aria-label="Calendario de flores"
        className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 md:grid-cols-3 lg:grid-cols-4"
      >
        {MONTHS.map((month) => (
          <PolaroidCard key={month.id} month={month} onOpen={setOpenMonth} />
        ))}
      </section>

      <MonthModal monthId={openMonth} onClose={() => setOpenMonth(null)} />
    </main>
  );
}
