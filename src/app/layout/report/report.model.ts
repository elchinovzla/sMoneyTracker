export interface Report {
  reportName: string;
  fromDate: Date;
  toDate: Date;
  totalIncome: number;
  totalOutcome: number;
  transactions: Array<{
    id: number;
    date: Date;
    transactionDescription: string;
    transactionAmount: number;
    transactionType: string;
  }>;
}
