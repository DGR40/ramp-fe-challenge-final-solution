import {
  PaginatedRequestParams,
  PaginatedResponse,
  RequestByEmployeeParams,
  SetTransactionApprovalParams,
  Transaction,
  Employee,
} from "./types";

const TRANSACTIONS_PER_PAGE = 5;

// returns data from localStorage
function getData() {
  return JSON.parse(localStorage.getItem("data"));
}

export const getEmployees = (): Employee[] => {
  const data = getData();
  return data.employees;
};

export const getTransactionsPaginated = ({
  page,
}: PaginatedRequestParams): PaginatedResponse<Transaction[]> => {
  if (page === null) {
    throw new Error("Page cannot be null");
  }
  const data = getData();

  const start = page * TRANSACTIONS_PER_PAGE;
  const end = start + TRANSACTIONS_PER_PAGE;

  if (start > data.transactions.length) {
    throw new Error(`Invalid page ${page}`);
  }

  const nextPage = end < data.transactions.length ? page + 1 : null;

  return {
    nextPage,
    data: data.transactions.slice(start, end),
  };
};

export const getTransactionsByEmployee = ({
  employeeId,
}: RequestByEmployeeParams) => {
  const data = getData();

  if (!employeeId) {
    throw new Error("Employee id cannot be empty");
  }

  return data.transactions.filter(
    (transaction) => transaction.employee.id === employeeId
  );
};

export const setTransactionApproval = ({
  transactionId,
  value,
}: SetTransactionApprovalParams): void => {
  const data = getData();
  const transaction = data.transactions.find(
    (currentTransaction) => currentTransaction.id === transactionId
  );

  if (!transaction) {
    throw new Error("Invalid transaction to approve");
  }
  transaction.approved = value;

  // store into local localStorage
  const updatedTransactions = data.transactions.map((t) => {
    if (t.id === transactionId) {
      return { ...t, approved: value };
    } else {
      return t;
    }
  });

  const updatedData = {
    ...data,
    transactions: updatedTransactions,
  };

  localStorage.setItem("data", JSON.stringify(updatedData));
};
