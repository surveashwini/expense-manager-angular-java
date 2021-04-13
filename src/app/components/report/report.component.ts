import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Expense } from 'src/app/models/expense';
import { ExpenseService } from 'src/app/services/expense.service';
declare var $: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportComponent implements OnInit {
  expenseList: Expense[];
  editRecordDetails: { edit: boolean; i: number; };
  reportForm: FormGroup;
  deletedMessage: string;
  showProgress: boolean;

  constructor(private expenseService: ExpenseService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initializeToast();
    this.initializeForm();
    this.showProgress = false;
    this.expenseService.getExpenses().subscribe(response => {
      this.expenseList = response.filter(expense => {
        if((new Date(expense.expenseDate)) <= new Date) {
          return expense;
        }
      });
      this.cdr.detectChanges();
    });
  }

  initializeForm() {
    this.reportForm = new FormGroup({
      expense: new FormControl(''),
      amount: new FormControl(''),
    });
  }

  initializeToast() {
    $('.toast').toast(Option)
  }

  deleteRecord(i: number) {
    this.showProgress = true;
    this.expenseService.deleteExpense(this.expenseList[i].id).subscribe(response => {
      this.deletedMessage = response;
      $('.toast').toast('show');
      this.cdr.detectChanges();
      
      this.expenseService.getExpenses().subscribe(response => {
        this.expenseList = response.filter(expense => {
          if((new Date(expense.expenseDate)) <= new Date) {
            return expense;
          }
        });
        this.showProgress = false;
        this.cdr.detectChanges();
      });
    });
  }

  editRecord(i: number) {
    this.reportForm.patchValue({expense: this.expenseList[i].expense, amount: this.expenseList[i].amount})
    this.editRecordDetails = {edit: true, i};
    this.cdr.detectChanges();
  }

  updateRecord(i: number) {
    if(this.expenseList[i].expense !== this.reportForm.value.expense || 
      this.expenseList[i].amount !== this.reportForm.value.amount) {
        this.showProgress = true;
        this.cdr.detectChanges()
        const updatedRecord = {
          id: this.expenseList[i].id,
          expense: this.reportForm.value.expense, 
          amount: this.reportForm.value.amount,
          expenseDate: new Date().toISOString().slice(0, 10)
        };
        this.expenseService.updateExpense(updatedRecord).subscribe(response => {
          this.showProgress = false;
          this.expenseList[i] = response;
          this.editRecordDetails.edit = false;
          this.cdr.detectChanges()
        });
    }
  }

}
