import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardPage } from "@/features/dashboard/DashboardPage";

export default function Home() {
  return (
    <MainLayout>
      <DashboardPage />
    </MainLayout>
  );
}
