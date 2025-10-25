import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  showPoster :boolean = true;
  ngOnInit(): void {
    
  }
  constructor(private router:Router){}
  closePoster(){
    this.showPoster = false;
  }
  cards = [
    {
      title: 'Academics',
      content: 'A good Eductaion should available',
      image: 'home-page/cards-image/academic-image.jpg'
    },
    {
      title: 'Activity',
      content: 'Building Skills Beyond Classrooms',
      image: 'home-page/cards-image/re-home.jpeg'
    },
    {
      title: 'Admission',
      content: 'Begin Your Journey With Us',
      image: 'home-page/cards-image/admissions.jpg'
    },
    {
      title: 'Gallery',
      content: 'A Glimpse Into Our Vibrant Community',
      image: 'home-page/cards-image/Gallery.jpg'
    }
  ]

  teamMembers = [
    {
      name: 'Dr. G.P. THIRUMURUGAN',
      description: 'Our founders vision was to create a dynamic learning environment where students thrive academically and personally',
      image: 'home-page/founders/G.P. Thirumurugan.png'
    },
    {
      name: 'Mrs.RAJALAKSHMI THIRUMURUGAN ',
      description: 'With a focus on innovation and excellence, our director fosters an atmosphere that encourages growth and achievement',
      image: 'home-page/founders/Rajalakshmi.jpg'
    },
    {
      name: 'Mr. T. KARTHIK',
      description: 'Guided by experience and passion, our principal ensures the school provides a nurturing space for both academic and personal development',
      image: 'home-page/founders/T. Karthik.png'
    },
    {
      name: 'Mr. T. NITISH',
      description: 'Guided by experience and passion, our Technical Director ensures that delivers innovative, reliable, and future-ready solutions, fostering both technical excellence and organizational growth',
      image: 'home-page/cards-image/Nitish.png'
    }
  ]

  supportStudents = [
    {
      name: 'Labs',
      image: 'home-page/cards-image/Maharishi-labs.jpeg',
    },
    {
      name: 'Sports',
      image: 'sports-events/Tennis.jpeg',
    },
    {
      name: 'Library',
      image: 'home-page/cards-image/MVM-Library.jpg',
    },
  ]
  supportStudent = [
    {
      name: 'Smart Class',
      image: 'home-page/cards-image/Smart-Classes.jpeg',
    },
    {
      name: 'Transport',
      image: 'home-page/cards-image/maharishi-vidya-mandir-chengalpattu-chengalpattu-transport.avif',
    },
  ]

  goToAdmission(){
      this.closePoster();
      this.router.navigate(['/admissions'])
  }
}
