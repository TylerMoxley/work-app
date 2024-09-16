import { Component, OnInit } from '@angular/core';
import { RepairBill, RepairBillService } from '../repair-bill.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pendingBills: RepairBill[] = [];
  completedBills: RepairBill[] = [];
  processedBills: RepairBill[] = [];
  failedBills: RepairBill[] = [];

  filteredPendingBills: RepairBill[] = [];
  filteredFailedBills: RepairBill[] = [];
  filteredProcessedBills: RepairBill[] = [];
  filteredCompletedBills: RepairBill[] = [];

  searchTerm: string = '';  // For the search bar

  newBill: RepairBill = {
    id: 0,
    so_number: '',
    customer_name: '',
    model_number: '',
    serial_number: '',
    rma_number: '',
    status: 'pending',
    failure_reason: '',
    ticket_number: '',
    notes: ''
  };

  editBill: RepairBill | null = null;
  isEditModalOpen: boolean = false;
  isModalOpen: boolean = false;
  activeTab: string = 'pending';

  constructor(private repairBillService: RepairBillService) {}

  ngOnInit(): void {
    this.loadPendingBills();
    this.loadCompletedBills();
    this.loadProcessedBills();
    this.loadFailedBills();
  }

  // Load pending bills
  loadPendingBills(): void {
    this.repairBillService.getBillsByStatus('pending').subscribe((data: RepairBill[]) => {
      this.pendingBills = data;
      console.log('Pending Bills:', this.pendingBills);
      this.filterBills();  // Call filter after loading
    });
  }

  // Load completed bills
  loadCompletedBills(): void {
    this.repairBillService.getBillsByStatus('completed').subscribe((data: RepairBill[]) => {
      this.completedBills = data;
      this.filterBills();  // Call filter after loading
    });
  }

  // Load processed bills
  loadProcessedBills(): void {
    this.repairBillService.getBillsByStatus('processed').subscribe((data: RepairBill[]) => {
      this.processedBills = data;
      this.filterBills();  // Call filter after loading
    });
  }

  // Load failed bills
  loadFailedBills(): void {
    this.repairBillService.getBillsByStatus('failed').subscribe((data: RepairBill[]) => {
      this.failedBills = data;
      this.filterBills();  // Call filter after loading
    });
  }

  // Filter bills globally based on search term
  filterBills(): void {
    const search = this.searchTerm.toLowerCase();

    if (search.length > 0) {
      // Filter each stage separately based on search term
      this.filteredPendingBills = this.pendingBills.filter(bill =>
        bill.so_number.toLowerCase().includes(search) || bill.rma_number.toLowerCase().includes(search)
      );

      this.filteredFailedBills = this.failedBills.filter(bill =>
        bill.so_number.toLowerCase().includes(search) || bill.rma_number.toLowerCase().includes(search)
      );

      this.filteredProcessedBills = this.processedBills.filter(bill =>
        bill.so_number.toLowerCase().includes(search) || bill.rma_number.toLowerCase().includes(search)
      );

      this.filteredCompletedBills = this.completedBills.filter(bill =>
        bill.so_number.toLowerCase().includes(search) || bill.rma_number.toLowerCase().includes(search)
      );
      console.log('Filtered Pending Bills:', this.filteredPendingBills);
    } else {
      // If search term is cleared, reset filtered lists
      this.resetFilteredBills();
    }
  }

  // Reset the filtered lists to show all bills when search term is cleared
  resetFilteredBills(): void {
    this.filteredPendingBills = [...this.pendingBills];
    this.filteredFailedBills = [...this.failedBills];
    this.filteredProcessedBills = [...this.processedBills];
    this.filteredCompletedBills = [...this.completedBills];
  }

  // Get the filtered bills for the active tab
  getFilteredBillsForTab(tab: string): RepairBill[] {
    if (tab === 'pending') {
      return this.filteredPendingBills;
    } else if (tab === 'failed') {
      return this.filteredFailedBills;
    } else if (tab === 'processed') {
      return this.filteredProcessedBills;
    } else if (tab === 'completed') {
      return this.filteredCompletedBills;
    }
    return [];
  }

  // Set the active tab and reset filtered bills if needed
  setActiveTab(tab: string): void {
    this.activeTab = tab;

    // If there's no search term, reset the filtered lists to show all bills for the new tab
    if (this.searchTerm.length === 0) {
      this.resetFilteredBills();
    }
  }

  // Add a new repair bill
  // Add a new repair bill
addBill(): void {
  this.repairBillService.createRepairBill(this.newBill).subscribe((bill: RepairBill) => {
    this.pendingBills.push(bill);
    this.filterBills();  // Ensure filtered lists are updated after adding a new bill
    this.newBill = {
      id: 0,
      so_number: '',
      customer_name: '',
      model_number: '',
      serial_number: '',
      rma_number: '',
      status: 'pending',
      failure_reason: '',
      ticket_number: '',
      notes: ''
    };
    this.closeModal();
  });
}


  // Open the modal to edit a bill
  openEditModal(bill: RepairBill): void {
    this.editBill = { ...bill };  // Make a copy of the bill to edit
    this.isEditModalOpen = true;
  }

  // Save changes to the edited bill
  saveEdit(): void {
    if (this.editBill) {
      this.repairBillService.updateBillStatus(this.editBill).subscribe(() => {
        // Remove the bill from its original list based on its id
        this.removeFromAllLists(this.editBill!.id);

        // Move the bill to the correct list based on the new status
        this.moveBillToCorrectList(this.editBill!);

        this.closeEditModal();
      });
    }
  }

  // Helper method to remove a bill from all lists based on id
  removeFromAllLists(id: number): void {
    this.pendingBills = this.pendingBills.filter(bill => bill.id !== id);
    this.completedBills = this.completedBills.filter(bill => bill.id !== id);
    this.processedBills = this.processedBills.filter(bill => bill.id !== id);
    this.failedBills = this.failedBills.filter(bill => bill.id !== id);
  }

  // Move the edited bill to the correct list based on status
  moveBillToCorrectList(bill: RepairBill): void {
    if (bill.status === 'completed') {
      this.completedBills.push(bill);
    } else if (bill.status === 'processed') {
      this.processedBills.push(bill);
    } else if (bill.status === 'failed') {
      this.failedBills.push(bill);
    } else {
      this.pendingBills.push(bill);
    }
  }

  // Delete the selected repair bill
  // Delete the selected repair bill
  deleteBill(): void {
    if (this.editBill) {
      const id = this.editBill.id;
      this.repairBillService.deleteRepairBill(id).subscribe({
        next: () => {
          this.removeFromAllLists(id);
          this.filterBills();  // Ensure filtered lists are updated after deleting a bill
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Error deleting bill:', err);
        }
      });
    }
  }


  // Modal-related methods:
  
  // Open modal for adding a new bill
  openModal(): void {
    this.isModalOpen = true;
  }

  // Close modal for adding a new bill
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Close modal for editing a bill
  closeEditModal(): void {
    this.editBill = null;  // Reset editBill to null when closing the modal
    this.isEditModalOpen = false;
  }
}








