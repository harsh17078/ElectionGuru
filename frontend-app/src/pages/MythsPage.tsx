import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, RotateCcw } from "lucide-react";

const mythsData = [
  {
    id: 1,
    myth: "I can vote online from my phone or computer.",
    fact: "Voting in India must be done in person at your designated polling booth using an EVM. Online voting is not available for general elections.",
  },
  {
    id: 2,
    myth: "If I don't vote, I'll lose my citizenship.",
    fact: "Voting is a right, not a legal obligation. Not voting does not affect your citizenship or legal status in any way.",
  },
  {
    id: 3,
    myth: "EVMs can easily be hacked or tampered with.",
    fact: "EVMs are standalone machines with no internet or wireless connectivity. They undergo rigorous testing and are secured with multiple layers of physical and electronic safeguards.",
  },
  {
    id: 4,
    myth: "My single vote doesn't really matter.",
    fact: "Many elections have been won by very small margins — sometimes by just 1 vote! Every vote counts and shapes the government.",
  },
  {
    id: 5,
    myth: "NOTA means the election will be re-conducted.",
    fact: "NOTA (None of the Above) lets you record dissent, but even if NOTA gets the most votes, the candidate with the highest valid votes still wins.",
  },
  {
    id: 6,
    myth: "I need my Voter ID card to vote; no other ID works.",
    fact: "The Election Commission accepts 12 different photo IDs including Aadhaar, Passport, Driving License, PAN card, and others.",
  },
  {
    id: 7,
    myth: "Postal ballots are only for military personnel.",
    fact: "Postal ballots are available for service voters, government employees on election duty, senior citizens (80+), PwD voters, and those in preventive detention.",
  },
  {
    id: 8,
    myth: "The ruling party controls the Election Commission.",
    fact: "The Election Commission of India is a constitutional body that functions independently. Commissioners are appointed by the President and can only be removed through impeachment.",
  },
];

export default function MythsPage() {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const toggleFlip = (id: number) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = () => setFlipped({});

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-10"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3">
          <span className="gradient-text">{t("myths_page.title")}</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg mb-4">{t("myths_page.subtitle")}</p>
        <button
          onClick={resetAll}
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset All
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {mythsData.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            onClick={() => toggleFlip(item.id)}
            className="cursor-pointer group perspective"
          >
            <div
              className={`relative min-h-[160px] sm:min-h-[200px] rounded-2xl border transition-all duration-500 ${
                flipped[item.id]
                  ? "bg-trigreen/5 border-trigreen/40 shadow-lg shadow-trigreen/10"
                  : "bg-card border-border/60 hover:border-rose-400/40 hover:shadow-lg hover:shadow-rose-500/5"
              }`}
            >
              <div className="p-4 sm:p-6">
                {/* Badge */}
                <div className="flex items-center gap-2 mb-4">
                  {flipped[item.id] ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-trigreen/10 text-trigreen text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t("myths_page.fact")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-wider">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {t("myths_page.myth")}
                    </span>
                  )}
                </div>

                {/* Content */}
                <p className="text-sm leading-relaxed">
                  {flipped[item.id] ? item.fact : item.myth}
                </p>

                {/* Hint */}
                {!flipped[item.id] && (
                  <p className="text-xs text-muted-foreground/60 mt-4 group-hover:text-primary transition-colors">
                    👆 {t("myths_page.reveal")}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
