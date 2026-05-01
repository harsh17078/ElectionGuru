import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CreditCard,
  UserSearch,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  MapPin,
  User,
  Calendar,
  Hash,
  Building2,
  Vote,
  ShieldCheck,
  Info,
  ExternalLink,
} from "lucide-react";

interface VoterDetails {
  epic: string;
  name: string;
  father_name: string;
  gender: string;
  age: number;
  state: string;
  constituency: string;
  ac_name: string;
  part_no: string;
  serial_no: string;
  polling_station: string;
}

interface VerifyResponse {
  found: boolean;
  message: string;
  voter?: VoterDetails;
  validation_errors: string[];
}

type SearchTab = "epic" | "details";

export default function VerifyPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SearchTab>("epic");
  const [epicInput, setEpicInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [dobInput, setDobInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetch("/api/states")
      .then((res) => res.json())
      .then(setStates)
      .catch(() => {});
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);
    setHasSearched(true);

    const body =
      activeTab === "epic"
        ? { search_type: "epic", epic: epicInput }
        : { search_type: "details", name: nameInput, dob: dobInput, state: stateInput };

    try {
      const res = await fetch("/api/verify-voter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: VerifyResponse = await res.json();
      setResult(data);
    } catch {
      setResult({
        found: false,
        message: "Could not connect to the server. Please ensure the backend is running.",
        validation_errors: [],
      });
    }
    setLoading(false);
  };

  const handleReset = () => {
    setEpicInput("");
    setNameInput("");
    setDobInput("");
    setStateInput("");
    setResult(null);
    setHasSearched(false);
  };

  const sampleEPICs = ["ABC1234567", "DEF7654321", "GHI9876543", "MNO3216549", "PQR1593572"];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-60 right-1/3 w-64 h-64 bg-saffron/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-8 sm:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 dark:text-emerald-400 text-xs sm:text-sm font-medium mb-4">
            <ShieldCheck className="w-4 h-4" />
            {t("verify_page.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4">
            <span className="gradient-text">{t("verify_page.title")}</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("verify_page.subtitle")}
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl bg-card border border-border/60 shadow-2xl shadow-black/5 overflow-hidden"
        >
          {/* Tab Switcher */}
          <div className="flex border-b border-border/40">
            <button
              onClick={() => { setActiveTab("epic"); setResult(null); setHasSearched(false); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition-all duration-300 relative
                ${activeTab === "epic" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <CreditCard className="w-4 h-4" />
              {t("verify_page.tab_epic")}
              {activeTab === "epic" && (
                <motion.div
                  layoutId="verify-tab-indicator"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
                />
              )}
            </button>
            <button
              onClick={() => { setActiveTab("details"); setResult(null); setHasSearched(false); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition-all duration-300 relative
                ${activeTab === "details" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <UserSearch className="w-4 h-4" />
              {t("verify_page.tab_details")}
              {activeTab === "details" && (
                <motion.div
                  layoutId="verify-tab-indicator"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
                />
              )}
            </button>
          </div>

          {/* Form Body */}
          <div className="p-5 sm:p-8">
            <AnimatePresence mode="wait">
              {activeTab === "epic" ? (
                <motion.div
                  key="epic"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">
                    {t("verify_page.epic_label")}
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                    <input
                      id="epic-input"
                      type="text"
                      value={epicInput}
                      onChange={(e) => setEpicInput(e.target.value.toUpperCase())}
                      placeholder="e.g. ABC1234567"
                      maxLength={10}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/50 border border-border/60 text-foreground text-base sm:text-lg font-mono tracking-widest placeholder:text-muted-foreground/40 placeholder:tracking-normal placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground/70 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {t("verify_page.epic_hint")}
                  </p>

                  {/* Quick Try chips */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">{t("verify_page.try_sample")}</p>
                    <div className="flex flex-wrap gap-2">
                      {sampleEPICs.map((epic) => (
                        <button
                          key={epic}
                          onClick={() => setEpicInput(epic)}
                          className="px-3 py-1.5 rounded-lg bg-primary/8 text-primary text-xs font-mono hover:bg-primary/15 hover:scale-105 transition-all duration-200 border border-primary/15"
                        >
                          {epic}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">
                      {t("verify_page.name_label")}
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                      <input
                        id="name-input"
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-muted/50 border border-border/60 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                      />
                    </div>
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">
                      {t("verify_page.dob_label")}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                      <input
                        id="dob-input"
                        type="date"
                        value={dobInput}
                        onChange={(e) => setDobInput(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-muted/50 border border-border/60 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">
                      {t("verify_page.state_label")}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                      <select
                        id="state-input"
                        value={stateInput}
                        onChange={(e) => setStateInput(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-muted/50 border border-border/60 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all appearance-none"
                      >
                        <option value="">{t("verify_page.state_placeholder")}</option>
                        {states.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                id="verify-btn"
                onClick={handleVerify}
                disabled={loading || (activeTab === "epic" ? !epicInput.trim() : (!nameInput.trim() || !dobInput || !stateInput))}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-primary to-violet-600 text-white font-semibold text-base shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {loading ? t("verify_page.searching") : t("verify_page.verify_btn")}
              </button>
              {hasSearched && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleReset}
                  className="px-6 py-4 rounded-2xl bg-muted text-muted-foreground font-semibold text-base hover:bg-muted/80 hover:text-foreground transition-all duration-200"
                >
                  {t("verify_page.reset_btn")}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="mt-6 sm:mt-8"
            >
              {/* Validation Errors */}
              {result.validation_errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 mb-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <span className="font-semibold text-amber-500">{t("verify_page.validation_error")}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {result.validation_errors.map((err, i) => (
                      <li key={i} className="text-sm text-amber-400/90 flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        {err}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Found / Not Found Banner */}
              {result.validation_errors.length === 0 && (
                <div
                  className={`rounded-2xl p-5 sm:p-6 border ${
                    result.found
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.found ? (
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-7 h-7 text-red-500" />
                      </div>
                    )}
                    <div>
                      <p className={`text-lg font-bold ${result.found ? "text-emerald-500" : "text-red-500"}`}>
                        {result.found ? t("verify_page.found_title") : t("verify_page.not_found_title")}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {result.found ? t("verify_page.found_desc") : t("verify_page.not_found_desc")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Voter Details Card */}
              {result.found && result.voter && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 rounded-3xl bg-card border border-border/60 shadow-xl overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-primary/10 via-violet-500/10 to-emerald-500/10 px-5 sm:px-8 py-5 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron via-primary to-trigreen flex items-center justify-center shadow-lg">
                        <Vote className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{result.voter.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{t("verify_page.epic_prefix")}{result.voter.epic}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="p-5 sm:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <DetailItem
                        icon={<User className="w-4 h-4" />}
                        label={t("verify_page.detail_father")}
                        value={result.voter.father_name}
                      />
                      <DetailItem
                        icon={<User className="w-4 h-4" />}
                        label={t("verify_page.detail_gender")}
                        value={result.voter.gender}
                      />
                      <DetailItem
                        icon={<Calendar className="w-4 h-4" />}
                        label={t("verify_page.detail_age")}
                        value={`${result.voter.age} years`}
                      />
                      <DetailItem
                        icon={<MapPin className="w-4 h-4" />}
                        label={t("verify_page.detail_state")}
                        value={result.voter.state}
                      />
                      <DetailItem
                        icon={<Building2 className="w-4 h-4" />}
                        label={t("verify_page.detail_constituency")}
                        value={result.voter.constituency}
                      />
                      <DetailItem
                        icon={<Building2 className="w-4 h-4" />}
                        label={t("verify_page.detail_ac")}
                        value={result.voter.ac_name}
                      />
                      <DetailItem
                        icon={<Hash className="w-4 h-4" />}
                        label={t("verify_page.detail_part")}
                        value={result.voter.part_no}
                      />
                      <DetailItem
                        icon={<Hash className="w-4 h-4" />}
                        label={t("verify_page.detail_serial")}
                        value={result.voter.serial_no}
                      />
                      <div className="sm:col-span-2">
                        <DetailItem
                          icon={<MapPin className="w-4 h-4" />}
                          label={t("verify_page.detail_polling")}
                          value={result.voter.polling_station}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Not Found - Help Section */}
              {!result.found && result.validation_errors.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 rounded-2xl bg-card border border-border/60 p-5 sm:p-6"
                >
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    {t("verify_page.help_title")}
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">1.</span>
                      {t("verify_page.help_1")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">2.</span>
                      {t("verify_page.help_2")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">3.</span>
                      {t("verify_page.help_3")}
                    </li>
                  </ul>
                  <a
                    href="https://voters.eci.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t("verify_page.register_link")}
                  </a>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 sm:mt-12 rounded-2xl bg-primary/5 border border-primary/15 p-4 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary/70 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">{t("verify_page.disclaimer_title")}</strong>{" "}
              {t("verify_page.disclaimer_text")}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}
