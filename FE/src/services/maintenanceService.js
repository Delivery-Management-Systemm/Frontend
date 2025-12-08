// Mock data và service cho quản lý bảo dưỡng

export const mockMaintenanceRecords = [
  {
    id: 1,
    vehicle: "29A-12345",
    type: "Bảo dưỡng định kỳ",
    description: "Thay dầu máy, lọc gió, kiểm tra phanh",
    scheduledDate: "15/01/2025",
    completedDate: null,
    cost: "45.000 km",
    status: "scheduled",
  },
  {
    id: 2,
    vehicle: "30B-98765",
    type: "Sửa chữa",
    description: "Thay lốp trước bên phải",
    scheduledDate: "20/11/2024",
    completedDate: "21/11/2024",
    cost: "2.5M",
    status: "completed",
  },
  {
    id: 3,
    vehicle: "29A-54321",
    type: "Bảo dưỡng định kỳ",
    description: "Bảo dưỡng 70.000km",
    scheduledDate: "05/12/2024",
    completedDate: null,
    cost: "66.000 km",
    status: "overdue",
  },
  {
    id: 4,
    vehicle: "51F-11111",
    type: "Kiểm tra an toàn",
    description: "Kiểm tra hệ thống phanh và đèn",
    scheduledDate: "28/11/2024",
    completedDate: null,
    cost: "80.000 km",
    status: "in-progress",
  },
  {
    id: 5,
    vehicle: "30D-33333",
    type: "Bảo dưỡng định kỳ",
    description: "Thay dầu và vệ sinh",
    scheduledDate: "18/11/2024",
    completedDate: "18/11/2024",
    cost: "1.8M",
    status: "completed",
  },
];

export const getMaintenanceStats = () => ({
  scheduled: 1,
  inProgress: 1,
  completed: 2,
  overdue: 1,
});

export const getMaintenanceRecords = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMaintenanceRecords), 300);
  });
};
