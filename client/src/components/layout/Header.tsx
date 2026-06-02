"use client";

import styled from "styled-components";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeaderContainer = styled.header`
  height: ${({ theme }) => theme.header.height};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  position: sticky;
  top: 0;
  z-index: 40;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  width: 280px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export function Header() {
  return (
    <HeaderContainer>
      <PageTitle>Full Flow Test</PageTitle>
      <SearchBar>
        <Search size={16} />
        <span>Search...</span>
      </SearchBar>
      <Actions>
        <Button variant="ghost" size="icon">
          <Bell size={18} />
        </Button>
        <Button variant="ghost" size="icon">
          <User size={18} />
        </Button>
      </Actions>
    </HeaderContainer>
  );
}
