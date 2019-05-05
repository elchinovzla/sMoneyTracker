export interface Expense {
  id: string,
  description: string,
  expenseType: string,
  amount: number,
  date: Date,
  savingsId: string,
  note: string,
  createdById: string
}
