export interface Report {
  reportName: string;
  fromDate: Date;
  toDate: Date;
  totalIncome: number;
  totalOutcome: number;
  activities: Array<{
    date: Date;
    transactions: Array<{
      id: number;
      transactionDescription: string;
      transactionAmount: number;
      transactionType: string;
    }>;
  }>;
}
