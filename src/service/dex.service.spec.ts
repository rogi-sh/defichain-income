import { TestBed } from '@angular/core/testing';

// @ts-ignore
import { DexService } from './dex-service.service';

describe('DexServiceService', () => {
  let service: DexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
