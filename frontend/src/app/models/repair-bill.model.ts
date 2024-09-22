// src/app/models/repair-bill.model.ts

export interface RepairBill {
    id: number;
    so_number: string;
    customer_name: string;
    model_number: string;
    serial_number: string;
    rma_number: string;
    status: 'pending' | 'processed' | 'failed' | 'completed';
    failure_reason?: string; // Optional
    ticket_number: string;
    notes: string;
  }
  