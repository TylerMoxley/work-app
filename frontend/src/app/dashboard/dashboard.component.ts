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
  signedBills: RepairBill[] = [];
  failedBills: RepairBill[] = [];

  filteredPendingBills: RepairBill[] = [];
  filteredFailedBills: RepairBill[] = [];
  filteredProcessedBills: RepairBill[] = [];
  filteredCompletedBills: RepairBill[] = [];
  filteredSignedBills: RepairBill[] = [];
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
    notes: '',
    envelope_id: ''
  };

  editBill: RepairBill | null = null;
  isEditModalOpen: boolean = false;
  isModalOpen: boolean = false;
  activeTab: string = 'pending';

  constructor(private repairBillService: RepairBillService) {}

  ngOnInit(): void {
    this.loadPendingBills();
    this.loadSignedBills();
    this.loadCompletedBills();
    this.loadProcessedBills();
    this.loadFailedBills();
  }

  // Helper method to sort bills by updated_at
  sortByUpdatedAt(bills: RepairBill[]): RepairBill[] {
    return bills.sort((a, b) => {
      // Use new Date(0) if updated_at is undefined (defaults to epoch time)
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : new Date(0).getTime();
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : new Date(0).getTime();
      
      return dateB - dateA;  // Sort in descending order
    });
  }
  

  // Load pending bills
  loadPendingBills(): void {
    this.repairBillService.getBillsByStatus('pending').subscribe((data: RepairBill[]) => {
      this.pendingBills = this.sortByUpdatedAt(data);  // Sort by updated_at
      this.filterBills();  // Apply filters after loading
    });
  }

  // Load completed bills
  loadCompletedBills(): void {
    this.repairBillService.getBillsByStatus('completed').subscribe((data: RepairBill[]) => {
      this.completedBills = this.sortByUpdatedAt(data);  // Sort by updated_at
      this.filterBills();  // Apply filters after loading
    });
  }

  // Load processed bills
  loadProcessedBills(): void {
    this.repairBillService.getBillsByStatus('processed').subscribe((data: RepairBill[]) => {
      this.processedBills = this.sortByUpdatedAt(data);  // Sort by updated_at
      this.filterBills();  // Apply filters after loading
    });
  }

  // Load failed bills
  loadFailedBills(): void {
    this.repairBillService.getBillsByStatus('failed').subscribe((data: RepairBill[]) => {
      this.failedBills = this.sortByUpdatedAt(data);  // Sort by updated_at
      this.filterBills();  // Apply filters after loading
    });
  }

  // Load signed bills
  loadSignedBills(): void {
    this.repairBillService.getBillsByStatus('signed').subscribe((data: RepairBill[]) => {
      this.signedBills = this.sortByUpdatedAt(data);
      this.filteredSignedBills = [...this.signedBills];  // Explicitly set filteredSignedBills
      // If you need to apply filters based on search term, call filterBills()
      this.filterBills();  // Optional
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

      this.filteredSignedBills = this.signedBills.filter(bill =>
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
    this.filteredSignedBills = [...this.signedBills];  // Add this line
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
  
    // Always fetch bills when the tab is activated
    if (tab === 'pending') {
      this.loadPendingBills();
    } else if (tab === 'signed') {
      this.loadSignedBills();
    } else if (tab === 'completed') {
      this.loadCompletedBills();
    } else if (tab === 'processed') {
      this.loadProcessedBills();
    } else if (tab === 'failed') {
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
        this.pendingBills = this.sortByUpdatedAt(this.pendingBills);  // Sort after adding
        this.filteredPendingBills = [...this.pendingBills];
      } else if (bill.status === 'failed') {
        this.failedBills.push(bill);
        this.failedBills = this.sortByUpdatedAt(this.failedBills);  // Sort after adding
        this.filteredFailedBills = [...this.failedBills];
      } else if (bill.status === 'processed') {
        this.processedBills.push(bill);
        this.processedBills = this.sortByUpdatedAt(this.processedBills);  // Sort after adding
        this.filteredProcessedBills = [...this.processedBills];
      } else if (bill.status === 'completed') {
        this.completedBills.push(bill);
        this.completedBills = this.sortByUpdatedAt(this.completedBills);  // Sort after adding
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
  saveEdit(): void {
    if (this.editBill) {
      // Update the updated_at field to the current time
      this.editBill.updated_at = new Date().toISOString();  // Set the updated time to now
  
      this.repairBillService.updateBillStatus(this.editBill).subscribe(() => {
        this.removeFromAllLists(this.editBill!.id);  // Remove the bill from its original list
        this.moveBillToCorrectList(this.editBill!);  // Move the bill to the correct list based on its new status
        this.filterBills();  // Update filtered lists
        this.closeEditModal();
      });
    }
  }

  // Helper method to remove a bill from all lists based on id
  removeFromAllLists(id: number): void {
    this.pendingBills = this.pendingBills.filter(bill => bill.id !== id);
    this.signedBills = this.signedBills.filter(bill => bill.id !== id);
    this.completedBills = this.completedBills.filter(bill => bill.id !== id);
    this.processedBills = this.processedBills.filter(bill => bill.id !== id);
    this.failedBills = this.failedBills.filter(bill => bill.id !== id);
  }

  // Move the edited bill to the correct list based on status
  moveBillToCorrectList(bill: RepairBill): void {
    if (bill.status === 'signed') {
      this.signedBills.push(bill);
      this.signedBills = this.sortByUpdatedAt(this.signedBills);  // Sort after pushing the bill
    } else if (bill.status === 'completed') {
      this.completedBills.push(bill);
      this.completedBills = this.sortByUpdatedAt(this.completedBills);  // Sort after pushing the bill
    } else if (bill.status === 'processed') {
      this.processedBills.push(bill);
      this.processedBills = this.sortByUpdatedAt(this.processedBills);  // Sort after pushing the bill
    } else if (bill.status === 'failed') {
      this.failedBills.push(bill);
      this.failedBills = this.sortByUpdatedAt(this.failedBills);  // Sort after pushing the bill
    } else {
      this.pendingBills.push(bill);
      this.pendingBills = this.sortByUpdatedAt(this.pendingBills);  // Sort after pushing the bill
    }
  }
  

  // Delete the selected repair bill
  deleteBill(): void {
    if (this.editBill) {
      const id = this.editBill.id;
      this.repairBillService.deleteRepairBill(id).subscribe(() => {
        this.removeFromAllLists(id);  // Remove from all lists
        this.filterBills();  // Update filtered lists
        this.reloadActiveTab();  // Reload the active tab to reflect changes and re-sort
        
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
