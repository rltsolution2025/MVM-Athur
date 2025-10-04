import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactServices } from '../../services/contact-form/contact-services';

@Component({
  selector: 'app-contact',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  contactForm : FormGroup;
  submitted:boolean=false;

  constructor(private fb: FormBuilder, private contactService: ContactServices){
    this.contactForm = this.fb.group({
      name: ['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      phone:['', [Validators.required,Validators.pattern('^[0-9]{10}$')]],
      location:['',Validators.required],
      message:['']
    });
  }

  onSubmit(){
   this.submitted = true;
   if(this.contactForm.valid){
    this.contactService.submitContact(this.contactForm.value).subscribe({
      next:(res) =>{
        alert('✅ Thank you for contacting us! We will get back to you soon.')
        this.contactForm.reset();
        this.submitted = false;
      },
      error:(err) =>{
        alert('⚠️ Something went wrong. Please try again later.');
      }
    });
   }
  }
}
