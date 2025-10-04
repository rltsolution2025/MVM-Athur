import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdmissionServices } from '../../services/admission-form/admission-services';

@Component({
  selector: 'app-admission',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admission.html',
  styleUrl: './admission.css'
})
export class Admission {
  admissionForm: FormGroup;
  submitted: boolean = false;

  classes: string[] = [
    'Pre-KG', 'LKG', 'UKG',
    'Class I', 'Class II', 'Class III',
    'Class IV', 'Class V', 'Class VI',
    'Class VII', 'Class VIII', 'Class IX'
  ];

  constructor(private fb: FormBuilder, private admissionService: AdmissionServices) {
    this.admissionForm = this.fb.group({
      studentName: ['', Validators.required],
      dob: ['', Validators.required],
      classApplied: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      parent: ['', Validators.required],
      parentName: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
    });
  }
  get f() {
    return this.admissionForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.admissionForm.valid) {
      this.admissionService.submitAdmission(this.admissionForm.value).subscribe({
        next: (res) =>{
          alert('🎓 Admission form submitted successfully!');
          this.admissionForm.reset();
          this.submitted = false;
        },
        error:(err)=>{
          console.error(err);
          alert('⚠️ Something went wrong. Please try again later.');
        }
    });
    }
  }
}
