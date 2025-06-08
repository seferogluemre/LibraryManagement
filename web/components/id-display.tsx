import { Button } from "#components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "#components/ui/hover-card";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface IdDisplayProps {
  id: string;
  className?: string;
}

export function IdDisplay({ id, className }: IdDisplayProps) {
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>
        <div className={className}>
          <span className="font-mono text-xs">
            {id.slice(0, 4)}...{id.slice(-4)}
          </span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">ID</h4>
            <p className="font-mono text-sm">{id}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
