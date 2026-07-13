import { PageHeader } from "@/components/layout/page-header";
import { AiChatPanel } from "@/components/features/ai-chat-panel";
import { MetricCard } from "@/components/features/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getEmergencySnapshot } from "@/lib/domain/operations";
import { Siren, Shield, AlertTriangle, Radio } from "lucide-react";

export const metadata = {
  title: "Emergency Center",
};

export default function EmergencyPage() {
  const { incidents, open, critical } = getEmergencySnapshot();

  return (
    <div>
      <PageHeader
        title="Emergency Command Center"
        description="AI-powered crisis response, incident management, and real-time coordination"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Open Incidents" value={open.length} subtitle="Requiring action" icon={<AlertTriangle />} />
        <MetricCard title="Critical Alerts" value={critical.length} subtitle="High priority" icon={<Siren />} />
        <MetricCard title="Response Teams" value="6" subtitle="Deployed" icon={<Shield />} />
        <MetricCard title="Comms Status" value="Online" subtitle="All channels active" icon={<Radio />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="glass border-destructive/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Siren className="h-4 w-4 text-destructive" aria-hidden="true" />
              Active Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3" role="list">
              {incidents.map((inc) => (
                <li key={inc.id} className="rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{inc.type}</span>
                    <div className="flex gap-2">
                      <StatusBadge status={inc.severity} />
                      <StatusBadge status={inc.status} />
                    </div>
                  </div>
                  <p className="mt-1 text-sm">{inc.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{inc.location}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">AI Emergency Response Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { step: 1, action: "Deploy security team to North Parking Lot — unauthorized vehicle" },
              { step: 2, action: "Open Gate B auxiliary lanes to relieve South Stand congestion" },
              { step: 3, action: "Alert medical team — heat exhaustion case resolved, monitor East Concourse" },
              { step: 4, action: "Notify fans via app: redirect Gate E traffic to Gate C" },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 rounded-lg bg-destructive/5 border border-destructive/20 px-4 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/20 text-xs font-bold text-destructive">
                  {item.step}
                </span>
                <p className="text-sm">{item.action}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <AiChatPanel
          assistantType="operations"
          title="Emergency Operations AI"
          suggestions={[
            "Generate emergency response plan",
            "Summarize all active incidents",
            "Recommend resource deployment",
          ]}
        />
      </div>
    </div>
  );
}
