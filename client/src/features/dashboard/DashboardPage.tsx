"use client";

import styled from "styled-components";
import { Users, Activity, DollarSign, ShoppingCart } from "lucide-react";
import { StatsCard } from "./StatsCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActivityItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActivityDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const ActivityText = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ActivityTime = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-top: 2px;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) =>
    theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TableCellMuted = styled(TableCell)`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TableHeader = styled.th`
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const statsData = [
  {
    title: "Total Users",
    value: "12,847",
    change: 12.5,
    changeLabel: "vs last month",
    icon: <Users size={20} />,
  },
  {
    title: "Active Sessions",
    value: "3,291",
    change: 8.2,
    changeLabel: "vs last week",
    icon: <Activity size={20} />,
  },
  {
    title: "Revenue",
    value: "$48,320",
    change: -2.1,
    changeLabel: "vs last month",
    icon: <DollarSign size={20} />,
  },
  {
    title: "Orders",
    value: "1,429",
    change: 5.7,
    changeLabel: "vs last month",
    icon: <ShoppingCart size={20} />,
  },
];

const recentActivity = [
  {
    title: "New user registered",
    time: "2 minutes ago",
    color: "#22c55e",
  },
  {
    title: "Order #4821 completed",
    time: "15 minutes ago",
    color: "#3b82f6",
  },
  {
    title: "Payment failed for order #4820",
    time: "32 minutes ago",
    color: "#ef4444",
  },
  {
    title: "New report generated",
    time: "1 hour ago",
    color: "#f59e0b",
  },
  {
    title: "System maintenance scheduled",
    time: "2 hours ago",
    color: "#64748b",
  },
];

const recentUsers = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "active",
    joined: "Jun 2, 2026",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    status: "active",
    joined: "Jun 1, 2026",
  },
  {
    name: "Carol White",
    email: "carol@example.com",
    status: "inactive",
    joined: "May 30, 2026",
  },
  {
    name: "David Lee",
    email: "david@example.com",
    status: "active",
    joined: "May 29, 2026",
  },
];

export function DashboardPage() {
  return (
    <div>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
        <PageSubtitle>Welcome back! Here is what is happening today.</PageSubtitle>
      </PageHeader>

      <StatsGrid>
        {statsData.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </StatsGrid>

      <ContentGrid>
        <Card>
          <CardHeader>
            <CardActions>
              <div>
                <CardTitle className="text-lg">Recent Users</CardTitle>
                <CardDescription>Latest registered accounts</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View all
              </Button>
            </CardActions>
          </CardHeader>
          <CardContent>
            <StyledTable>
              <thead>
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Joined</TableHeader>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>{user.name}</TableCell>
                    <TableCellMuted>{user.email}</TableCellMuted>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "success" : "secondary"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCellMuted>{user.joined}</TableCellMuted>
                  </TableRow>
                ))}
              </tbody>
            </StyledTable>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityList>
              {recentActivity.map((item) => (
                <ActivityItem key={item.title}>
                  <ActivityDot $color={item.color} />
                  <ActivityText>
                    <ActivityTitle>{item.title}</ActivityTitle>
                    <ActivityTime>{item.time}</ActivityTime>
                  </ActivityText>
                </ActivityItem>
              ))}
            </ActivityList>
          </CardContent>
        </Card>
      </ContentGrid>
    </div>
  );
}
