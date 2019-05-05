import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Savings } from './savings.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

const SAVINGS_BACK_END_URL = environment.apiUrl + '/savings/';

@Injectable({ providedIn: 'root' })
export class SavingsService {
  private savingsEntries: Savings[] = [];
  private savingsUpdated = new Subject<{
    savingsEntries: Savings[];
  }>();
  private savingsStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getSavingsUpdateListener() {
    return this.savingsUpdated.asObservable();
  }

  getSavingsStatusListener() {
    return this.savingsStatusListener.asObservable();
  }

  createSavings(
    description: string,
    expenseType: string,
    amount: number,
    note: string,
    createdById: string
  ) {
    const savingsData: Savings = {
      id: '',
      description: description,
      expenseType: expenseType,
      amount: amount,
      note: note,
      createdById: createdById
    };
    this.http
      .post<{ message: string }>(
        SAVINGS_BACK_END_URL + 'savings', savingsData
      )
      .subscribe(
        () => {
          this.router.navigate(['/savings']);
        },
        error => {
          console.log(error);
          this.savingsStatusListener.next(true);
        }
      );
  }

  getSavingsEntries(
    savingsEntriesPerPage: number,
    currentPage: number,
    createdById: string
  ) {
    const queryParams = `?pagesize=${savingsEntriesPerPage}&page=${currentPage}&createdById=${createdById}`;
    this.http
      .get<{ message: string; savingsEntries: any }>(
        SAVINGS_BACK_END_URL + 'savings' + queryParams
      )
      .pipe(
        map(savingsData => {
          return {
            savingsEntries: savingsData.savingsEntries.map(
              savings => {
                return {
                  id: savings._id,
                  description: savings.description,
                  expenseType: savings.expenseType,
                  amount: savings.amount,
                  note: savings.note,
                  createdById: savings.createdById
                };
              }
            )
          };
        })
      )
      .subscribe(transformedSavingsData => {
        this.savingsEntries = transformedSavingsData.savingsEntries;
        this.savingsUpdated.next({
          savingsEntries: [...this.savingsEntries]
        });
      });
  }

  getSavingsEntriesForDropDown(createdById: string) {
    const queryParams = `?createdById=${createdById}`;
    return this.http
      .get<{ message: string; savingsEntries: any }>(
        SAVINGS_BACK_END_URL + 'savings' + queryParams
      )
      .pipe(
        map(savingsData => {
          return {
            savingsEntries: savingsData.savingsEntries.map(
              savings => {
                return {
                  id: savings._id,
                  description: savings.description
                };
              }
            )
          };
        })
      )
  }

  getSavingsTotalCount(createdById: string) {
    return this.http.get<{ savingsTotalCount: number }>(
      SAVINGS_BACK_END_URL + 'savings-count/' + createdById
    );
  }

  getSavingsById(id: string) {
    return this.http.get<{
      _id: string;
      description: string;
      expenseType: string,
      amount: number;
      note: string;
      createdBy: string;
    }>(SAVINGS_BACK_END_URL + 'savings/' + id);
  }

  getSavingsInfo(createdById: string) {
    return this.http.get<{
      totalSavingsAmount: number,
      totalSavingsDineOutAmount: number,
      totalSavingsGiftAmount: number,
      totalSavingsGroceryAmount: number,
      totalSavingsHouseAmount: number,
      totalSavingsMembershipAmount: number,
      totalSavingsOtherAmount: number,
      totalSavingsTransportationAmount: number,
      totalSavingsTravelAmount: number
    }>(SAVINGS_BACK_END_URL + 'savings-infoByOwner/' + createdById);
  }

  updateSavings(
    id: string,
    description: string,
    expenseType: string,
    amount: number,
    note: string
  ) {
    const savingsData: Savings = {
      id: id,
      description: description,
      expenseType: expenseType,
      amount: amount,
      note: note,
      createdById: ''
    };
    this.http.patch<{ message: string }>(
      SAVINGS_BACK_END_URL + 'update-savings/' + id,
      savingsData
    ).subscribe(() => {
      this.router.navigate(['/savings']);
    }, error => {
      console.log(error);
      this.savingsStatusListener.next(true);
    });
  }

  deleteSavings(id: string) {
    this.http.delete<{ message: string }>(
      SAVINGS_BACK_END_URL + 'savings/' + id
    ).subscribe(() => {
      this.router.navigate(['/savings']);
    }, error => {
      console.log(error);
      this.savingsStatusListener.next(true);
    })
  }
}
