"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Package, DollarSign } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1% from last month",
      icon: DollarSign,
    },
    {
      title: "Subscriptions",
      value: "+2350",
      change: "+180.1% from last month",
      icon: Users,
    },
    {
      title: "Products",
      value: "+12,234",
      change: "+19% from last month",
      icon: Package,
    },
    {
      title: "Active Users",
      value: "+573",
      change: "+201 since last hour",
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Here`s what`s happening with your business today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              System Status
              <Badge variant="outline" className="text-green-600">
                All Systems Operational
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>API Status</span>
                <Badge variant="outline" className="text-green-600">
                  Online
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Database</span>
                <Badge variant="outline" className="text-green-600">
                  Connected
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Payment Gateway</span>
                <Badge variant="outline" className="text-green-600">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Total Categories</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Products</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Users</span>
                <span className="font-medium">573</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
