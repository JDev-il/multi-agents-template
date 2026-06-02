"use client";

import styled from "styled-components";
import {
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  FileText,
  HelpCircle,
} from "lucide-react";

const SidebarContainer = styled.aside`
  width: ${({ theme }) => theme.sidebar.width};
  height: 100vh;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  overflow-y: auto;
  flex-shrink: 0;
`;

const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Nav = styled.nav`
  padding: ${({ theme }) => theme.spacing.md};
  flex: 1;
`;

const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const NavSectionTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const NavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
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

const SidebarFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const mainNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Users" },
  { icon: FileText, label: "Reports" },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help" },
];

export function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo>
          <LayoutDashboard size={22} />
          AppName
        </Logo>
      </SidebarHeader>
      <Nav>
        <NavSection>
          <NavSectionTitle>Main</NavSectionTitle>
          {mainNavItems.map(({ icon: Icon, label, active }) => (
            <NavItem key={label} $active={active}>
              <Icon size={18} />
              {label}
            </NavItem>
          ))}
        </NavSection>
      </Nav>
      <SidebarFooter>
        {bottomNavItems.map(({ icon: Icon, label }) => (
          <NavItem key={label}>
            <Icon size={18} />
            {label}
          </NavItem>
        ))}
      </SidebarFooter>
    </SidebarContainer>
  );
}
