import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { fetchUsersForAdmin } from "../../redux/Reloadly/adminSlice";
import "./AdminUsers.css";
import SpinnerLoader from "../../Components/SpinnerLoader/SpinnerLoader";
import { AppDispatch } from "../../redux/store";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

const AdminUsers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const sendMultipleMail = () => {
    if (selectedUsers.length > 0) {
      window.location.href = `mailto:${selectedUsers.join(",")}`;
    }
  };

  const toggleUserSelection = (email: string) => {
    setSelectedUsers((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  useEffect(() => {
    setLoading(true);
    dispatch(fetchUsersForAdmin())
      .unwrap()
      .then((data: any) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err);
        setLoading(false);
      });
  }, [dispatch]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="admin-users-page">
      <h2 className="admin-users-title">Bulk Users</h2>

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
          }}
        >
          <SpinnerLoader />
        </div>
      )}
      {error && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
          }}
        >
          <p className="error-text">Error: {error}</p>
        </div>
      )}

      {!loading && !error && users?.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
          }}
        >
          <p>No users found.</p>
        </div>
      )}

      {!loading && !error && users?.length > 0 && (
        <div className="table-wrapper">
          <button
            onClick={sendMultipleMail}
            disabled={selectedUsers.length === 0}
            className="send-multiple-btn"
            style={{ marginBottom: 32 }}
          >
            Send Multiple Mail
          </button>
          <br />
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      users.length > 0 && selectedUsers.length === users.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(users.map((user) => user.email));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Date Created</th> <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.email)}
                      onChange={() => toggleUserSelection(user.email)}
                    />
                  </td>
                  <td>
                    {user?.name
                      ?.toLowerCase()
                      ?.replace(/\b\w/g, (char) => char?.toUpperCase())}
                  </td>
                  <td>{user?.email}</td>
                  <td>{formatDate(user?.createdAt)}</td>
                  <td>
                    <button
                      onClick={() =>
                        (window.location.href = `mailto:${user.email}`)
                      }
                      className="send-btn"
                    >
                      Send Mail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
