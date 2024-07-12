import serverMastersData from "./serverMastersData.js";

const expenseTypes = serverMastersData.expenseTypes.map(
  (expense) => expense.expense_type
);

const rideCancelReasons = serverMastersData.rideCancelReasons.map(
  (reason) => reason.cancel_reason
);

const serverMastersDataValues = { expenseTypes, rideCancelReasons };

export default serverMastersDataValues;
