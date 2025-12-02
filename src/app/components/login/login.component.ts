import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { VirtualRouterService } from '../../services/virtual-router.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
fb = inject(FormBuilder);

  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [true]
  });

constructor(
  private auth: AuthService,
  private router: Router,
  private virtual: VirtualRouterService
) {}

  async submit() {
  if (this.form.invalid) {
    this.error = 'Completa todos los campos';
    return;
  }

  this.loading = true;

  const { email, password } = this.form.value;

  try {
    await this.auth.login(email!, password!);

    if (this.auth.isAuth()) {
      console.log('Usuario autenticado, redirigiendo…');
this.virtual.setActiveRoute('driver-home');
    } else {
      this.error = 'Error de autenticación';
    }

  } catch (err: any) {
    this.error = err?.message || 'No se pudo iniciar sesión';
  }

  this.loading = false;
}

}
