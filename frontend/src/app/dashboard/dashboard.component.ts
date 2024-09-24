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
    model_number: 'GCQ',  // Default model number
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
      this.filterBills();  // Apply filters after loading
    });
  }

  // Load completed bills
  loadCompletedBills(): void {
    this.repairBillService.getBillsByStatus('completed').subscribe((data: RepairBill[]) => {
      this.completedBills = data;
      this.filterBills();  // Apply filters after loading
    });
  }

  // Load processed bills
  loadProcessedBills(): void {
    this.repairBillService.getBillsByStatus('processed').subscribe((data: RepairBill[]) => {
      this.processedBills = data;
      this.filterBills();  // Apply filters after loading
    });
  }

  // Load failed bills
  loadFailedBills(): void {
    this.repairBillService.getBillsByStatus('failed').subscribe((data: RepairBill[]) => {
      this.failedBills = data;
      this.filterBills();  // Apply filters after loading
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
    
    // Fetch bills only if the list is empty (optional, for optimization)
    if (tab === 'pending' && this.pendingBills.length === 0) {
      this.loadPendingBills();
    } else if (tab === 'completed' && this.completedBills.length === 0) {
      this.loadCompletedBills();
    } else if (tab === 'processed' && this.processedBills.length === 0) {
      this.loadProcessedBills();
    } else if (tab === 'failed' && this.failedBills.length === 0) {
      this.loadFailedBills();
    }
  }
  

  // Add a new repair bill
  addBill(): void {
    // Ensure failure_reason is cleared if status is not 'failed'
    if (this.newBill.status !== 'failed') {
      this.newBill.failure_reason = ''; // Clear failure reason if status is not failed
    }
  
    // Log the newBill object to ensure it's correctly populated
    console.log("New Bill Data:", this.newBill);
  
    // Send the bill data to the server
    this.repairBillService.createRepairBill(this.newBill).subscribe((bill: RepairBill) => {
      console.log("Bill returned from backend:", bill);  // Check if bill.notes has the correct value
      if (bill.status === 'pending') {
        this.pendingBills.push(bill);
        this.filteredPendingBills = [...this.pendingBills];
      } else if (bill.status === 'failed') {
        this.failedBills.push(bill);
        this.filteredFailedBills = [...this.failedBills];
      } else if (bill.status === 'processed') {
        this.processedBills.push(bill);
        this.filteredProcessedBills = [...this.processedBills];
      } else if (bill.status === 'completed') {
        this.completedBills.push(bill);
        this.filteredCompletedBills = [...this.completedBills];
      }
  
      // Reset the form after adding the bill
      this.newBill = {
        id: 0,
        so_number: '',
        customer_name: '',
        model_number: 'GCQ',  // Default model number
        serial_number: '',
        rma_number: '',
        status: 'pending',
        failure_reason: '', // Clear failure reason
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
// Save changes to the edited bill
saveEdit(): void {
  if (this.editBill) {
    this.repairBillService.updateBillStatus(this.editBill).subscribe(() => {
      this.removeFromAllLists(this.editBill!.id); // Remove the bill from its original list
      this.moveBillToCorrectList(this.editBill!); // Move the bill to the correct list based on its new status
      this.filterBills();  // Update filtered lists
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
  deleteBill(): void {
    if (this.editBill) {
      const id = this.editBill.id;
      this.repairBillService.deleteRepairBill(id).subscribe(() => {
        this.removeFromAllLists(id);  // Remove from all lists
        this.filterBills();  // Update filtered lists
        this.reloadActiveTab();  // Reload the active tab to reflect changes
        this.closeEditModal();
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

  // Helper method to reload the active tab
  reloadActiveTab(): void {
    if (this.activeTab === 'pending') {
      this.loadPendingBills();
    } else if (this.activeTab === 'completed') {
      this.loadCompletedBills();
    } else if (this.activeTab === 'processed') {
      this.loadProcessedBills();
    } else if (this.activeTab === 'failed') {
      this.loadFailedBills();
    }
  }
}








