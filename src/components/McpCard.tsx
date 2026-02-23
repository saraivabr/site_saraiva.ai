import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Monitor, CheckCircle, Zap, ExternalLink } from "lucide-react";
import type { McpServer } from "@/hooks/useMcpServers";
import { formatUsageCount } from "@/hooks/useMcpServers";

const deployIcons = {
  remote: { icon: Globe, label: "Remote" },
  local: { icon: Monitor, label: "Local" },
  both: { icon: Zap, label: "Remote & Local" },
};

interface McpCardProps {
  server: McpServer;
  index: number;
}

const McpCard = ({ server, index }: McpCardProps) => {
  const deploy = deployIcons[server.deploy_type];
  const DeployIcon = deploy.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link
        to={`/mcps/${server.slug}`}
        className="group block p-5 rounded-xl border border-border card-hover bg-card shadow-sm"
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0 overflow-hidden">
            {server.icon_url ? (
              <img src={server.icon_url} alt={server.name} className="w-6 h-6 object-contain" />
            ) : (
              <span className="text-lg font-bold text-primary">{server.name.charAt(0)}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {server.name}
              </h3>
              {server.verified && (
                <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
              )}
            </div>

            {server.author && (
              <p className="text-xs text-muted-foreground mono mb-2">{server.author}</p>
            )}

            {server.description && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                {server.description}
              </p>
            )}

            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 mono px-2 py-0.5 rounded-md bg-secondary">
                <DeployIcon className="w-3 h-3" />
                {deploy.label}
              </span>
              <span className="inline-flex items-center gap-1 mono">
                <Zap className="w-3 h-3" />
                {formatUsageCount(server.usage_count)}
              </span>
              {server.featured && (
                <span className="text-primary font-semibold tracking-wider uppercase">
                  ★ Featured
                </span>
              )}
            </div>
          </div>

          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
        </div>
      </Link>
    </motion.div>
  );
};

export default McpCard;
