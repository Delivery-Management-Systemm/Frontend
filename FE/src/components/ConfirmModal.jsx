import React from "react";
import "./ConfirmModal.css";

export default function ConfirmModal({ open, title = "Xác nhận", message = "", onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true">
      <div className="confirm-container">
        <div className="confirm-title">{title}</div>
        <div className="confirm-message">{message}</div>
        <div className="confirm-actions">
          <button className="btn btn-cancel" onClick={onCancel}>Hủy</button>
          <button className="btn btn-confirm" onClick={onConfirm}>Xóa</button>
        </div>
      </div>
    </div>
  );
}


