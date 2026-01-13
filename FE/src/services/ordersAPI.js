// Orders API Service (kept for TripManagement integration)

const mockOrders = [
  {
    id: "ord1",
    tripId: "trip1",
    customerName: "Công ty ABC",
    address: "123 Đường Lê Lợi, Q1, TP.HCM",
    phone: "0901234567",
    status: "waiting",
    items: ["Hàng điện tử", "Máy tính"],
    weight: "50kg",
    value: "10,000,000 VNĐ",
    steps: [
      { key: "pickup", label: "Lấy hàng", done: true },
      { key: "gps", label: "Xác nhận GPS", done: false },
      { key: "phone", label: "Gọi điện xác nhận", done: false },
      { key: "delivery", label: "Giao hàng", done: false },
    ],
  },
  {
    id: "ord2",
    tripId: "trip1",
    customerName: "Cửa hàng XYZ",
    address: "456 Đường Nguyễn Huệ, Q1, TP.HCM",
    phone: "0907654321",
    status: "in_transit",
    items: ["Thực phẩm", "Đồ uống"],
    weight: "30kg",
    value: "5,000,000 VNĐ",
    steps: [
      { key: "pickup", label: "Lấy hàng", done: true },
      { key: "gps", label: "Xác nhận GPS", done: true },
      { key: "phone", label: "Gọi điện xác nhận", done: false },
      { key: "delivery", label: "Giao hàng", done: false },
    ],
  },
  {
    id: "ord3",
    tripId: "trip2",
    customerName: "Nhà hàng DEF",
    address: "789 Đường Pasteur, Q3, TP.HCM",
    phone: "0912345678",
    status: "delivered",
    items: ["Nguyên liệu nấu ăn"],
    weight: "25kg",
    value: "3,000,000 VNĐ",
    steps: [
      { key: "pickup", label: "Lấy hàng", done: true },
      { key: "gps", label: "Xác nhận GPS", done: true },
      { key: "phone", label: "Gọi điện xác nhận", done: true },
      { key: "delivery", label: "Giao hàng", done: true },
    ],
  },
];

export const getOrders = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockOrders), 300);
  });
};

export const confirmOrderStep = (orderId, stepKey) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = mockOrders.find((o) => o.id === orderId);
      if (!order) {
        resolve(null);
        return;
      }

      const step = order.steps.find((s) => s.key === stepKey);
      if (step) {
        step.done = true;
      }

      // Update status based on completed steps
      const allDone = order.steps.every((s) => s.done);
      if (allDone) {
        order.status = "delivered";
      } else if (order.steps.some((s) => s.done)) {
        order.status = "in_transit";
      }

      resolve(order);
    }, 500);
  });
};
