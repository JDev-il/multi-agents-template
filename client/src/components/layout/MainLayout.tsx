"use client";

import styled from "styled-components";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const LayoutRoot = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.backgroundSecondary};
`;

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutRoot>
      <Sidebar />
      <ContentArea>
        <Header />
        <Main>{children}</Main>
      </ContentArea>
    </LayoutRoot>
  );
}
