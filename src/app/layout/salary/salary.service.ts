import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Salary } from './salary.model';

const SALARY_BACK_END_URL = environment.apiUrl + '/salary/';

@Injectable({ providedIn: 'root' })
export class SalaryService {
  private salaryEntries: Salary[] = [];
  private salaryUpdated = new Subject<{
    salaryEntries: Salary[];
  }>();
  private salaryStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getSalaryUpdateListener() {
    return this.salaryUpdated.asObservable();
  }

  getSalaryStatusListener() {
    return this.salaryStatusListener.asObservable();
  }

  createSalary(
    description: string,
    salaryType: string,
    amount: number,
    note: string,
    createdById: string
  ) {
    const salaryData: Salary = {
      id: '',
      description,
      salaryType,
      amount,
      note,
      createdById,
    };
    this.http
      .post<{ message: string }>(SALARY_BACK_END_URL + 'salary', salaryData)
      .subscribe(
        () => {
          this.router.navigate(['/salary']);
        },
        (error) => {
          console.log(error);
          this.salaryStatusListener.next(true);
        }
      );
  }

  getSalaryEntries(
    salaryEntriesPerPage: number,
    currentPage: number,
    createdById: string
  ) {
    const queryParams = `?pageSize=${salaryEntriesPerPage}&page=${currentPage}&createdById=${createdById}`;
    this.http
      .get<{ message: string; salaryEntries: any }>(
        SALARY_BACK_END_URL + 'salary' + queryParams
      )
      .pipe(
        map((salaryData) => {
          return {
            salaryEntries: salaryData.salaryEntries.map((salary) => {
              return {
                id: salary._id,
                description: salary.description,
                salaryType: salary.salaryType,
                amount: salary.amount,
                note: salary.note,
                createdById: salary.createdById,
              };
            }),
          };
        })
      )
      .subscribe((transformedSalaryData) => {
        this.salaryEntries = transformedSalaryData.salaryEntries;
        this.salaryUpdated.next({
          salaryEntries: [...this.salaryEntries],
        });
      });
  }

  getSalaryTotalCount(createdById: string) {
    return this.http.get<{ salaryTotalCount: number }>(
      SALARY_BACK_END_URL + 'salary-count/' + createdById
    );
  }

  getSalaryById(id: string) {
    return this.http.get<{
      _id: string;
      description: string;
      salaryType: string;
      amount: number;
      note: string;
      createdBy: string;
    }>(SALARY_BACK_END_URL + 'salary/' + id);
  }

  getMonthlySalary(createdById: string) {
    return this.http.get<{ monthlySalaryAmount: number }>(
      SALARY_BACK_END_URL + 'monthly-salary/' + createdById
    );
  }

  updateSalary(
    id: string,
    description: string,
    salaryType: string,
    amount: number,
    note: string
  ) {
    const salaryData: Salary = {
      id,
      description,
      salaryType,
      amount,
      note,
      createdById: '',
    };
    this.http
      .patch<{ message: string }>(
        SALARY_BACK_END_URL + 'update-salary',
        salaryData
      )
      .subscribe(
        () => {
          this.router.navigate(['/salary']);
        },
        (error) => {
          console.log(error);
          this.salaryStatusListener.next(true);
        }
      );
  }

  deleteSalary(id: string) {
    this.http
      .delete<{ message: string }>(SALARY_BACK_END_URL + 'salary/' + id)
      .subscribe(
        () => {
          this.router.navigate(['/salary']);
        },
        (error) => {
          console.log(error);
          this.salaryStatusListener.next(true);
        }
      );
  }
}
