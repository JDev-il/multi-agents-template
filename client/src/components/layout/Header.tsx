"use client";

import styled from "styled-components";
import {
  Bell,
  Search,
  User,
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const HeaderContainer = styled.header`
  height: ${({ theme }) => theme.header.height};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: 0 ${({ theme }) => theme.spacing.xl};
  position: sticky;
  top: 0;
  z-index: 40;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
`;

const NavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text.secondary};
  background: ${({ theme, $active }) =>
    $active ? `${theme.colors.primary}15` : "transparent"};
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme, $active }) =>
      $active
        ? `${theme.colors.primary}20`
        : theme.colors.backgroundSecondary};
    color: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.text.primary};
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  width: 220px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  flex-shrink: 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
`;

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Users" },
  { icon: FileText, label: "Reports" },
];

export function Header() {
  return (
    <HeaderContainer>
      <Brand>
        <LayoutDashboard size={20} />
        AppName
      </Brand>
      <Nav>
        {navItems.map(({ icon: Icon, label, active }) => (
          <NavItem key={label} $active={active}>
            <Icon size={16} />
            {label}
          </NavItem>
        ))}
      </Nav>
      <SearchBar>
        <Search size={16} />
        <span>Search...</span>
      </SearchBar>
      <Actions>
        <Button variant="ghost" size="icon">
          <Bell size={18} />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings size={18} />
        </Button>
        <Button variant="ghost" size="icon">
          <User size={18} />
        </Button>
      </Actions>
    </HeaderContainer>
  );
}
