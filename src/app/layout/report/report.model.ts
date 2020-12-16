export interface Report {
  totalIncome: number;
  totalOutcome: number;
  activities: [
    {
      date: Date;
      transactions: {
        [index: number]: {
          id: number;
          transactionDescription: string;
          transactionAmount: number;
          transactionType: string;
        };
      };
    }
  ];
}
