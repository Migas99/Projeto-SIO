import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/User';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { ValidationService } from '../../services/validation/validation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Input() userData: User = new User();
  coordinatesToggle: boolean;
  addressToggle: boolean;

  constructor(
    public service: AuthenticationService,
    public service2: ValidationService,
    private router: Router
  ) {}

  ngOnInit() {}

  /**
   * This This function registers the user
   */
  register(): void {
    {
      this.serviceRegisterUser();
    }
  }

  /**
   * This function posts the user, in the REST API.
   */
  serviceRegisterUser(): void {
    this.service
      .register(this.userData.UserName, this.userData.PasswordHash)
      .subscribe(
        (result) => {
          console.log(result);
          this.router.navigate(['/login']);
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
