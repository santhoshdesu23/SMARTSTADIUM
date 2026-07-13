import { PageHeader } from "@/components/layout/page-header";
import { AiChatPanel } from "@/components/features/ai-chat-panel";
import { MetricCard } from "@/components/features/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getVolunteerSnapshot } from "@/lib/domain/operations";
import { HeartHandshake, Users, CheckCircle, Clock } from "lucide-react";

export const metadata = {
  title: "Volunteer Portal",
};

export default function VolunteerPage() {
  const { volunteerAssignments, active, completed } = getVolunteerSnapshot();

  return (
    <div>
      <PageHeader
        title="Volunteer Portal"
        description="AI-coordinated volunteer assignments and shift management"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Active Volunteers" value={active} subtitle="On duty now" icon={<Users />} />
        <MetricCard title="Total Assigned" value={volunteerAssignments.length} subtitle="This match day" icon={<HeartHandshake />} />
        <MetricCard title="Tasks Completed" value={completed} subtitle="Today" icon={<CheckCircle />} trend="up" trendValue="+3 vs yesterday" />
        <MetricCard title="Avg Shift" value="6 hrs" subtitle="Standard duration" icon={<Clock />} />
      </div>

      <div className="mt-8">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Current Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Current volunteer assignments">
                <caption className="sr-only">Current volunteer assignments table</caption>
                <thead>
                  <tr className="border-b border-border/50 text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium" scope="col">Volunteer</th>
                    <th className="pb-3 pr-4 font-medium" scope="col">Zone</th>
                    <th className="pb-3 pr-4 font-medium" scope="col">Task</th>
                    <th className="pb-3 pr-4 font-medium" scope="col">Shift</th>
                    <th className="pb-3 font-medium" scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteerAssignments.map((v) => (
                    <tr key={v.id} className="border-b border-border/30">
                      <td className="py-3 pr-4">
                        <p className="font-medium">{v.name}</p>
                        <p className="text-xs text-muted-foreground">{v.volunteerId}</p>
                      </td>
                      <td className="py-3 pr-4">{v.zone}</td>
                      <td className="py-3 pr-4">{v.task}</td>
                      <td className="py-3 pr-4">{v.shift}</td>
                      <td className="py-3"><StatusBadge status={v.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <AiChatPanel
          assistantType="operations"
          title="Volunteer Coordination AI"
          suggestions={[
            "Suggest volunteer reassignments",
            "Summarize shift coverage",
            "Which zones need more staff?",
          ]}
        />
      </div>
    </div>
  );
}
