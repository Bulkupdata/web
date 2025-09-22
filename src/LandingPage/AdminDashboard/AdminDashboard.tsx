import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  format,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  isWithinInterval,
} from "date-fns";
import "./AdminDashboard.css";
import { BaseUrl } from "../../redux/baseurl";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import TransactionsTable from "./TransactionsTable";
import SpinnerLoader from "../../Components/SpinnerLoader/SpinnerLoader";
import DashboardAnalytics from "./DashboardAnalytics";

interface Recharge {
  createdAt: string;
  network?: string;
  amount?: number;
}

interface Balance {
  currency: string;
  balance: number;
}

interface ChartDataItem {
  name: string;
  value: number;
}

interface DailyRechargeItem {
  date: string;
  amount: number;
}

interface StatsTimeframe {
  totalAmount: number;
  totalCount: number;
}

interface ProcessedRecharges {
  networkDistribution: ChartDataItem[];
  dailyRecharges: DailyRechargeItem[];
  stats: { [key: string]: StatsTimeframe };
}

const API_URL = `${BaseUrl}/api/reloadly`;

const calculateStatsForTimeframe = (
  recharges: Recharge[],
  startDate: Date,
  endDate: Date
): StatsTimeframe => {
  const filtered = recharges.filter((recharge) => {
    const createdAt = new Date(recharge.createdAt);
    return isWithinInterval(createdAt, { start: startDate, end: endDate });
  });

  const totalAmount = filtered.reduce(
    (sum, recharge) => sum + (recharge.amount || 0),
    0
  );
  const totalCount = filtered.length;

  return { totalAmount, totalCount };
};

