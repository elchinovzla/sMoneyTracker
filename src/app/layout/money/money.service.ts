import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Money } from './money.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

const MONEY_BACK_END_URL = environment.apiUrl + '/money/';

@Injectable({ providedIn: 'root' })
export class MoneyService {
  private moneyEntries: Money[] = [];
  private moneyUpdated = new Subject<{
    moneyEntries: Money[];
  }>();
  private moneyStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getMoneyUpdateListener() {
    return this.moneyUpdated.asObservable();
  }

  getMoneyStatusListener() {
    return this.moneyStatusListener.asObservable();
  }

  createMoney(
    description: string,
    moneyType: string,
    amount: number,
    note: string,
    createdById: string
  ) {
    const moneyData: Money = {
      id: '',
      description: description,
      moneyType: moneyType,
      amount: amount,
      note: note,
      createdById: createdById,
    };
    this.http
      .post<{ message: string }>(MONEY_BACK_END_URL + 'money', moneyData)
      .subscribe(
        () => {
          this.router.navigate(['/money']);
        },
        (error) => {
          console.log(error);
          this.moneyStatusListener.next(true);
        }
      );
  }

  getMoneyEntries(
    moneyEntriesPerPage: number,
    currentPage: number,
    createdById: string
  ) {
    const queryParams = `?pageSize=${moneyEntriesPerPage}&page=${currentPage}&createdById=${createdById}`;
    this.http
      .get<{ message: string; moneyEntries: any }>(
        MONEY_BACK_END_URL + 'money' + queryParams
      )
      .pipe(
        map((moneyData) => {
          return {
            moneyEntries: moneyData.moneyEntries.map((money) => {
              return {
                id: money._id,
                description: money.description,
                moneyType: money.moneyType,
                amount: money.amount,
                note: money.note,
                createdById: money.createdById,
              };
            }),
          };
        })
      )
      .subscribe((transformedMoneyData) => {
        this.moneyEntries = transformedMoneyData.moneyEntries;
        this.moneyUpdated.next({
          moneyEntries: [...this.moneyEntries],
        });
      });
  }

  getMoneyTotalCount(createdById: string) {
    return this.http.get<{ moneyTotalCount: number }>(
      MONEY_BACK_END_URL + 'money-count/' + createdById
    );
  }

  getMoney(id: string) {
    return this.http.get<{
      _id: string;
      description: string;
      moneyType: string;
      amount: number;
      note: string;
      createdBy: string;
    }>(MONEY_BACK_END_URL + 'money/' + id);
  }

  getMoneyInfo(createdById: string) {
    return this.http.get<{
      moneyInTheBank: number;
      moneyInvested: number;
      moneyUnclaimed: number;
      moneyOther: number;
      moneyInChecking: number;
      moneyInSavings: number;
      moneyInRrsp: number;
      moneyInTfsa: number;
      moneyCash: number;
      moneyGiftCard: number;
    }>(MONEY_BACK_END_URL + 'money-infoByOwner/' + createdById);
  }

  updateMoney(
    id: string,
    description: string,
    moneyType: string,
    amount: number,
    note: string
  ) {
    const moneyData: Money = {
      id: id,
      description: description,
      moneyType: moneyType,
      amount: amount,
      note: note,
      createdById: '',
    };
    this.http
      .patch<{ message: string }>(
        MONEY_BACK_END_URL + 'update-money/' + id,
        moneyData
      )
      .subscribe(
        () => {
          this.router.navigate(['/money']);
        },
        (error) => {
          console.log(error);
          this.moneyStatusListener.next(true);
        }
      );
  }

  deleteMoney(id: string) {
    this.http
      .delete<{ message: string }>(MONEY_BACK_END_URL + 'money/' + id)
      .subscribe(
        () => {
          this.router.navigate(['/money']);
        },
        (error) => {
          console.log(error);
          this.moneyStatusListener.next(true);
        }
      );
  }
}
