import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
      },
      {
        path: 'user',
        loadChildren: './user/user.module#UserModule',
      },
      {
        path: 'expense-estimator',
        loadChildren:
          './expense-estimator/expense-estimator.module#ExpenseEstimatorModule',
      },
      {
        path: 'income',
        loadChildren: './income/income.module#IncomeModule',
      },
      {
        path: 'money',
        loadChildren: './money/money.module#MoneyModule',
      },
      {
        path: 'savings',
        loadChildren: './savings/savings.module#SavingsModule',
      },
      {
        path: 'expense',
        loadChildren: './expense/expense.module#ExpenseModule',
      },
      {
        path: 'yearly-balance',
        loadChildren:
          './yearly-balance/yearly-balance.module#YearlyBalanceModule',
      },
      {
        path: 'salary',
        loadChildren: './salary/salary.module#SalaryModule',
      },
      {
        path: 'report',
        loadChildren: './report/report.module#ReportModule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
