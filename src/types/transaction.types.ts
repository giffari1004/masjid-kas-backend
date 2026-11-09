import { TransactionType, KasCategory } from "@prisma/client";

export interface TransactionResponse {
  id: string;
  type: TransactionType;
  category: KasCategory;
  source: string | null;
  amount: number;
  donorName: string | null;
  description: string | null;
  receiptUrl: string | null;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedTransactionsResponse {
  data: TransactionResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
