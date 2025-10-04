import { TestBed } from '@angular/core/testing';

import { AdmissionServices } from './admission-services';

describe('AdmissionServices', () => {
  let service: AdmissionServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdmissionServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
