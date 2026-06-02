"use client";

import styled from "styled-components";
import { Header } from "./Header";

const LayoutRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.backgroundSecondary};
`;

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutRoot>
      <Header />
      <Main>{children}</Main>
    </LayoutRoot>
  );
}
