import { TestBed } from '@angular/core/testing';
import { ApiAuthenticationService } from '@app/core/auth/api-auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ApiAuthenticationService', () => {
  let service: ApiAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiAuthenticationService],
    });
    service = TestBed.inject(ApiAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check login status', (done) => {
    service.whoAmI({}).subscribe(user => {
      expect(user).toBeDefined();
      done();
    });
  });
});
