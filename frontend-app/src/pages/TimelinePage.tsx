import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Circle } from "lucide-react";

const timelineData = [
  {
    id: 1,
    title: "Election Announcement",
    description: "The Election Commission of India announces the schedule, including key dates for nominations, campaigning, and polling.",
    date: "Phase 1",
    status: "completed",
    detail: "The Model Code of Conduct comes into effect immediately after the announcement.",
  },
  {
    id: 2,
    title: "Voter Registration",
    description: "Citizens verify their names in the electoral roll or register as new voters through Form 6 online or offline.",
    date: "Phase 2",
    status: "completed",
    detail: "You can check your registration at nvsp.in or the Voter Helpline App.",
  },
  {
    id: 3,
    title: "Candidate Nomination",
    description: "Eligible candidates file their nomination papers with the Returning Officer of their constituency.",
    date: "Phase 3",
    status: "current",
    detail: "Candidates must submit a security deposit and meet eligibility criteria under the Representation of the People Act.",
  },
  {
    id: 4,
    title: "Scrutiny & Withdrawal",
    description: "Nominations are scrutinized for validity. Candidates may withdraw their nominations before the deadline.",
    date: "Phase 4",
    status: "upcoming",
    detail: "Only valid nominations proceed to the final list of contesting candidates.",
  },
  {
    id: 5,
    title: "Campaigning",
    description: "Political parties and candidates campaign through rallies, advertisements, door-to-door outreach, and social media.",
    date: "Phase 5",
    status: "upcoming",
    detail: "Campaigning must stop 48 hours before polling begins (silence period).",
  },
  {
    id: 6,
    title: "Polling Day",
    description: "Voters cast their votes using Electronic Voting Machines (EVMs) at designated polling booths.",
    date: "Phase 6",
    status: "upcoming",
    detail: "Voters must carry a valid photo ID. Polling hours are typically 7 AM to 6 PM.",
  },
  {
    id: 7,
    title: "Vote Counting",
    description: "EVMs are transported to counting centers. Votes are counted under strict security and observation.",
    date: "Phase 7",
    status: "upcoming",
    detail: "VVPAT slips from randomly selected booths are also verified.",
  },
  {
    id: 8,
    title: "Results Declaration",
    description: "Results are declared constituency-by-constituency. The party or coalition with majority forms the government.",
    date: "Phase 8",
    status: "upcoming",
    detail: "A party needs 272+ seats in Lok Sabha to form the government.",
  },
];

const statusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-6 h-6 text-trigreen" />;
    case "current":
      return <Clock className="w-6 h-6 text-saffron animate-pulse" />;
    default:
      return <Circle className="w-6 h-6 text-muted-foreground/40" />;
  }
};

const statusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "border-trigreen/50 bg-trigreen/5";
    case "current":
      return "border-saffron/50 bg-saffron/5 shadow-lg shadow-saffron/10";
    default:
      return "border-border/60 bg-card";
  }
};

export default function TimelinePage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3">
          <span className="gradient-text">{t("timeline_page.title")}</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg">{t("timeline_page.subtitle")}</p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-trigreen via-saffron to-primary" />

        <div className="space-y-6 sm:space-y-8">
          {timelineData.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="relative pl-12 sm:pl-20"
            >
              {/* Icon on timeline */}
              <div className="absolute left-1 sm:left-5 top-5 z-10 bg-background rounded-full p-0.5">
                {statusIcon(step.status)}
              </div>

              <div
                className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${statusColor(step.status)}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {step.date}
                  </span>
                  {step.status === "current" && (
                    <span className="text-xs font-semibold text-saffron animate-pulse">● Current</span>
                  )}
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-1">{step.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">{step.description}</p>
                <div className="text-xs text-muted-foreground/80 bg-muted/50 rounded-xl px-4 py-2.5 border border-border/40">
                  💡 {step.detail}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
