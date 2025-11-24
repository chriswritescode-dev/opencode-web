import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { useSettingsDialog } from "@/hooks/useSettingsDialog";
import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  backTo?: string;
  action?: ReactNode;
}

export function Header({ title, backTo, action }: HeaderProps) {
  const { open: openSettings } = useSettingsDialog();

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-b from-background via-background to-background border-b border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {backTo && <BackButton to={backTo} />}
            <h1 className="text-xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent truncate">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {action && <div>{action}</div>}
            <Button
              variant="ghost"
              size="icon"
              onClick={openSettings}
              className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
            >
              <Settings className="w-10 h-10" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
