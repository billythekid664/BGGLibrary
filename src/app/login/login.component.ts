import { Component, inject, OnDestroy, OnInit } from '@angular/core';
// import { Auth, user, AngularFireAuth } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { map, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HideNavService } from '../service/hide-nav.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { traceUntilFirst } from '@angular/fire/performance';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  userSubscription?: Subscription;
  loginForm!: FormGroup;
  isRegister: boolean = false;
  cantLogin: boolean = false;
  cantRegister: boolean = false;
  redirectUrl = '/';

  confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return control.value === this.loginForm?.get('password')?.value
      ? null
      : { PasswordNoMatch: true };
  };

  constructor(private hideNavService: HideNavService) {
    this.createLoginForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.redirectUrl = params['redirectUrl'] ? decodeURIComponent(params['redirectUrl']) : '/';
    });
  }

  ngOnDestroy(): void {
    this.hideNavService.setHideNav(false);
    this.userSubscription?.unsubscribe();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    });
  }

  createRegisterForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_@$!%*?&])[A-Za-z\d_@$!%*?&]{8,20}$/)]],
      confirmPassword: ['', [Validators.required, this.confirmPasswordValidator]]
    });
  }

  checkPasswordErrors(passwordType: string) {
    const passwordControl = this.loginForm.get(passwordType);
    if (passwordControl?.invalid) {
      if (passwordControl?.hasError('required')) {
        return 'Password is required';
      } else if (passwordControl?.hasError('minlength')) {
        return 'Password must be at least 8 characters long';
      } else if (passwordControl?.hasError('maxlength')) {
        return 'Password must be no more than 20 characters long';
      } else if (passwordControl?.hasError('pattern')) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
      } else if (passwordControl?.hasError('PasswordNoMatch')) {
        return 'Passwords do not match';
      }
    }
    return null;
  }

  checkEmailErrors() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.invalid) {
      if (emailControl?.hasError('required')) {
        return 'Email is required';
      } else if (emailControl?.hasError('email')) {
        return 'Please enter a valid email address';
      }
    }
    return null;
  }

  togglePassword(toggleId: string, passwordId: string) {
    const togglePassword: Element = document.querySelector(`#${toggleId}`)!;
    const password = document.querySelector(`#${passwordId}`)!;
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    togglePassword.classList.toggle('bi-eye');
  }

  toggleRegister() {
    if (this.isRegister) {
      console.log('Switching to login form');
      this.createLoginForm();
      this.isRegister = !this.isRegister;
    } else { 
      console.log('Switching to register form');
      this.createRegisterForm();
      this.isRegister = !this.isRegister;
    }
  }

  onSubmit() {
    signInWithEmailAndPassword(this.auth, this.loginForm.value.email, this.loginForm.value.password).then((userCredential: any) => {
      console.log('User credential login:', userCredential);
      this.router.navigate([this.redirectUrl]);
     }).catch((error: any) => {
      console.error('Error logging in:', error);
      this.cantLogin = true;
     });
  }

  onSubmitRegister() {
    createUserWithEmailAndPassword(this.auth, this.loginForm.value.email, this.loginForm.value.password).then((userCredential: any) => {
      console.log('User credential register:', userCredential);
      this.router.navigate([this.redirectUrl]);
    }).catch((error: any) => {
      console.error('Error registering:', error);
      this.cantRegister = true;
    });
  }
}
