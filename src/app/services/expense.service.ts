import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Expense } from '../models/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private getUrl: string = 'https://mysterious-lowlands-08309.herokuapp.com/api/v1/expenses';
  private recurringExpenseUrl: string = 'https://mysterious-lowlands-08309.herokuapp.com/api/v1/recurringexpenses'
  
  constructor(private http: HttpClient) { }

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.getUrl).pipe(map(response => response));
  }

  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.getUrl, expense);
  }

  addRecurringExpense(expense): Observable<any> {
    return this.http.post<Expense>(this.recurringExpenseUrl, expense);
  }

  updateExpense(updateRecord) {
    return this.http.post<Expense>(this.getUrl, updateRecord);
  }

  deleteExpense(id: number) {
    return this.http.delete(`${this.getUrl}/${id}`, {responseType: 'text'});
  }
}

