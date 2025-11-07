import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { CreateUserRequest } from '../../shared/interfaces';
import { USER_ROLES } from '../../shared/constants';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Card,
    InputText,
    Select,
    Button,
    Toast
  ],
  providers: [MessageService],
  template: `
    <div class="user-management-container">
      <p-card header="User Management" styleClass="user-form-card">
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
          <div class="form-grid">
            <div class="form-field">
              <label for="firstName" class="field-label">First Name *</label>
              <input 
                id="firstName"
                type="text" 
                pInputText 
                formControlName="firstName"
                placeholder="Enter first name"
                [class.ng-invalid]="firstNameControl.invalid && firstNameControl.touched"
              />
              @if (firstNameControl.invalid && firstNameControl.touched) {
                <small class="p-error">First name is required</small>
              }
            </div>

            <div class="form-field">
              <label for="lastName" class="field-label">Last Name *</label>
              <input 
                id="lastName"
                type="text" 
                pInputText 
                formControlName="lastName"
                placeholder="Enter last name"
                [class.ng-invalid]="lastNameControl.invalid && lastNameControl.touched"
              />
              @if (lastNameControl.invalid && lastNameControl.touched) {
                <small class="p-error">Last name is required</small>
              }
            </div>

            <div class="form-field">
              <label for="email" class="field-label">Email *</label>
              <input 
                id="email"
                type="email" 
                pInputText 
                formControlName="email"
                placeholder="Enter email address"
                [class.ng-invalid]="emailControl.invalid && emailControl.touched"
              />
              @if (emailControl.invalid && emailControl.touched) {
                <small class="p-error">
                  @if (emailControl.errors?.['required']) {
                    Email is required
                  } @else if (emailControl.errors?.['email']) {
                    Please enter a valid email
                  }
                </small>
              }
            </div>

            <div class="form-field">
              <label for="phone" class="field-label">Phone *</label>
              <input 
                id="phone"
                type="tel" 
                pInputText 
                formControlName="phone"
                placeholder="Enter phone number"
                [class.ng-invalid]="phoneControl.invalid && phoneControl.touched"
              />
              @if (phoneControl.invalid && phoneControl.touched) {
                <small class="p-error">Phone number is required</small>
              }
            </div>

            <div class="form-field">
              <label for="role" class="field-label">Role *</label>
              <p-select
                inputId="role"
                formControlName="role"
                [options]="roleOptions()"
                optionLabel="label"
                optionValue="value"
                placeholder="Select a role"
                styleClass="w-full"
                [class.ng-invalid]="roleControl.invalid && roleControl.touched"
              />
              @if (roleControl.invalid && roleControl.touched) {
                <small class="p-error">Role is required</small>
              }
            </div>
          </div>

          <div class="form-actions">
            <p-button 
              type="button"
              label="Reset" 
              severity="secondary"
              (onClick)="resetForm()"
              [disabled]="isSubmitting()"
            />
            <p-button 
              type="submit"
              label="Create User" 
              [loading]="isSubmitting()"
              [disabled]="userForm.invalid"
            />
          </div>
        </form>
      </p-card>
      <p-toast />
    </div>
  `,
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  private userService = inject(UserService);
  private messageService = inject(MessageService);

  isSubmitting = signal(false);
  roleOptions = signal([...USER_ROLES]);

  userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required])
  });

  get firstNameControl() { return this.userForm.get('firstName')!; }
  get lastNameControl() { return this.userForm.get('lastName')!; }
  get emailControl() { return this.userForm.get('email')!; }
  get phoneControl() { return this.userForm.get('phone')!; }
  get roleControl() { return this.userForm.get('role')!; }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting.set(true);
      
      const userRequest: CreateUserRequest = this.userForm.value as CreateUserRequest;
      
      this.userService.createUser(userRequest).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `User ${response.data.firstName} ${response.data.lastName} created successfully`
          });
          this.resetForm();
          this.isSubmitting.set(false);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to create user'
          });
          this.isSubmitting.set(false);
        }
      });
    }
  }

  resetForm(): void {
    this.userForm.reset();
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.setErrors(null);
    });
  }
}