import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface RepairBill {
  id: number;  // Ensure the id is mandatory
  so_number: string;
  customer_name: string;
  model_number: string;
  serial_number: string;
  rma_number: string;
  status: string;
  failure_reason?: string;
  notes?: string;
  dateCreated?: string;
  ticket_number?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RepairBillService {
  private apiUrl = `${environment.apiUrl}repair-bills/`;
  
  constructor(private http: HttpClient) {}

  // Method to delete a bill by ID
  deleteRepairBill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // Get bills by status (e.g., pending, completed, failed)
  getBillsByStatus(status: string): Observable<RepairBill[]> {
    return this.http.get<RepairBill[]>(`${this.apiUrl}?status=${status}`);
  }

  // Create a new repair bill
  createRepairBill(bill: RepairBill): Observable<RepairBill> {
    return this.http.post<RepairBill>(`${this.apiUrl}`, bill);
  }

  // Update the status (and possibly failure reason) of a repair bill
  updateBillStatus(bill: RepairBill): Observable<RepairBill> {
    return this.http.put<RepairBill>(`${this.apiUrl}${bill.id}/`, bill);  // Use id for update
  }
}

