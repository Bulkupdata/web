import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import SpinnerLoader from "../../Components/SpinnerLoader/SpinnerLoader";
import { getTransactionDetails } from "../../redux/Reloadly/Index";
import { AppDispatch } from "../../redux/store";

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

const DashboardAnalytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(500);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [operators, setOperators] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>("");

  console.log(setSelectedOperatorId, hasMore);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const countryCode = "NG";

    const params: {
      size: number;
      page: number;
      operatorId?: string;
      countryCode: string;
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
        const fetchedTransactions: Transaction[] = response.content || [];
        setTransactions(fetchedTransactions);
        setHasMore(fetchedTransactions.length === pageSize);
        setLoading(false);

        if (operators.length === 0 && fetchedTransactions.length > 0) {
          const uniqueOperators = new Map<
            number,
            { id: number; name: string }
          >();
          fetchedTransactions.forEach((tx: Transaction) => {
            if (!uniqueOperators.has(tx.operatorId)) {
              uniqueOperators.set(tx.operatorId, {
                id: tx.operatorId,
                name: tx.operatorName,
              });
            }
          });
          setOperators(Array.from(uniqueOperators.values()));
        }
      })
      .catch((err: any) => {
        setError(err.message || "Failed to fetch transactions for analytics.");
        setLoading(false);
      });
  }, [dispatch, currentPage, pageSize, selectedOperatorId]);

  const analyticsData = useMemo(() => {
    if (transactions.length === 0) {
      return {
        successfulCount: 0,
        pendingCount: 0,
        failedCount: 0,
        topOperator: { name: "N/A", count: 0 },
        dailyAverageTopups: [],
        avgDaily24Hrs: 0,
        avgDaily48Hrs: 0,
        avgLast7Days: 0,
        avgPrev7Days: 0,
        diff7Days: 0,
        avgLast14Days: 0,
        avgPrev14Days: 0,
        diff14Days: 0,
        avgLast30Days: 0,
        avgPrev30Days: 0,
        diff30Days: 0,
        avgLast60Days: 0,
        avgPrev60Days: 0,
        diff60Days: 0,
        avgLast90Days: 0,
        avgPrev90Days: 0,
        diff90Days: 0,
        avgLast180Days: 0,
        avgPrev180Days: 0,
        diff180Days: 0,
        avgLast365Days: 0,
        avgPrev365Days: 0,
        diff365Days: 0,
        sortedOperators: [],
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const successfulTransactions = transactions.filter(
      (tx) => tx.status === "SUCCESSFUL"
    );
    const pendingTransactions = transactions.filter(
      (tx) => tx.status === "PENDING"
    );
    const failedTransactions = transactions.filter(
      (tx) => tx.status === "FAILED"
    );

    const successfulCount = successfulTransactions.length;
    const pendingCount = pendingTransactions.length;
    const failedCount = failedTransactions.length;

    const operatorCounts: { [key: string]: number } = {};
    successfulTransactions.forEach((tx) => {
      operatorCounts[tx.operatorName] =
        (operatorCounts[tx.operatorName] || 0) + 1;
    });
    const sortedOperators = Object.entries(operatorCounts).sort(
      ([, countA], [, countB]) => countB - countA
    );
    const topOperator =
      sortedOperators.length > 0
        ? { name: sortedOperators[0][0], count: sortedOperators[0][1] }
        : { name: "N/A", count: 0 };

    const dailyAmounts: { [key: string]: { total: number; count: number } } =
      {};
    successfulTransactions.forEach((tx) => {
      const dateKey = new Date(tx.transactionDate).toISOString().split("T")[0];
      if (!dailyAmounts[dateKey]) {
        dailyAmounts[dateKey] = { total: 0, count: 0 };
      }
      dailyAmounts[dateKey].total += tx.requestedAmount;
      dailyAmounts[dateKey].count++;
    });

    const dailyAverageTopups = Object.entries(dailyAmounts)
      .map(([date, data]) => ({
        date: date,
        averageAmount:
          data.count > 0 ? parseFloat((data.total / data.count).toFixed(2)) : 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const calculateAverageForPeriod = (
      daysToSubtractStart: number,
      daysToSubtractEnd: number,
      targetStatus: string = "SUCCESSFUL"
    ): number => {
      const endDate = new Date(today);
      endDate.setDate(today.getDate() - daysToSubtractEnd);
      endDate.setHours(23, 59, 59, 999);

      const startDate = new Date(today);
      startDate.setDate(today.getDate() - daysToSubtractStart);
      startDate.setHours(0, 0, 0, 0);

      const relevantTransactions = transactions.filter((tx) => {
        const txDate = new Date(tx.transactionDate);
        return (
          txDate >= startDate && txDate <= endDate && tx.status === targetStatus
        );
      });
      const totalAmount = relevantTransactions.reduce(
        (sum, tx) => sum + tx.requestedAmount,
        0
      );
      return relevantTransactions.length > 0
        ? parseFloat((totalAmount / relevantTransactions.length).toFixed(2))
        : 0;
    };

    const avgDaily24Hrs = calculateAverageForPeriod(0, 0);
    const avgDaily48Hrs = calculateAverageForPeriod(1, 0);
    const avgLast7Days = calculateAverageForPeriod(6, 0);
    const avgLast14Days = calculateAverageForPeriod(13, 0);
    const avgLast30Days = calculateAverageForPeriod(29, 0);
    const avgLast60Days = calculateAverageForPeriod(59, 0);
    const avgLast90Days = calculateAverageForPeriod(89, 0);
    const avgLast180Days = calculateAverageForPeriod(179, 0);
    const avgLast365Days = calculateAverageForPeriod(364, 0);

    const avgPrev7Days = calculateAverageForPeriod(13, 7);
    const avgPrev14Days = calculateAverageForPeriod(27, 14);
    const avgPrev30Days = calculateAverageForPeriod(59, 30);
    const avgPrev60Days = calculateAverageForPeriod(119, 60);
    const avgPrev90Days = calculateAverageForPeriod(179, 90);
    const avgPrev180Days = calculateAverageForPeriod(359, 180);
    const avgPrev365Days = calculateAverageForPeriod(729, 365);

    const diff7Days = parseFloat((avgLast7Days - avgPrev7Days).toFixed(2));
    const diff14Days = parseFloat((avgLast14Days - avgPrev14Days).toFixed(2));
    const diff30Days = parseFloat((avgLast30Days - avgPrev30Days).toFixed(2));
    const diff60Days = parseFloat((avgLast60Days - avgPrev60Days).toFixed(2));
    const diff90Days = parseFloat((avgLast90Days - avgPrev90Days).toFixed(2));
    const diff180Days = parseFloat(
      (avgLast180Days - avgPrev180Days).toFixed(2)
    );
    const diff365Days = parseFloat(
      (avgLast365Days - avgPrev365Days).toFixed(2)
    );

    return {
      successfulCount,
      pendingCount,
      failedCount,
      topOperator,
      dailyAverageTopups: dailyAverageTopups.slice(-60),
      avgDaily24Hrs,
      avgDaily48Hrs,
      avgLast7Days,
      avgPrev7Days,
      diff7Days,
      avgLast14Days,
      avgPrev14Days,
      diff14Days,
      avgLast30Days,
      avgPrev30Days,
      diff30Days,
      avgLast60Days,
      avgPrev60Days,
      diff60Days,
      avgLast90Days,
      avgPrev90Days,
      diff90Days,
      avgLast180Days,
      avgPrev180Days,
      diff180Days,
      avgLast365Days,
      avgPrev365Days,
      diff365Days,
      sortedOperators,
    };
  }, [transactions]);

  const formatCurrency = (
    amount: number,
    currencyCode: string = "NGN"
  ): string => {
    try {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (e) {
      return `${currencyCode} ${amount}`;
    }
  };

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
  const {
    successfulCount,
    pendingCount,
    failedCount,
    topOperator,
    dailyAverageTopups,
    avgDaily24Hrs,
    avgDaily48Hrs,
    avgLast7Days,
    diff7Days,
    avgLast14Days,
    diff14Days,
    avgLast30Days,
    diff30Days,
    avgLast60Days,
    diff60Days,
    avgLast90Days,
    diff90Days,
    avgLast180Days,
    diff180Days,
    avgLast365Days,
    diff365Days,
    sortedOperators,
  } = analyticsData;

  const handleOperatorChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOperatorId(event.target.value);
    setCurrentPage(0);
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="">
      <style>
        {`
             .loading-state,
             .error-state {
                 padding: 17px;
                 text-align: center;
                 font-size: 1.25rem;
                 color: #555;
                 display: flex;
                 align-items: center;
                 justify-content: center;
             }
   
             .error-state {
                 color: #dc3545;
             }

          .dashboard-container {
            padding: 25px;
            background-color: #f9f9f9;
            border-radius: 12px;
            color: #333;
            display: flex;
            flex-direction: column;
            gap: 25px;
          }

          .dashboard-header {
            font-size: 1.7rem;
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 700;
          }

          .filters-pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            gap: 15px;
            flex-wrap: wrap;
          }

          .filter-group {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .filter-label {
            font-size: 0.8rem;
            color: #555;
          }

          .operator-select {
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #ddd;
            font-size: 0.8rem;
            background-color: #fff;
            cursor: pointer;
            min-width: 150px;
          }

          .pagination-controls {
            display: flex;
            align-items: center;
            gap: 10px;
          }


          .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 12px;
      
          }

          .card {
            background-color: #ffffff;
            border-radius: 10px;
       
            padding: 16px;
            text-align: left; /* Updated to left */
            transition: transform 0.2s ease-in-out;
          
          }

     

          .card-title {
            font-size: 0.8rem;
            color: #555;
            margin-bottom: 10px;
            font-weight: 600;
          }

          .card-value {
            font-size: 1.4rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 5px;
          }

          .card-description {
            font-size: 0.6rem;
            color: #777;
          }

 
          .charts-section {
            display: grid;
            grid-template-columns: 1fr;
            gap: 25px;
            margin-bottom: 25px;
          }

          @media (min-width: 768px) {
            .charts-section {
              grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
            }
          }

          .chart-card {
            background-color: #ffffff;
            border-radius: 10px;
     
            padding: 20px;
          }

          .chart-title {
            font-size: 0.95rem;
            color: #333;
            margin-bottom: 15px;
            text-align: left; /* Updated to left */
            font-weight: 600;
          }

          .chart-container {
            width: 100%;
            height: 300px;
          }

          .analytics-loading-state,
          .analytics-error-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            font-size: 0.95rem;
            color: #555;
            text-align: center;
          }
          .analytics-error-state {
            color: #dc3545;
          }
          .analytics-loading-state p {
            margin-top: 15px;
          }



    
        `}
      </style>

      {/* <h1 className="dashboard-header">Top-Up Analytics Dashboard</h1> */}

      <br />

      <div className="filters-pagination">
        <div className="filter-group">
          <label htmlFor="operator-select" className="filter-label">
            Filter by Operator:
          </label>
          <select
            id="operator-select"
            className="operator-select"
            value={selectedOperatorId}
            onChange={handleOperatorChange}
          >
            <option value="">All Operators</option>
            {operators.map((op) => (
              <option key={op.id} value={op.id}>
                {op.name}
              </option>
            ))}
          </select>
        </div>
        <div className="pagination-controls">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="pagination-button"
          >
            Previous
          </button>
          <span>Page {currentPage + 1}</span>
          <button
            onClick={handleNextPage}
            disabled={!hasMore}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>

      <div className="cards-grid">
        <div className="card successful">
          <div className="card-title">Successful Top-ups</div>
          <div className="card-value">{successfulCount}</div>
          <div className="card-description">Total successful transactions</div>
        </div>
        <div className="card pending">
          <div className="card-title">Pending Top-ups</div>
          <div className="card-value">{pendingCount}</div>
          <div className="card-description">Total pending transactions</div>
        </div>
        <div className="card failed">
          <div className="card-title">Failed Top-ups</div>
          <div className="card-value">{failedCount}</div>
          <div className="card-description">Total failed transactions</div>
        </div>
        <div className="card info">
          <div className="card-title">Most Top-upped Operator</div>
          <div className="card-value">{topOperator.name}</div>
          <div className="card-description">
            {topOperator.count} successful transactions
          </div>
        </div>

        <div className={`card ${avgDaily24Hrs > 0 ? "positive" : "neutral"}`}>
          <div className="card-title">Avg Daily Top-up (24 Hrs)</div>
          <div className="card-value">{formatCurrency(avgDaily24Hrs)}</div>
          <div className="card-description">Average amount for today</div>
        </div>
        <div className={`card ${avgDaily48Hrs > 0 ? "positive" : "neutral"}`}>
          <div className="card-title">Avg Daily Top-up (48 Hrs)</div>
          <div className="card-value">{formatCurrency(avgDaily48Hrs)}</div>
          <div className="card-description">Average amount for last 2 days</div>
        </div>

        <div className={`card ${diff7Days >= 0 ? "positive" : "negative"}`}>
          <div className="card-title">Avg Daily Top-up (Last 7 Days)</div>
          <div className="card-value">{formatCurrency(avgLast7Days)}</div>
          <div className="card-description">
            vs previous 7 days: {formatCurrency(diff7Days)}
            {diff7Days > 0 ? " ▲" : diff7Days < 0 ? " ▼" : ""}
          </div>
        </div>
        <div className={`card ${diff14Days >= 0 ? "positive" : "negative"}`}>
          <div className="card-title">Avg Daily Top-up (Last 14 Days)</div>
          <div className="card-value">{formatCurrency(avgLast14Days)}</div>
          <div className="card-description">
            vs previous 14 days: {formatCurrency(diff14Days)}
            {diff14Days > 0 ? " ▲" : diff14Days < 0 ? " ▼" : ""}
          </div>
        </div>
        <div className={`card ${diff30Days >= 0 ? "positive" : "negative"}`}>
          <div className="card-title">Avg Daily Top-up (Last 30 Days)</div>
          <div className="card-value">{formatCurrency(avgLast30Days)}</div>
          <div className="card-description">
            vs previous 30 days: {formatCurrency(diff30Days)}
            {diff30Days > 0 ? " ▲" : diff30Days < 0 ? " ▼" : ""}
          </div>
        </div>
        <div className={`card ${diff60Days >= 0 ? "positive" : "negative"}`}>
          <div className="card-title">Avg Daily Top-up (Last 60 Days)</div>
          <div className="card-value">{formatCurrency(avgLast60Days)}</div>
          <div className="card-description">
            vs previous 60 days: {formatCurrency(diff60Days)}
            {diff60Days > 0 ? " ▲" : diff60Days < 0 ? " ▼" : ""}
          </div>
        </div>
        <div className={`card ${diff90Days >= 0 ? "positive" : "negative"}`}>
          <div className="card-title">Avg Daily Top-up (Last 90 Days)</div>
          <div className="card-value">{formatCurrency(avgLast90Days)}</div>
          <div className="card-description">
            vs previous 90 days: {formatCurrency(diff90Days)}
            {diff90Days > 0 ? " ▲" : diff90Days < 0 ? " ▼" : ""}
          </div>
        </div>
        <div className={`card ${diff180Days >= 0 ? "positive" : "negative"}`}>
          <div className="card-title">Avg Daily Top-up (Last 6 Months)</div>
          <div className="card-value">{formatCurrency(avgLast180Days)}</div>
          <div className="card-description">
            vs previous 6 months: {formatCurrency(diff180Days)}
            {diff180Days > 0 ? " ▲" : diff180Days < 0 ? " ▼" : ""}
          </div>
        </div>
        <div className={`card ${diff365Days >= 0 ? "positive" : "negative"}`}>
          <div className="card-title">Avg Daily Top-up (Last Year)</div>
          <div className="card-value">{formatCurrency(avgLast365Days)}</div>
          <div className="card-description">
            vs previous year: {formatCurrency(diff365Days)}
            {diff365Days > 0 ? " ▲" : diff365Days < 0 ? " ▼" : ""}
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3 className="chart-title">
            Daily Average Top-up Amount (Last 60 Days)
          </h3>
          <div className="chart-container">
            {dailyAverageTopups && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyAverageTopups}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(dateStr: string) =>
                      new Date(dateStr).toLocaleDateString("en-GB", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis
                    tickFormatter={(value: number) => formatCurrency(value, "")}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="averageAmount"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Average Amount"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            {dailyAverageTopups.length === 0 && (
              <p>No data available to display the chart.</p>
            )}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Top Operators by Transaction Count</h3>
          <div className="chart-container">
            {sortedOperators && sortedOperators.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedOperators.map(([name, count]) => ({
                    name,
                    count,
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#82ca9d"
                    name="Transaction Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No data available to display the chart.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
