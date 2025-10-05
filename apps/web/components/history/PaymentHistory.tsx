"use client";

import { useState } from "react";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, RefreshCw } from "lucide-react";
import { formatB3TR } from "@vegate/sdk";
import { exportToCSV } from "@vegate/sdk";
import { toast } from "sonner";

export function PaymentHistory() {
  const [filters, setFilters] = useState({
    status: "all" as "all" | "paid" | "unpaid",
    category: "",
    socialImpact: undefined as boolean | undefined,
  });

  const { history, isLoading, refresh } = usePaymentHistory(filters);

  const handleExport = () => {
    const csv = exportToCSV(history);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vegate-history-${Date.now()}.csv`;
    a.click();
    toast.success("History exported successfully");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payment History</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Select
            value={filters.status}
            onValueChange={(value: any) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({ ...filters, category: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="Donation">Donation</SelectItem>
              <SelectItem value="Subscription">Subscription</SelectItem>
              <SelectItem value="E-commerce">E-commerce</SelectItem>
              <SelectItem value="Utility">Utility</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.socialImpact === undefined ? "" : String(filters.socialImpact)}
            onValueChange={(value) =>
              setFilters({
                ...filters,
                socialImpact: value === "" ? undefined : value === "true",
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Impact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="true">Social Impact</SelectItem>
              <SelectItem value="false">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No payment history found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>B3TR Reward</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.billId}>
                  <TableCell className="font-mono text-sm">
                    {item.billId.slice(0, 8)}...
                  </TableCell>
                  <TableCell>{item.amount} VTHO</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.category}
                      {item.socialImpact && (
                        <Badge variant="secondary" className="text-xs">
                          2x
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.paid ? (
                      <Badge variant="success">Paid</Badge>
                    ) : (
                      <Badge variant="outline">Unpaid</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-primary font-semibold">
                    {formatB3TR(item.b3trReward)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.createdAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
