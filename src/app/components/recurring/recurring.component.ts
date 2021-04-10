import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ExpenseService } from 'src/app/services/expense.service';

import { recurringOptions } from 'src/common/constants/displayText';
declare var $: any;


@Component({
  selector: 'app-recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.scss']
})
export class RecurringComponent implements OnInit {
  recurring;
  expense: string;
  amount: number;
  expenseDuration: string;
  addRecurringExpenseForm: FormGroup;
  userEntered: boolean;

  constructor(private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.recurring = recurringOptions;
    this.initializeToast();
    this.addRecurringExpenseForm = new FormGroup({
      recurringExpense: new FormControl(''),
      recurringAmount: new FormControl(''),
      duration: new FormControl('Weekly')
    });  

    this.addRecurringExpenseForm.valueChanges.subscribe(value => {
      this.expense = value.recurringExpense;
      this.amount = value.recurringAmount;
      this.expenseDuration = value.duration;
      if(value.recurringAmount && value.recurringExpense) {
        this.userEntered = true;
      } else {
        this.userEntered = false;
      }
    })
  }

  initializeToast() {
    $('.toast').toast(Option)
  }

  addRecurringExpense() {
    $('.toast').toast('show');
    this.addRecurringExpenseForm.patchValue({'duration': this.addRecurringExpenseForm.get('duration').value.toLowerCase()});
    this.expenseService.addRecurringExpense(this.addRecurringExpenseForm.value).subscribe((response) => {
      this.addRecurringExpenseForm.reset();
      this.addRecurringExpenseForm.patchValue({duration: 'Weekly'});
    });
  }
}

