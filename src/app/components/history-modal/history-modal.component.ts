import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { UserHistory, UserHistoryDelete } from '@interfaces/Data'
import { DELETE_HISTORY, UPDATE_NEWSLETTER } from '@interfaces/Graphql'
import { Apollo } from 'apollo-angular'
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
  selector: 'app-history-modal',
  templateUrl: './history-modal.component.html',
  styleUrls: ['./history-modal.component.css'],
})
export class HistoryModalComponent implements OnInit, OnChanges {

  isOpen = false;

  @Input()
  key!: string;

  @Input()
  history: UserHistory;

  toDelete = new Array<UserHistoryDelete>();

  successBackend = null;
  errorBackend = null;

  constructor(private apollo: Apollo, private spinner: NgxSpinnerService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.toDelete?.length > 0) {
      return;
    }

    this.history?.values?.forEach(h => {
      const d = new UserHistoryDelete();
      d.historyItem = h;
      d.toDelete = false;
      this.toDelete.push(d);
    });
  }

  ngOnInit(): void {
  }

  handleOpen(): void {

    this.isOpen = !this.isOpen;
  }

  handleDelete(): void {

    this.toDelete = this.toDelete?.filter(a => a.toDelete);
    const toDeleteGraphqQL = this.toDelete.map(a => a.historyItem._id);
    this.call(toDeleteGraphqQL);


  }

  call(list: Array<string>): void {
    this.spinner.show();
    this.apollo.mutate({
      mutation: DELETE_HISTORY,
      variables : {
        key: this.key,
        items: list
      }
    }).subscribe((result: any) => {
      if (result?.data?.deleteUserHistory) {
        this.spinner.hide();
        this.successBackend = 'History updated - ' + list.length  + ' deleted!';
        setInterval(() => {
          this.successBackend = null;
          // close
          if (this.isOpen) {
            this.isOpen = !this.isOpen;
          }
        }, 2000);
      } else {
        this.spinner.hide();
        this.errorBackend = result?.errors[0]?.message;
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
