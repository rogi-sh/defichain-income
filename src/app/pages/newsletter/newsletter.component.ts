import { Component, Input, OnInit } from '@angular/core';
import { Pool } from '@interfaces/Dex';
import { Newsletter } from '@interfaces/Data';

@Component({
  selector: 'app-newsletter-page',
  templateUrl: './newsletter.component.html'
})
export class NewsletterComponent implements OnInit {

  @Input()
  newsletter!: Newsletter;

  constructor() { }

  ngOnInit(): void {
  }

  save(): void {

  }
}
