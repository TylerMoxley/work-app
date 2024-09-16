import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RepairBill } from '../repair-bill.service';

@Component({
  selector: 'app-repair-table',
  templateUrl: './repair-table.component.html',
  styleUrls: ['./repair-table.component.css']
})
export class RepairTableComponent {
  @Input() bills: RepairBill[] = [];
  @Output() editBill = new EventEmitter<RepairBill>();

  // Add the onEdit method
  onEdit(bill: RepairBill): void {
    this.editBill.emit(bill);
  }
}
