import React from "react";
import ReportsTab from "@/components/analytics/ReportsTab";

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Generate detailed reports and export data
          </p>
        </div>
      </div>

      <ReportsTab />
    </div>
  );
};

export default Reports;
