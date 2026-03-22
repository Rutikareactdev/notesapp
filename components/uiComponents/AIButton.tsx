import { Sparkles, Wand2, Tags, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type AIFeature = "summary" | "improve" | "tags";

interface AIButtonProps {
  feature: AIFeature;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  size?: "sm" | "default";
}

const featureConfig = {
  summary: {
    icon: Sparkles,
    label: "AI Summary",
    description: "Generate a summary of this note",
    className: "hover:bg-ai-summary/10 hover:text-ai-summary hover:border-ai-summary/30",
    activeClassName: "bg-ai-summary/10 text-ai-summary border-ai-summary/30",
  },
  improve: {
    icon: Wand2,
    label: "AI Improve",
    description: "Improve grammar and clarity",
    className: "hover:bg-ai-improve/10 hover:text-ai-improve hover:border-ai-improve/30",
    activeClassName: "bg-ai-improve/10 text-ai-improve border-ai-improve/30",
  },
  tags: {
    icon: Tags,
    label: "AI Tags",
    description: "Auto-generate relevant tags",
    className: "hover:bg-ai-tags/10 hover:text-ai-tags hover:border-ai-tags/30",
    activeClassName: "bg-ai-tags/10 text-ai-tags border-ai-tags/30",
  },
};

export function AIButton({
  feature,
  onClick,
  isLoading = false,
  disabled = false,
  size = "default",
}: AIButtonProps) {
  const config = featureConfig[feature];
  const Icon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size={size === "sm" ? "sm" : "default"}
          onClick={onClick}
          disabled={disabled || isLoading}
          className={cn(
            "gap-2 transition-all duration-200 border",
            config.className,
            isLoading && config.activeClassName
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Icon className="h-4 w-4" />
          )}
          {size !== "sm" && config.label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{config.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
