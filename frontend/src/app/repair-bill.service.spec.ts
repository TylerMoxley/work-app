import { TestBed } from '@angular/core/testing';

import { RepairBillService } from './repair-bill.service';

describe('RepairBillService', () => {
  let service: RepairBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepairBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
