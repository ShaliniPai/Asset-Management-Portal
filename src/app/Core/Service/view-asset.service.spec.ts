import { TestBed } from '@angular/core/testing';

import { ViewAssetService } from './view-asset.service';

describe('ViewAssetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewAssetService = TestBed.get(ViewAssetService);
    expect(service).toBeTruthy();
  });
});
