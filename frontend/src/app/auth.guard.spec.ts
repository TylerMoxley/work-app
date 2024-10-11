import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service'; // Import your AuthService
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>; // Mock AuthService
  let router: Router;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']); // Mock getToken method

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],  // Import RouterTestingModule for the Router dependency
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },  // Provide the mocked AuthService
      ],
    });

    authGuard = TestBed.inject(AuthGuard);  // Instantiate the AuthGuard
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;  // Get the mocked AuthService
    router = TestBed.inject(Router);  // Get the Router instance
  });

  it('should return true if the user is authenticated', () => {
    authService.getToken.and.returnValue('mocked-token');  // Mock the return value as a string token

    expect(authGuard.canActivate()).toBeTrue();  // Expect canActivate to return true
  });

  it('should navigate to login if the user is not authenticated', () => {
    const navigateSpy = spyOn(router, 'navigate');  // Spy on router.navigate
    authService.getToken.and.returnValue(null);  // Mock the return value of getToken as null (no token)

    expect(authGuard.canActivate()).toBeFalse();  // Expect canActivate to return false
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);  // Check that router.navigate was called
  });
});
