import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { USER_ROLES } from '../../shared/constants';
import { GenAITypography } from "../../shared/ui-elements/gen-ai-typography/gen-ai-typography";

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputText,
    Select,
    Button,
    Toast,
    GenAITypography
],
  providers: [MessageService],
  template: `
    <div class="header-navbar">
      <button class="back-button" (click)="goBack()">
        <img src="images/back.svg" alt="Back" />
      </button>
      <div class="header-text">
        <genai-typography color="text-prim">Add User</genai-typography>
        <genai-typography color="text-sec">Organization</genai-typography>
      </div>
    </div>

    <div class="user-management-container">
      <div class="user-form-card">
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
          <div class="image-upload-section">
            <div class="image-preview">
              <img [src]="previewImage() || 'images/default-avatar.png'" alt="User Avatar" class="avatar-image" />
            </div>
            <input 
              type="file"
              accept="image/*"
              (change)="onImageSelect($event)"
              class="file-input"
              id="avatar-upload"
            />
            <label for="avatar-upload" class="upload-btn">
              <img src="images/upload.svg" alt="Upload" />
              Upload Image
            </label>
          </div>

          <div class="form-fields">
            <div class="name-row">
              <div class="form-field">
                <label for="firstName" class="field-label required">First Name</label>
                <input 
                  id="firstName"
                  type="text" 
                  pInputText 
                  formControlName="firstName"
                  placeholder="Enter first name"
                  [class.ng-invalid]="firstNameControl.invalid && firstNameControl.touched"
                />
              </div>

              <div class="form-field">
                <label for="middleName" class="field-label">Middle Name</label>
                <input 
                  id="middleName"
                  type="text" 
                  pInputText 
                  formControlName="middleName"
                  placeholder="Enter middle name"
                />
              </div>

              <div class="form-field">
                <label for="lastName" class="field-label required">Last Name</label>
                <input 
                  id="lastName"
                  type="text" 
                  pInputText 
                  formControlName="lastName"
                  placeholder="Enter last name"
                  [class.ng-invalid]="lastNameControl.invalid && lastNameControl.touched"
                />
              </div>
            </div>

            <div class="form-field">
              <label for="email" class="field-label required">Email</label>
              <input 
                id="email"
                type="email" 
                pInputText 
                formControlName="email"
                placeholder="Enter email address"
                [class.ng-invalid]="emailControl.invalid && emailControl.touched"
              />
            </div>

            <div class="form-field">
              <label for="phone" class="field-label required">Phone</label>
              <input 
                id="phone"
                type="tel" 
                pInputText 
                formControlName="phone"
                placeholder="Enter phone number"
                [class.ng-invalid]="phoneControl.invalid && phoneControl.touched"
              />
            </div>

            <div class="form-field">
              <label class="field-label">RFI Access</label>
              <label class="toggle-switch">
                <input type="checkbox" formControlName="rfiEnabled" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="form-field">
              <label for="rfi" class="field-label">RFI</label>
              <input 
                id="rfi"
                type="text" 
                pInputText 
                formControlName="rfi"
                placeholder="Enter RFI"
                [disabled]="!rfiEnabledControl.value"
                [class.ng-invalid]="rfiControl.invalid && rfiControl.touched"
              />
            </div>

            <div class="form-field">
              <label for="role" class="field-label required">Role</label>
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
            </div>

            <div class="form-field">
              <label for="department" class="field-label required">Department</label>
              <p-select 
                inputId="department"
                formControlName="department"
                [options]="departmentOptions()"
                placeholder="Select a department"
                optionLabel="label"
                optionValue="value"
                styleClass="w-full"
                [class.ng-invalid]="departmentControl.invalid && departmentControl.touched">
              </p-select>
            </div>

            <div class="form-field">
              <label for="fleet" class="field-label required">Fleet</label>
              <p-select 
                inputId="fleet"
                formControlName="fleet"
                [options]="fleetOptions()"
                placeholder="Select a fleet"
                optionLabel="label"
                optionValue="value"
                styleClass="w-full"
                [class.ng-invalid]="fleetControl.invalid && fleetControl.touched">
              </p-select>
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
      </div>
      <p-toast />
    </div>
  `,
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  private messageService = inject(MessageService);

  isSubmitting = signal(false);
  roleOptions = signal([...USER_ROLES]);

  userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    middleName: new FormControl(''),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    rfiEnabled: new FormControl(false),
    rfi: new FormControl(''),
    role: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required]),
    fleet: new FormControl('', [Validators.required])
  });

  previewImage = signal<string>('');
  
  departmentOptions = signal([
    { label: 'Engineering', value: 'engineering' },
    { label: 'Operations', value: 'operations' },
    { label: 'Human Resources', value: 'hr' },
    { label: 'Finance', value: 'finance' },
    { label: 'Marketing', value: 'marketing' }
  ]);

  fleetOptions = signal([
    { label: 'Fleet A', value: 'fleet-a' },
    { label: 'Fleet B', value: 'fleet-b' },
    { label: 'Fleet C', value: 'fleet-c' },
    { label: 'Emergency Fleet', value: 'emergency' }
  ]);

  get firstNameControl() { return this.userForm.get('firstName')!; }
  get middleNameControl() { return this.userForm.get('middleName')!; }
  get lastNameControl() { return this.userForm.get('lastName')!; }
  get emailControl() { return this.userForm.get('email')!; }
  get phoneControl() { return this.userForm.get('phone')!; }
  get rfiEnabledControl() { return this.userForm.get('rfiEnabled')!; }
  get rfiControl() { return this.userForm.get('rfi')!; }
  get roleControl() { return this.userForm.get('role')!; }
  get departmentControl() { return this.userForm.get('department')!; }
  get fleetControl() { return this.userForm.get('fleet')!; }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting.set(true);
            setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'User Created',
          detail: 'User has been created successfully'
        });
        this.resetForm();
        this.isSubmitting.set(false);
      }, 1000);
    }
  }

  resetForm(): void {
    this.userForm.reset();
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.setErrors(null);
    });
  }

  goBack(): void {
    console.log('Navigating back...');
  }

  onImageSelect(event: any): void {
    const file = event.files?.[0] || event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
}