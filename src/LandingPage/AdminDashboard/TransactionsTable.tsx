import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { getTransactionDetails } from "../../redux/Reloadly/Index";
import SpinnerLoader from "../../Components/SpinnerLoader/SpinnerLoader";

interface BalanceInfo {
  oldBalance: number;
  newBalance: number;
  cost: number;
  currencyCode: string;
  currencyName: string;
  updatedAt: string;
}

interface Transaction {
  transactionId: number;
  status: string;
  operatorTransactionId: string | null;
  customIdentifier: string | null;
  recipientPhone: string;
  recipientEmail: string | null;
  senderPhone: string;
  countryCode: string;
  operatorId: number;
  operatorName: string;
  discount: number;
  discountCurrencyCode: string;
  requestedAmount: number;
  requestedAmountCurrencyCode: string;
  deliveredAmount: number;
  deliveredAmountCurrencyCode: string;
  transactionDate: string;
  pinDetail: string | null;
  fee: number;
  balanceInfo: BalanceInfo;
}

const TransactionsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [operators, setOperators] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    const countryCode = "NG";
    // Build the query parameters
    const params: {
      size: number;
      page: number;
      operatorId?: string;
      countryCode: any;
    } = {
      size: pageSize,
      page: currentPage,
      countryCode: countryCode,
    };
    if (selectedOperatorId) {
      params.operatorId = selectedOperatorId;
    }

    dispatch(getTransactionDetails(params))
      .unwrap()
      .then((response: any) => {
        const fetchedTransactions = response.content || [];
        setTransactions(fetchedTransactions);
        setHasMore(fetchedTransactions.length === pageSize);
        setLoading(false);

        // Populate operators from the fetched data if not already populated
        if (operators.length === 0) {
          const uniqueOperators = new Map();
          fetchedTransactions.forEach((tx: Transaction) => {
            if (!uniqueOperators.has(tx?.operatorId)) {
              uniqueOperators.set(tx?.operatorId, {
                id: tx?.operatorId,
                name: tx?.operatorName,
              });
            }
          });
          setOperators(Array.from(uniqueOperators.values()));
        }
      })
      .catch((err: any) => {
        setError(err.message || "Failed to fetch transactions.");
        setLoading(false);
      });
  }, [dispatch, currentPage, pageSize, selectedOperatorId]);

  const formatCurrency = (amount: number, currencyCode: string): string => {
    try {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (e) {
      console.warn(
        `Could not format currency for ${amount} ${currencyCode}`,
        e
      );
      return `${currencyCode} ${amount}`;
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      console.warn(`Could not format date for ${dateString}`, e);
      return dateString;
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOperatorId(event.target.value);
    setCurrentPage(0); // Reset to the first page when a new filter is applied
  };

  console.log(transactions, "transactions");
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          textAlign: "center",
        }}
      >
        <SpinnerLoader size="large" color="#FFDB1B" />
        <p style={{ marginTop: "10px", fontSize: "16px", color: "#333" }}>
          Loading analytics data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "16px", color: "red" }}>Error: {error}</p>
      </div>
    );
  }
  return (
    <div className="transactions-table-container">
      <style>
        {`
          .transactions-table-container {
              padding: 17px;
              background-color: #fff;
              border-radius: 9px;

              margin: 17px auto;
              max-width: 1197px;
              font-family: 'inter', sans-serif;
          }

          .table-heading {
              font-size: 1.25rem;
              color: #333;
              margin-bottom: 17px;
              text-align: center;
          }

          .table-controls {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 15px;
              padding-right: 10px;
          }

          .operator-filter-label {
              font-size: 0.95rem;
              margin-right: 10px;
              color: #555;
          }

          .operator-filter-select {
              padding: 5px 8px;
              border-radius: 5px;
              border: 1px solid #ccc;
              font-size: 0.95rem;
          }

          .table-wrapper {
              overflow-x: auto;
              margin-bottom: 17px;
              border-radius: 5px;
          }

          .transactions-table {
              width: 100%;
              border-collapse: collapse;
              min-width: 797px;
          }

          .transactions-table th,
          .transactions-table td {
              padding: 9px 12px;
              border: 1px solid #ddd;
              text-align: left;
              font-size: 0.85rem;
          }

          .transactions-table th {
              background-color: #000;
              color: #FFDB1B;
              font-weight: 500;
              font-size: 0.95rem;
              position: sticky;
              top: 0;
              z-index: 1;
          }

          .transactions-table tbody tr:nth-child(even) {
              background-color: #fff;
          }

          .transactions-table tbody tr:hover {
              background-color: #e9e9e9;
              cursor: pointer;
          }

          .status-badge {
              padding: 2px 7px;
              border-radius: 9999px;
              font-size: 0.75rem;
              font-weight: 500;
              color: white;
              text-transform: capitalize;
          }

          .status-badge.successful {
              background-color: #28a745;
          }

          .status-badge.failed {
              background-color: #dc3545;
          }

          .status-badge.pending {
              background-color: #ffc107;
          }

          .no-data {
              text-align: center;
              padding: 17px;
              color: #777;
              font-style: italic;
              font-size: 0.95rem;
          }


          .page-info {
              font-size: 0.95rem;
              color: #555;
          }

          .loading-state,
          .error-state {
              padding: 17px;
              text-align: center;
              font-size: 1.25rem;
              color: #555;
          }

          .error-state {
              color: #dc3545;
          }
        `}
      </style>
      <h2 className="table-heading">Transaction History</h2>
      <div className="table-controls">
        <label htmlFor="operator-filter" className="operator-filter-label">
          Filter by Operator:
        </label>
        <select
          id="operator-filter"
          className="operator-filter-select"
          onChange={handleFilterChange}
          value={selectedOperatorId}
        >
          <option value="">All Operators</option>
          {operators.map((operator) => (
            <option key={operator.id} value={operator.id}>
              {operator.name}
            </option>
          ))}
        </select>
      </div>
      <div className="table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Recipient Phone</th>
              <th>Operator Name</th>
              <th>Requested Amount</th>
              <th>Delivered Amount</th>
              <th>Cost</th>
              <th>Transaction Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && !loading ? (
              <tr>
                <td colSpan={8} className="no-data">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions
                ?.slice()
                ?.reverse()
                ?.map((tx) => (
                  <tr key={tx?.transactionId}>
                    <td>{tx?.transactionId}</td>
                    <td>
                      <span
                        className={`status-badge ${tx?.status.toLowerCase()}`}
                      >
                        {tx?.status}
                      </span>
                    </td>
                    <td>{tx?.recipientPhone}</td>
                    <td>{tx?.operatorName}</td>
                    <td>
                      {formatCurrency(
                        tx?.requestedAmount,
                        tx?.requestedAmountCurrencyCode
                      )}
                    </td>
                    <td>
                      {formatCurrency(
                        tx?.deliveredAmount,
                        tx?.deliveredAmountCurrencyCode
                      )}
                    </td>
                    <td>
                      {tx?.balanceInfo
                        ? formatCurrency(
                            tx?.balanceInfo?.cost,
                            tx?.balanceInfo?.currencyCode
                          )
                        : "N/A" // Display "N/A" or another placeholder if balanceInfo is null
                      }
                    </td>
                    <td>{formatDate(tx?.transactionDate)}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="page-info">Page {currentPage + 1}</span>
        <button
          onClick={handleNextPage}
          disabled={!hasMore}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
