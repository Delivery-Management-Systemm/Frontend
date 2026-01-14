import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaUser } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Users.css";
import Pagination from "../components/Pagination";
import CustomSelect from "../components/CustomSelect";
import UserEditModal from "../components/UserEditModal";
import userAPI from "../services/userAPI";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);

  // Options state
  const [roleOptions, setRoleOptions] = useState([]);

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Filter state
  const [filters, setFilters] = useState({
    role: "",
    department: "",
  });

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Load users from API
  useEffect(() => {
    loadUsers();
  }, [pagination.currentPage, pagination.pageSize, filters]);

  // Load options on mount
  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const roles = await userAPI.getUserRoles();
      setRoleOptions([{ value: "", label: "Tất cả vai trò" }, ...roles]);
    } catch (err) {
      console.error("Error loading options:", err);
    }
  };

  const loadUsers = async () => {
    try {
      setTableLoading(true);

      console.log("Loading users...");
      console.log("Filters:", filters);
      console.log("Pagination:", pagination);

      const usersData = await userAPI.getAllUsers({
        pageNumber: pagination.currentPage,
        pageSize: pagination.pageSize,
        role: filters.role,
        department: filters.department,
      });

      console.log("Users data received:", usersData);

      // Handle different response structures
      const usersList = usersData.objects || usersData.items || usersData || [];
      console.log("Users list:", usersList);

      setUsers(Array.isArray(usersList) ? usersList : []);
      setPagination((prev) => ({
        ...prev,
        totalItems: usersData.total || usersList.length || 0,
        totalPages: Math.ceil(
          (usersData.total || usersList.length || 0) / prev.pageSize
        ),
      }));

      setError(null);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      setUsers([]);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      return;
    }

    try {
      await userAPI.deleteUser(userId);
      await loadUsers();
      toast.success("Xóa tài khoản thành công!");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Không thể xóa tài khoản. Vui lòng thử lại.");
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (userData) => {
    try {
      await userAPI.updateUser(selectedUser.userID, userData);
      await loadUsers();
      setShowEditModal(false);
      setSelectedUser(null);
      toast.success("Cập nhật tài khoản thành công!");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Không thể cập nhật tài khoản. Vui lòng thử lại.");
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      currentPage: 1,
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const stats = {
    total: users.length,
    admin: users.filter((u) => u.role === "Admin").length,
    manager: users.filter((u) => u.role === "Manager").length,
    user: users.filter((u) => u.role === "User" || !u.role).length,
  };

  if (loading) {
    return (
      <div className="users-page">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            fontSize: "24px",
            color: "#3b82f6",
          }}
        >
          <div className="line-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-header-simple">
        <div>
          <div className="users-header-title">Quản lý tài khoản</div>
          <div className="users-header-subtitle">
            Quản lý người dùng trong hệ thống
          </div>
        </div>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            background: "#fee",
            color: "#c33",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            border: "1px solid #fcc",
          }}
        >
          {error}
        </div>
      )}

      <div className="users-stats-row">
        <div className="user-stat">
          <div className="user-stat-label">Tổng số</div>
          <div className="user-stat-value">{stats.total}</div>
        </div>
        <div className="user-stat">
          <div className="user-stat-label">Admin</div>
          <div className="user-stat-value">{stats.admin}</div>
        </div>
        <div className="user-stat">
          <div className="user-stat-label">Manager</div>
          <div className="user-stat-value">{stats.manager}</div>
        </div>
        <div className="user-stat">
          <div className="user-stat-label">User</div>
          <div className="user-stat-value">{stats.user}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="users-filters">
        <CustomSelect
          value={filters.role}
          onChange={(value) => handleFilterChange("role", value)}
          options={roleOptions}
          placeholder="Tất cả vai trò"
        />
      </div>

      <div className="users-list">
        <div className="users-table-card">
          <div className="users-table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Phòng ban</th>
                  <th>Ngày đăng ký</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <div className="line-spinner"></div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#6b7280",
                      }}
                    >
                      Không có người dùng nào
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.userID} className="users-tr">
                      <td className="users-td">
                        <div className="users-name-cell">
                          <div className="users-avatar">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.fullName} />
                            ) : (
                              <FaUser />
                            )}
                          </div>
                          <div className="users-name-text">{user.fullName}</div>
                        </div>
                      </td>
                      <td className="users-td">
                        <div className="users-email-text">{user.email}</div>
                      </td>
                      <td className="users-td">
                        <div className="users-phone-text">
                          {user.phone || "-"}
                        </div>
                      </td>
                      <td className="users-td">
                        <span
                          className={`users-role-badge ${
                            user.role === "Admin"
                              ? "role-admin"
                              : user.role === "Manager"
                              ? "role-manager"
                              : "role-user"
                          }`}
                        >
                          {user.role || "User"}
                        </span>
                      </td>
                      <td className="users-td">
                        <div className="users-dept-text">
                          {user.department || "-"}
                        </div>
                      </td>
                      <td className="users-td">
                        <div className="users-date-cell">
                          <div className="users-date-day">
                            {new Date(user.registeredAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                          <div className="users-date-time">
                            {new Date(user.registeredAt).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="users-td users-td-actions">
                        <div className="users-actions">
                          <button
                            className="users-icon-btn users-icon-edit"
                            title="Chỉnh sửa"
                            onClick={() => handleEditUser(user)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="users-icon-btn users-icon-delete"
                            title="Xóa"
                            onClick={() => handleDeleteUser(user.userID)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalItems > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {showEditModal && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={handleUpdateUser}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
