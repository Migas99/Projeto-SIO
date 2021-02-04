import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Input() username: string = 'daniel';
  @Input() password: string = '123455';

  constructor(public service: AuthenticationService, private router: Router) {}

  ngOnInit() {
    this.username = 'DAnieasdasd';
  }

  /**
   * This function authenticates the credentials of a user.
   */
  login() {
    console.log(this.username);
    console.log(this.password);
    if (this.username === '') {
      alert('Please insert username.');
    } else if (this.password === '') {
      alert('Please insert password.');
    } else {
      this.serviceLogin();
    }
  }

  /**
   * This function authenticates the credentials of a user, in the the REST API.
   */
  serviceLogin(): void {
    this.service.login(this.username, this.password).subscribe(
      (result) => {
        this.router.navigate(['/#/dashboard']);
      },
      (err) => {
        console.log(err);
        alert(
          'Sorry we could not found you, please check if username and password are correct.'
        );
      }
    );
  }
}
