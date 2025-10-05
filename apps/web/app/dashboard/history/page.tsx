import { PaymentHistory } from "@/components/history/PaymentHistory";
import { RewardsSummary } from "@/components/history/RewardsSummary";

export default function HistoryPage() {
  return (
    <div className="container mx-auto py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your payments and B3TR rewards
        </p>
      </div>
      <RewardsSummary />
      <PaymentHistory />
    </div>
  );
}
