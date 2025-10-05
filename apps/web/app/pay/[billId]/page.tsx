import { PaymentPage } from "@/components/payment/PaymentPage";

export default function PayBillPage({ params }: { params: { billId: string } }) {
  return <PaymentPage billId={params.billId} />;
}
