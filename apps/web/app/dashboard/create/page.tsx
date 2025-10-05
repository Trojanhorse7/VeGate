import { CreateBillForm } from '@/components/bills/CreateBillForm';

export default function CreateBillPage() {
  return (
    <div className="container max-w-2xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Payment Bill</h1>
        <p className="text-muted-foreground">
          Generate a QR code for instant gasless payments
        </p>
      </div>
      <CreateBillForm />
    </div>
  );
}
