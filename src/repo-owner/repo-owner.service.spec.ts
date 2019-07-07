import { Test, TestingModule } from '@nestjs/testing';
import { RepoOwnerService } from './repo-owner.service';

describe('RepoOwnerService', () => {
  let service: RepoOwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepoOwnerService],
    }).compile();

    service = module.get<RepoOwnerService>(RepoOwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
