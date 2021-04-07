import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService } from 'src/app/services/expense.service';
import { HAPPY, SAD, STRAIGHT } from 'src/common/constants/userMessages';
declare var $: any;


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  userEntered: boolean;
  addExpenseForm: FormGroup;
  name: string;
  amount: string;
  imgPath: string;
  message: string;
  mood: string;
  showToast: boolean;
  toastElList: any;
  

  constructor(private router: Router,
    private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.initializeToast();
    
    this.userEntered = false;
    this.addExpenseForm = new FormGroup({
      expense: new FormControl(''),
      amount: new FormControl(''),
      expenseDate: new FormControl('')
    });  
    this.addExpenseForm.valueChanges.subscribe(value => {
      this.imgPath = '../../assets/';
      this.name = value.expense;
      this.amount = value.amount;
      if(value.expense && value.amount) {
        this.userEntered = true;
        this.setSummaryData(value);
      } else {
        this.userEntered = false;
      }
    })
  }

  initializeToast() {
    $('.toast').toast(Option)
  }


  setSummaryData(formValues: any) {
    if(formValues.amount > 5000){ 
      this.message = SAD;
      this.imgPath += 'sad.jpeg'
      this.mood = 'sad';
    } else if(formValues.amount > 1000 ) {
      this.message = STRAIGHT;
      this.imgPath += 'straight.jpeg';
      this.mood = 'straight';
    } else {
      this.message = HAPPY;
      this.imgPath += 'smile.jpeg';
      this.mood = 'happy';
    }  
  }

  addExpense() {
    $('.toast').toast('show');
    this.expenseService.addExpense(this.addExpenseForm.value).subscribe((response) => this.addExpenseForm.reset());
  }

  reviewReport() {
    this.router.navigate(['report'])
  }
}
