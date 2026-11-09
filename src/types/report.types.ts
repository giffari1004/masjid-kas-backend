import { TransactionType, KasCategory } from "@prisma/client";

export interface TransactionItem {
  id: string;
  type: TransactionType;
  category: KasCategory;
  source: string | null;
  amount: number;
  donorName: string | null;
  description: string | null;
  receiptUrl: string | null;
  transactionDate: Date;
}

export interface FridayReportResponse {
  date: string;
  totalFridayCollection: number;
  transactions: TransactionItem[];
}

export interface CategorySummary {
  category: KasCategory;
  totalIn: number;
  totalOut: number;
  net: number;
}

export interface MonthlyReportResponse {
  period: {
    month: number;
    year: number;
  };
  summaryByCategory: CategorySummary[];
  grandTotalIncome: number;
  grandTotalExpense: number;
  netBalanceMonth: number;
  transactions: TransactionItem[];
}
