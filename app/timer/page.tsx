// app/timer/page.tsx
import IceBathTimer from "@/components/ice-bath-timer";
import LayoutWrapper from "@/components/layout-wrapper";

export const metadata = {
  title: "Timer | ISBAD",
};

export default function TimerPage() {
  return (
    <LayoutWrapper>
      <main className="min-h-[calc(100vh-140px)] bg-[#242422] flex items-center justify-center p-4">
        <IceBathTimer />
      </main>
    </LayoutWrapper>
  );
}
