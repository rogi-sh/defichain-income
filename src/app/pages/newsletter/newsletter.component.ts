import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Newsletter } from '@interfaces/Data';
import { UPDATE_NEWSLETTER } from '@interfaces/Graphql';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-newsletter-page',
  templateUrl: './newsletter.component.html'
})
export class NewsletterComponent implements OnInit, OnChanges {

  @Input()
  newsletter!: Newsletter;

  @Input()
  key!: string;

  successBackend = null;
  errorBackend = null;

  email: string;
  address: string;

  constructor(private apollo: Apollo, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.email = this.newsletter?.email;
    this.address = this.newsletter?.payingAddress;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.email = this.newsletter?.email;
    this.address = this.newsletter?.payingAddress;
  }

  save(): void {
    this.spinner.show();
    this.apollo.mutate({
      mutation: UPDATE_NEWSLETTER,
      variables : {
        key: this.key,
        email: this.email,
        payingAddress: this.address
      }
    }).subscribe((result: any) => {
      if (result?.data?.updateUserNewsletter) {
        this.newsletter = result?.data?.updateUserNewsletter.newsletter;
        this.email = this.newsletter?.email;
        this.address = this.newsletter?.payingAddress;
        this.spinner.hide();
        this.successBackend = 'Newsletter updated';
        setInterval(() => {
          this.successBackend = null;
        }, 5000);
      } else {
        this.spinner.hide();
        console.log('No Date for updateUserNewsletter');
      }
    }, (error) => {
      this.spinner.hide();
      console.log(error);
      this.errorBackend = error.message;
      setInterval(() => {
        this.errorBackend = null;
      }, 5000);
    });
  }
}
