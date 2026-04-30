import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Clock,
  BookOpen,
  Shield,
  MessageCircle,
  MapPin,
  Globe,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { t } = useTranslation();

  const features = [
    { key: "timeline", icon: Clock, to: "/timeline", gradient: "from-saffron to-orange-400" },
    { key: "guide", icon: BookOpen, to: "/guide", gradient: "from-violet-500 to-purple-600" },
    { key: "myths", icon: Shield, to: "/myths", gradient: "from-rose-500 to-pink-600" },
    { key: "chat", icon: MessageCircle, to: "/chat", gradient: "from-sky-500 to-cyan-500" },
    { key: "booth", icon: MapPin, to: "/booth", gradient: "from-trigreen to-emerald-500" },
    { key: "multilingual", icon: Globe, to: "#", gradient: "from-amber-500 to-yellow-500" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-saffron/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/3 w-64 h-64 bg-trigreen/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-10 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Sparkles className="w-4 h-4" />
              Interactive Election Education Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              <span className="gradient-text">{t("hero.title")}</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed px-2">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/guide"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-primary to-violet-600 text-white font-semibold text-base sm:text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
              >
                {t("hero.cta")}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/chat"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-card border border-border text-foreground font-semibold text-base sm:text-lg hover:bg-muted hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                {t("hero.cta2")}
              </Link>
            </div>
          </motion.div>

          {/* Decorative tri-color bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 sm:mt-16 max-w-md mx-auto h-1.5 rounded-full overflow-hidden flex"
          >
            <div className="flex-1 bg-saffron" />
            <div className="flex-1 bg-white dark:bg-gray-300" />
            <div className="flex-1 bg-trigreen" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.key} variants={item}>
                <Link
                  to={f.to}
                  className="group block p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {t(`features.${f.key}`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`features.${f.key}Desc`)}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6"
        >
          {[
            { value: "950M+", label: "Eligible Voters" },
            { value: "10L+", label: "Polling Stations" },
            { value: "543", label: "Lok Sabha Seats" },
            { value: "28+8", label: "States & UTs" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-4 sm:p-6 rounded-2xl bg-card border border-border/60"
            >
              <div className="text-2xl sm:text-3xl font-extrabold gradient-text mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
