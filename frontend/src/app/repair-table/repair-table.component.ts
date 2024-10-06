import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-repair-table',
  templateUrl: './repair-table.component.html',
  styleUrls: ['./repair-table.component.css']
})
export class RepairTableComponent {
  @Input() bills: any[] = []; // Revert to simpler array of any
  @Output() editBill = new EventEmitter<any>();
  @Output() showDetails = new EventEmitter<any>();

  // Edit event handler
  onEdit(bill: any): void {
    this.editBill.emit(bill);
  }

  // Row click handler
  //Don't think this is used, was from when I tried to add a clickable row
  onRowClick(bill: any): void {
    this.showDetails.emit(bill);
  }
}
