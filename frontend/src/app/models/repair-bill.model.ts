// src/app/models/repair-bill.model.ts
//Can maybe delete this code; I think it's from an old version of the app that I didn't end up using
export interface RepairBill {
    id: number;
    so_number: string;
    customer_name: string;
    model_number: string;
    serial_number: string;
    rma_number: string;
    status: 'pending' | 'processed' | 'failed' | 'completed';
    failure_reason?: string;  // Optional field for failure reason
    ticket_number: string;
    notes: string;  // Notes field
    dateCreated?: string;
    updated_at?: string;  // Add this field
  }