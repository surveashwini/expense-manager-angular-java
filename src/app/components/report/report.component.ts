import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Expense } from 'src/app/models/expense';
import { ExpenseService } from 'src/app/services/expense.service';
declare var $: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  expenseList: Expense[];
  editRecordDetails: { edit: boolean; i: number; };
  reportForm: FormGroup;
  deletedMessage: string;

  constructor(private expenseService: ExpenseService, private router: Router) { }

  ngOnInit(): void {
    this.initializeToast();
    this.reportForm = new FormGroup({
      expense: new FormControl(''),
      amount: new FormControl(''),
    });
    this.expenseService.getExpenses().subscribe(response => {
      this.expenseList = response.filter(expense => {
        if((new Date(expense.expenseDate)) <= new Date) {
          return expense;
        }
      });
    });
    
  }

  initializeToast() {
    $('.toast').toast(Option)
  }

  deleteRecord(i: number) {
    $('.toast').toast('show');
    this.expenseService.deleteExpense(this.expenseList[i].id).subscribe(response => {
      this.deletedMessage = response;
      this.expenseService.getExpenses().subscribe(response => {
        this.expenseList = response.filter(expense => {
          if((new Date(expense.expenseDate)) <= new Date) {
            return expense;
          }
        });
      });
    });
  }

  editRecord(i: number) {
    this.reportForm.patchValue({expense: this.expenseList[i].expense, amount: this.expenseList[i].amount})
    this.editRecordDetails = {edit: true, i};
  }

  updateRecord(i: number) {
    if(this.expenseList[i].expense !== this.reportForm.value.expense || 
      this.expenseList[i].amount !== this.reportForm.value.amount) {
        const updatedRecord = {
          id: this.expenseList[i].id,
          expense: this.reportForm.value.expense, 
          amount: this.reportForm.value.amount,
          expenseDate: new Date().toISOString().slice(0, 10)
        };
        this.expenseService.updateExpense(updatedRecord).subscribe(response => {
          this.expenseList[i] = response;
          this.editRecordDetails.edit = false;
        });
    }
  }

}
