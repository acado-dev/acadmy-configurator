import React from "react";
import InterestedUsersTab from "@/components/analytics/InterestedUsersTab";

const InterestedUsers = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interested Users Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage users interested in your programs
          </p>
        </div>
      </div>

      <InterestedUsersTab />
    </div>
  );
};

export default InterestedUsers;