const AdminDashboard = () => {
  // Get admin name from localStorage on initial render
  const adminName = localStorage.getItem("bulkup_data_admin_name");

  // Function to handle logout by clearing specific localStorage items
  const onLogout = () => {
    localStorage.removeItem("bulkup_data_isAdmintrue");
    localStorage.removeItem("bulkup_data_admin_token");
    localStorage.removeItem("bulkup_data_admin_userId");
    localStorage.removeItem("bulkup_data_admin_name");
    // In a real application, you'd likely want to trigger a state change or redirect
    window.location.href = "/admin"; // Example redirection
    console.log("Logged out: Local storage cleared.");
  };

  const [balance, setBalance] = useState<Balance | null>(null);
  const [allRecharges, setAllRecharges] = useState<Recharge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<string>("last_24_hours");
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [showRechargeAmount, setShowRechargeAmount] = useState<boolean>(true);

  // Get admin name from localStorage on initial render
  const adminNameFromLocalStorage = localStorage.getItem(
    "bulkup_data_admin_name"
  );

  const timeframeOptions = useMemo(
    () => [
      { value: "last_24_hours", label: "Last 24 Hours" },
      { value: "last_48_hours", label: "Last 48 Hours" },
      { value: "last_72_hours", label: "Last 72 Hours" },
      { value: "last_1_week", label: "Last 1 Week" },
      { value: "last_2_weeks", label: "Last 2 Weeks" },
      { value: "last_4_weeks", label: "Last 4 Weeks" },
      { value: "last_1_month", label: "Last 1 Month" },
      { value: "last_2_months", label: "Last 2 Months" },
      { value: "last_3_months", label: "Last 3 Months" },
      { value: "last_6_months", label: "Last 6 Months" },
      { value: "last_1_year", label: "Last 1 Year" },
      { value: "last_2_years", label: "Last 2 Years" },
      { value: "all_time", label: "All Time" },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const balanceResponse = await axios.get<Balance>(`${API_URL}/balance`);
        setBalance(balanceResponse.data);

        const rechargesResponse = await axios.get<{ data: Recharge[] }>(
          `${API_URL}/recharges/all`
        );
        setAllRecharges(rechargesResponse.data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const processedRecharges = useMemo<ProcessedRecharges>(() => {
    if (!allRecharges || allRecharges.length === 0)
      return {
        networkDistribution: [],
        dailyRecharges: [],
        stats: {},
      };

    const networkCounts: { [key: string]: number } = {};
    const dailyDataMap = new Map<string, number>();

    allRecharges.forEach((recharge) => {
      const network = recharge.network || "Unknown";
      networkCounts[network] = (networkCounts[network] || 0) + 1;

      const date = format(new Date(recharge.createdAt), "yyyy-MM-dd");
      dailyDataMap.set(
        date,
        (dailyDataMap.get(date) || 0) + (recharge.amount || 0)
      );
    });

    const networkDistribution: ChartDataItem[] = Object.keys(networkCounts).map(
      (network) => ({
        name: network,
        value: networkCounts[network],
      })
    );

    const dailyRecharges: DailyRechargeItem[] = Array.from(dailyDataMap)
      .map(([date, amount]) => ({
        date,
        amount,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const now = new Date();
    const stats: { [key: string]: StatsTimeframe } = {
      last_24_hours: calculateStatsForTimeframe(
        allRecharges,
        subDays(now, 1),
        now
      ),
      last_48_hours: calculateStatsForTimeframe(
        allRecharges,
        subDays(now, 2),
        now
      ),
      last_72_hours: calculateStatsForTimeframe(
        allRecharges,
        subDays(now, 3),
        now
      ),
      last_1_week: calculateStatsForTimeframe(
        allRecharges,
        subWeeks(now, 1),
        now
      ),
      last_2_weeks: calculateStatsForTimeframe(
        allRecharges,
        subWeeks(now, 2),
        now
      ),
      last_4_weeks: calculateStatsForTimeframe(
        allRecharges,
        subWeeks(now, 4),
        now
      ),
      last_1_month: calculateStatsForTimeframe(
        allRecharges,
        subMonths(now, 1),
        now
      ),
      last_2_months: calculateStatsForTimeframe(
        allRecharges,
        subMonths(now, 2),
        now
      ),
      last_3_months: calculateStatsForTimeframe(
        allRecharges,
        subMonths(now, 3),
        now
      ),
      last_6_months: calculateStatsForTimeframe(
        allRecharges,
        subMonths(now, 6),
        now
      ),
      last_1_year: calculateStatsForTimeframe(
        allRecharges,
        subYears(now, 1),
        now
      ),
      last_2_years: calculateStatsForTimeframe(
        allRecharges,
        subYears(now, 2),
        now
      ),
      all_time: calculateStatsForTimeframe(allRecharges, new Date(0), now),
    };

    return { networkDistribution, dailyRecharges, stats };
  }, [allRecharges]);

  const { stats } = processedRecharges;

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading)
    return (
      <div className="dashboard-loading-container">
        <SpinnerLoader />{" "}
      </div>
    );
  if (error)
    return <div className="dashboard-error-container">Error: {error}</div>;

  return (
    <div className="dashboard-containers" style={{ marginTop: 32 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 0,
          }}
        >
  
          <h1 className="dashboard-title" style={{ margin: 0, padding: 0 }}>
            Welcome{" "}
            {adminName || adminNameFromLocalStorage
              ? adminName || adminNameFromLocalStorage
              : "Admin"}
            !
          </h1>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            border: "1px solid #66666666",
            borderRadius: "6px",
            backgroundColor: "transparent",
            color: "#666",
            fontSize: "14px",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          marginTop: -24,
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 16,
          marginBottom: 32,
        }}
      >
        <h2 className="card-title">Reloadly Account Balance</h2>
        <div className="card-content">
          <div className="recharge-card-value-container">
            <p className="balance-amount">
              {showBalance
                ? balance
                  ? formatAmount(balance.balance)
                  : "N/A"
                : "****"}
            </p>
            <span
              className="balance-toggle-icon"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? (
                <AiOutlineEyeInvisible color="#666" fontSize={16} />
              ) : (
                <AiOutlineEye color="#666" fontSize={16} />
              )}
            </span>
          </div>
        </div>
      </div>

      {/* <h2 className="recharge-stats-title card-title">Recharge Statistics</h2>
      <div className="timeframe-buttons">
        {timeframeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedTimeframe(option.value)}
            className={`timeframe-button ${
              selectedTimeframe === option.value ? "active" : ""
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="recharge-cards-grid">
        {selectedTimeframe && stats[selectedTimeframe] && (
          <>
            <div
              className="recharge-card card green"
              style={{ border: "none" }}
            >
              <h3 className="recharge-card-heading">Total recharges</h3>
              <p className="recharge-card-value">
                {stats[selectedTimeframe].totalCount.toLocaleString()}
              </p>
              <div className="recharge-card-description">
                Number of top-ups made.
              </div>
            </div>
            <div
              className="recharge-card card purple"
              style={{ border: "none" }}
            >
              <h3 className="recharge-card-heading">Total recharge amount</h3>
              <div className="recharge-card-value-container">
                <p className="recharge-card-value">
                  {showRechargeAmount
                    ? formatAmount(stats[selectedTimeframe].totalAmount)
                    : "****"}
                </p>
                <span
                  className="balance-toggle-icon"
                  onClick={() => setShowRechargeAmount(!showRechargeAmount)}
                >
                  {showRechargeAmount ? (
                    <AiOutlineEyeInvisible color="#fff" fontSize={16} />
                  ) : (
                    <AiOutlineEye color="#fff" fontSize={16} />
                  )}
                </span>
              </div>
              <div className="recharge-card-description">
                Sum of all top-up amounts.
              </div>
            </div>
          </>
        )}
      </div> */}

      <DashboardAnalytics />
      <TransactionsTable />
    </div>
  );
};

export default AdminDashboard;
