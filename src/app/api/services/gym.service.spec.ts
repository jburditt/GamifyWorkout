import { TestBed } from '@angular/core/testing';
import { GymService } from '@app/api/services/gym.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GymService', () => {
  let service: GymService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GymService],
    });
    service = TestBed.inject(GymService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get gyms', (done) => {
    service.apiGymGet().subscribe(gyms => {
      expect(gyms).toBeDefined();
      done();
    });
  });
});
