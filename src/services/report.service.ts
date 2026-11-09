import { prisma } from "../lib/prisma";
import {
  FridayReportQueryParams,
  MonthlyReportQueryParams,
} from "../schemas/report.schema";
import {
  FridayReportResponse,
  MonthlyReportResponse,
  CategorySummary,
  TransactionItem,
} from "../types/report.types";
import { KasCategory } from "@prisma/client";

export class ReportService {
  static async getFridayReport(
    query: FridayReportQueryParams,
  ): Promise<FridayReportResponse> {
    const targetDate = new Date(query.date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Ambil seluruh transaksi pada tanggal spesifik tersebut
    const transactions = await prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { transactionDate: "desc" },
    });

    const formattedTransactions: TransactionItem[] = transactions.map((tx) => ({
      ...tx,
      amount: tx.amount.toNumber(),
    }));

    // Hitung total koleksi khusus pemasukan (IN) di hari tersebut
    const totalFridayCollection = formattedTransactions
      .filter((tx) => tx.type === "IN")
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      date: query.date,
      totalFridayCollection,
      transactions: formattedTransactions,
    };
  }

  static async getMonthlyReport(
    query: MonthlyReportQueryParams,
  ): Promise<MonthlyReportResponse> {
    const { month, year } = query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const transactions = await prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { transactionDate: "asc" },
    });

    const formattedTransactions: TransactionItem[] = transactions.map((tx) => ({
      ...tx,
      amount: tx.amount.toNumber(),
    }));

    // Daftar seluruh kategori kas yang tersedia
    const categories: KasCategory[] = [
      "OPERASIONAL",
      "JUMAT",
      "PEMBANGUNAN",
      "EVENT",
      "ZAKAT_MAL",
    ];

    let grandTotalIncome = 0;
    let grandTotalExpense = 0;

    const summaryByCategory: CategorySummary[] = categories.map((cat) => {
      const catTransactions = formattedTransactions.filter(
        (tx) => tx.category === cat,
      );

      const totalIn = catTransactions
        .filter((tx) => tx.type === "IN")
        .reduce((sum, tx) => sum + tx.amount, 0);

      const totalOut = catTransactions
        .filter((tx) => tx.type === "OUT")
        .reduce((sum, tx) => sum + tx.amount, 0);

      grandTotalIncome += totalIn;
      grandTotalExpense += totalOut;

      return {
        category: cat,
        totalIn,
        totalOut,
        net: totalIn - totalOut,
      };
    });

    return {
      period: { month, year },
      summaryByCategory,
      grandTotalIncome,
      grandTotalExpense,
      netBalanceMonth: grandTotalIncome - grandTotalExpense,
      transactions: formattedTransactions,
    };
  }
}
