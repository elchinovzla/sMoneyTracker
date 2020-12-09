export interface YearlyBalance {
  id: string;
  description: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  note: string;
  createdById: string;
}
