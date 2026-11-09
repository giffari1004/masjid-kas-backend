import { prisma } from "../lib/prisma";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionQueryParams,
} from "../schemas/transaction.schema";
import {
  uploadFileToSupabase,
  deleteFileFromSupabase,
} from "../utils/supabaseStorage";
import {
  PaginatedTransactionsResponse,
  TransactionResponse,
} from "../types/transaction.types";
import { Prisma } from "@prisma/client";

export class TransactionService {
  static async create(
    data: CreateTransactionInput,
    file?: Express.Multer.File,
  ): Promise<TransactionResponse> {
    let receiptUrl: string | null = null;

    if (file) {
      receiptUrl = await uploadFileToSupabase(file);
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        category: data.category,
        source: data.source || null,
        amount: new Prisma.Decimal(data.amount),
        donorName: data.donorName || null,
        description: data.description || null,
        receiptUrl,
        transactionDate: data.transactionDate || new Date(),
      },
    });

    return {
      ...transaction,
      amount: transaction.amount.toNumber(),
    };
  }

  static async findAll(
    query: TransactionQueryParams,
  ): Promise<PaginatedTransactionsResponse> {
    const { type, category, startDate, endDate, page, limit } = query;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.TransactionWhereInput = {};

    if (type) whereClause.type = type;
    if (category) whereClause.category = category;

    if (startDate || endDate) {
      whereClause.transactionDate = {};
      if (startDate) whereClause.transactionDate.gte = startDate;
      if (endDate) whereClause.transactionDate.lte = endDate;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { transactionDate: "desc" },
      }),
      prisma.transaction.count({ where: whereClause }),
    ]);

    const formattedData: TransactionResponse[] = transactions.map((tx) => ({
      ...tx,
      amount: tx.amount.toNumber(),
    }));

    return {
      data: formattedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id: string): Promise<TransactionResponse> {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new Error("Transaksi tidak ditemukan.");
    }

    return {
      ...transaction,
      amount: transaction.amount.toNumber(),
    };
  }

  static async update(
    id: string,
    data: UpdateTransactionInput,
    file?: Express.Multer.File,
  ): Promise<TransactionResponse> {
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      throw new Error("Transaksi tidak ditemukan.");
    }

    let receiptUrl = existingTransaction.receiptUrl;

    if (file) {
      // Jika ada file baru di-upload, hapus file lama dari storage
      if (receiptUrl) {
        await deleteFileFromSupabase(receiptUrl);
      }
      receiptUrl = await uploadFileToSupabase(file);
    }

    // Gunakan conditional object spreading agar aman dengan exactOptionalPropertyTypes: true
    const updateData: Prisma.TransactionUpdateInput = {
      ...(data.type !== undefined && { type: data.type }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.source !== undefined && { source: data.source }),
      ...(data.amount !== undefined && {
        amount: new Prisma.Decimal(data.amount),
      }),
      ...(data.donorName !== undefined && { donorName: data.donorName }),
      ...(data.description !== undefined && { description: data.description }),
      ...(receiptUrl !== undefined && { receiptUrl }),
      ...(data.transactionDate !== undefined && {
        transactionDate: data.transactionDate,
      }),
    };

    const updated = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    return {
      ...updated,
      amount: updated.amount.toNumber(),
    };
  }

  static async delete(id: string): Promise<void> {
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      throw new Error("Transaksi tidak ditemukan.");
    }

    // Hapus file nota dari Supabase Storage jika ada
    if (existingTransaction.receiptUrl) {
      await deleteFileFromSupabase(existingTransaction.receiptUrl);
    }

    await prisma.transaction.delete({
      where: { id },
    });
  }
}
