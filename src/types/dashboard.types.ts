export interface DashboardSummaryResponse {
  period: {
    month: number;
    year: number;
  };
  totalBalance: number; // Total saldo kas keseluruhan (All-Time IN - OUT)
  currentMonthIncome: number; // Total pemasukan pada bulan tersebut
  currentMonthExpense: number; // Total pengeluaran pada bulan tersebut
  netMonth: number; // Selisih bersih bulan tersebut (Income - Expense)
}
