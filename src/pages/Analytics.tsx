import React from "react";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor engagement and track key performance indicators
          </p>
        </div>
      </div>

      <AnalyticsDashboard />
    </div>
  );
}
