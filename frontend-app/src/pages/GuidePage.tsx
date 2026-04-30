import { useState, useEffect } from "react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  UserCheck,
  Megaphone,
  Vote,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  PartyPopper,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Voter Registration",
    color: "from-violet-500 to-purple-600",
    checklist: [
      "Check if your name is in the electoral roll at nvsp.in",
      "If not registered, fill Form 6 online or at the nearest Electoral Registration Office",
      "Attach proof of age and address (Aadhaar, passport, utility bill, etc.)",
      "Collect your EPIC (Voter ID) after approval",
    ],
    tips: "You must be 18+ on the qualifying date. NRI citizens can also register using Form 6A.",
  },
  {
    icon: UserCheck,
    title: "Candidate Nomination",
    color: "from-saffron to-orange-500",
    checklist: [
      "Candidate must be a registered voter in India",
      "File nomination with the Returning Officer in the constituency",
      "Pay security deposit (₹25,000 for General, ₹12,500 for SC/ST)",
      "Submit affidavit on criminal cases, assets, and education",
    ],
    tips: "Independent candidates can also contest. A proposer from the constituency is required.",
  },
  {
    icon: Megaphone,
    title: "Election Campaign",
    color: "from-sky-500 to-cyan-500",
    checklist: [
      "Parties and candidates campaign via rallies, TV, social media, and print",
      "Model Code of Conduct (MCC) is strictly enforced by ECI",
      "No campaigning allowed 48 hours before polling (silence period)",
      "Expenditure limits apply — monitored by Election Commission observers",
    ],
    tips: "Violations of MCC can lead to FIRs, bans, or disqualification.",
  },
  {
    icon: Vote,
    title: "Voting Day",
    color: "from-trigreen to-emerald-500",
    checklist: [
      "Carry a valid photo ID (Voter ID, Aadhaar, Passport, etc.)",
      "Go to your assigned polling booth (check Voter Helpline app)",
      "Get your finger marked with indelible ink",
      "Cast your vote on the EVM and verify on the VVPAT slip",
    ],
    tips: "Voting is typically from 7 AM to 6 PM. You can also use NOTA (None of the Above) option.",
  },
  {
    icon: BarChart3,
    title: "Counting & Results",
    color: "from-rose-500 to-pink-600",
    checklist: [
      "EVMs are securely transported to counting centers after polling",
      "Postal ballots are counted first, then EVM votes",
      "VVPAT verification is done for randomly selected booths",
      "Results are declared constituency-by-constituency",
    ],
    tips: "A party or coalition needs 272+ seats in Lok Sabha to form the government.",
  },
];

export default function GuidePage() {
  const { t } = useTranslation();
  const { progress, saveProgress } = useUserProgress();
  const [current, setCurrent] = useState(0);
  const [checked, setChecked] = useState<Record<number, boolean[]>>(
    Object.fromEntries(steps.map((s, i) => [i, new Array(s.checklist.length).fill(false)]))
  );
  const [completed, setCompleted] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    if (progress.guideStep > 0) setCurrent(progress.guideStep);
    if (progress.guideCompleted) setCompleted(true);
    if (progress.checkedItems && Object.keys(progress.checkedItems).length > 0) {
      setChecked(progress.checkedItems);
    }
  }, [progress.guideStep, progress.guideCompleted]);

  const step = steps[current];
  const Icon = step.icon;
  const progressPercent = ((current + 1) / steps.length) * 100;

  const toggleCheck = (idx: number) => {
    setChecked((prev) => {
      const updated = { ...prev };
      updated[current] = [...updated[current]];
      updated[current][idx] = !updated[current][idx];
      saveProgress({ checkedItems: updated });
      return updated;
    });
  };

  const allChecked = checked[current]?.every(Boolean);

  const next = () => {
    if (current < steps.length - 1) {
      const nextStep = current + 1;
      setCurrent(nextStep);
      saveProgress({ guideStep: nextStep });
    } else {
      setCompleted(true);
      saveProgress({ guideCompleted: true });
    }
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const restart = () => {
    setCurrent(0);
    setCompleted(false);
    const freshChecked = Object.fromEntries(steps.map((s, i) => [i, new Array(s.checklist.length).fill(false)]));
    setChecked(freshChecked);
    saveProgress({ guideStep: 0, guideCompleted: false, checkedItems: freshChecked });
  };

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-trigreen to-emerald-400 flex items-center justify-center shadow-xl">
            <PartyPopper className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4 gradient-text">{t("guide_page.completed")}</h2>
          <p className="text-muted-foreground mb-8">
            You now understand the complete Indian election process from voter registration to result declaration.
          </p>
          <button
            onClick={restart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t("guide_page.restart")}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3">
          <span className="gradient-text">{t("guide_page.title")}</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg">{t("guide_page.subtitle")}</p>
      </motion.div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, i) => {
            const SIcon = s.icon;
            return (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  i === current
                    ? "border-primary bg-primary text-white scale-110 shadow-lg shadow-primary/30"
                    : i < current
                    ? "border-trigreen bg-trigreen/10 text-trigreen"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {i < current ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <SIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
            );
          })}
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-saffron via-primary to-trigreen rounded-full"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">
          Step {current + 1} of {steps.length}
        </p>
      </div>

      {/* Step Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6 md:p-8 rounded-2xl border border-border/60 bg-card"
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div
              className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{step.title}</h2>
              <p className="text-sm text-muted-foreground">Complete the checklist below</p>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3 mb-6">
            {step.checklist.map((item, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleCheck(idx)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
                  checked[current][idx]
                    ? "bg-trigreen/5 border-trigreen/30"
                    : "bg-card border-border/60 hover:border-primary/30"
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    checked[current][idx] ? "bg-trigreen border-trigreen" : "border-muted-foreground/30"
                  }`}
                >
                  {checked[current][idx] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className={`text-sm ${checked[current][idx] ? "line-through text-muted-foreground" : ""}`}>
                  {item}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Tip */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-sm text-muted-foreground mb-6">
            💡 <span className="font-medium text-foreground">Pro Tip:</span> {step.tips}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prev}
              disabled={current === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("guide_page.prev")}
            </button>
            <button
              onClick={next}
              disabled={!allChecked}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                allChecked
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {current === steps.length - 1 ? t("guide_page.finish") : t("guide_page.next")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
