import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AdminAgentsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agents Management</CardTitle>
        <CardDescription>Manage agents and their permissions</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add agent management functionality here */}
        <p>Agent management functionality coming soon...</p>
      </CardContent>
    </Card>
  );
}