import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Expense } from '../models/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private getUrl: string = 'http://localhost:8080/api/v1/expenses';
  private recurringExpenseUrl: string = 'http://localhost:8080/api/v1/recurringexpenses'
  private updateExpenseUrl: string = 'http://localhost:8080/api/v1/updateexpenses'

  constructor(private http: HttpClient) { }

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.getUrl).pipe(map(response => response));
  }

  addExpense(expense: Expense): Observable<Expense> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Transfer-encoding': 'chunked',
        'Date': Date.now().toString(),
        'Keep-Alive': 'timeout=60',
        'Connection': 'keep-alive'
      })
    };
    return this.http.post<Expense>(this.getUrl, expense);
  }

  addRecurringExpense(expense): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Transfer-encoding': 'chunked',
        'Date': Date.now().toString(),
        'Keep-Alive': 'timeout=60',
        'Connection': 'keep-alive'
      })
    };
    return this.http.post<Expense>(this.recurringExpenseUrl, expense);
  }

  updateExpense(updateRecord) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Transfer-encoding': 'chunked',
        'Date': Date.now().toString(),
        'Keep-Alive': 'timeout=60',
        'Connection': 'keep-alive'
      })
    };
    return this.http.post<Expense>(this.getUrl, updateRecord);
  }

  deleteExpense(id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Transfer-encoding': 'chunked',
        'Date': Date.now().toString(),
        'Keep-Alive': 'timeout=60',
        'Connection': 'keep-alive'
      })
    };
    return this.http.delete(`${this.getUrl}/${id}`, {responseType: 'text'});
  }
}

