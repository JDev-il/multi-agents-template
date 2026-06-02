"use client";

import styled from "styled-components";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
}

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => `${theme.colors.primary}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const ValueText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const TitleText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ChangeRow = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, $positive }) =>
    $positive ? theme.colors.status.success : theme.colors.status.error};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ChangeLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon,
}: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <HeaderRow>
          <TitleText>{title}</TitleText>
          <IconWrapper>{icon}</IconWrapper>
        </HeaderRow>
      </CardHeader>
      <CardContent>
        <ValueText>{value}</ValueText>
        <ChangeRow $positive={isPositive}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {isPositive ? "+" : ""}
          {change}%
          <ChangeLabel>{changeLabel}</ChangeLabel>
        </ChangeRow>
      </CardContent>
    </Card>
  );
}
