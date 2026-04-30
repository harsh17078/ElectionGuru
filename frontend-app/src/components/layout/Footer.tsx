import { useTranslation } from "react-i18next";
import { Vote } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron via-primary to-trigreen flex items-center justify-center">
              <Vote className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">
              Election<span className="text-primary">Guru</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center">{t("footer.tagline")}</p>
          <p className="text-xs text-muted-foreground">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
