import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {faUser, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from 'ngx-toastr';
import {User} from "../../class/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;
  faUser = faUser;
  faStop = faCircleExclamation;
  loginForm: FormGroup;
  user = new User();
  isLogged: boolean = false;
  apiError ?: string;
  timeTokenExpired: number = 0;
  timeSessionExpired !: string;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private toastr: ToastrService,) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check time token expired
    this.timeTokenExpired = this.authService.getSecondsUntilTokenExpires();

    // Check if user is logged in and if token is valid
    let access = this.authService.isAuthenticated();
    let tokenValid = this.authService.isTokenValid();
    if (access && tokenValid && this.timeTokenExpired > 0) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
      this.authService.signOut();
    }

    // Launch chrono
    this.chrono();
  }

  // Function to login user
  login() {
    const val = this.loginForm.value;
    if (val.username && val.password) {
      this.authService.signIn(val.username, val.password)
        .subscribe(data => {
          localStorage.setItem('token', data.auth_token);
          this.user = data;
          this.authService.saveUser(this.user);
          this.toastr.success('Connection à Taiga réalisé avec succès', 'Bienvenue !', {positionClass: 'toast-bottom-right'});
          this.router.navigateByUrl('/listing');
        }, error => {
          this.apiError = error.error;
          this.toastr.error('La connection à échouée, verifier vos identifiants ou la configuration de l\'application', 'Erreur !', {positionClass: 'toast-bottom-full-width'});
        });
    }
  }

  // Function to logout user
  logout() {
    this.authService.signOut();
    this.router.navigateByUrl('/listing');
    this.isLogged = false;
  }

  goListing(): void {
    this.router.navigateByUrl('/listing');
  }

  // Function chrono to display time token expired in hours and minutes
  chrono() {
    let time = this.authService.getSecondsUntilTokenExpires();
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time - (hours * 3600)) / 60);
    if (hours > 0) {
      this.timeSessionExpired = hours + 'h et ' + minutes + 'min';
    } else {
      this.timeSessionExpired = minutes + 'min';
    }
  }


}
