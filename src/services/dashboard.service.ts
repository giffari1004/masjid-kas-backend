import { prisma } from "../lib/prisma";
import { DashboardQueryParams } from "../schemas/dashboard.schema";
import { DashboardSummaryResponse } from "../types/dashboard.types";

export class DashboardService {
  static async getSummary(
    query: DashboardQueryParams,
  ): Promise<DashboardSummaryResponse> {
    const now = new Date();
    const month = query.month !== undefined ? query.month : now.getMonth() + 1; // 1-12
    const year = query.year !== undefined ? query.year : now.getFullYear();

    // 1. Hitung total saldo keseluruhan (Semua Pemasukan - Semua Pengeluaran sepanjang masa)
    const [totalInAll, totalOutAll] = await Promise.all([
      prisma.transaction.aggregate({
        where: { type: "IN" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { type: "OUT" },
        _sum: { amount: true },
      }),
    ]);

    const totalInAllAmount = totalInAll._sum.amount?.toNumber() || 0;
    const totalOutAllAmount = totalOutAll._sum.amount?.toNumber() || 0;
    const totalBalance = totalInAllAmount - totalOutAllAmount;

    // 2. Tentukan rentang tanggal awal dan akhir bulan yang dipilih
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // 3. Hitung total pemasukan dan pengeluaran pada bulan tersebut
    const [totalInMonth, totalOutMonth] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          type: "IN",
          transactionDate: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          type: "OUT",
          transactionDate: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
    ]);

    const currentMonthIncome = totalInMonth._sum.amount?.toNumber() || 0;
    const currentMonthExpense = totalOutMonth._sum.amount?.toNumber() || 0;
    const netMonth = currentMonthIncome - currentMonthExpense;

    return {
      period: {
        month,
        year,
      },
      totalBalance,
      currentMonthIncome,
      currentMonthExpense,
      netMonth,
    };
  }
}
