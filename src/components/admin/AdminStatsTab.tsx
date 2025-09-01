'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Users, Home, UserCheck, Eye, Heart, MessageSquare } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalItems: number;
  totalInquiries: number;
  recentUserGrowth: number;
  recentItemGrowth: number;
  usersByRole: {
    USER: number;
    ADMIN: number;
  };
  itemsByAvailability: {
    available: number;
    unavailable: number;
  };
}

export function AdminStatsTab() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  if (!stats) {
    return <div>No statistics available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +{stats.recentUserGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +{stats.recentItemGrowth}% from last month
            </p>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInquiries}</div>
            <p className="text-xs text-muted-foreground">
              Customer inquiries received
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
            <CardDescription>
              Distribution of users across different roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>Regular Users</span>
                </div>
                <span className="font-medium">{stats.usersByRole.USER}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-red-500" />
                  <span>Administrators</span>
                </div>
                <span className="font-medium">{stats.usersByRole.ADMIN}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items by Status</CardTitle>
            <CardDescription>
              Available vs unavailable items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span>Available Items</span>
                </div>
                <span className="font-medium">{stats.itemsByAvailability.available}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-500" />
                  <span>Unavailable Items</span>
                </div>
                <span className="font-medium">{stats.itemsByAvailability.unavailable}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Total Items</span>
                  <span>{stats.totalItems}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Overview</CardTitle>
          <CardDescription>
            Key metrics and platform health indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {((stats.usersByRole.ADMIN / stats.totalUsers) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Admin Ratio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {((stats.itemsByAvailability.available / stats.totalItems) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Available Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(stats.totalInquiries / stats.totalItems).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Inquiries/Property</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}