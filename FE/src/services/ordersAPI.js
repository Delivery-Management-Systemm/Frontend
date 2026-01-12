// Mock data va service cho quan ly don hang
const mockOrders = [
  {
    id: "ORD-2024-001",
    customer: "Cong ty TNHH ABC",
    contact: "0241234567",
    pickup: "Kho ABC, Q. Long Bien, Ha Noi",
    dropoff: "Cua hang XYZ, Q.1, TP.HCM",
    vehicle: "30B-67890",
    driver: "Pham Van Duc",
    status: "in_transit",
    steps: [
      { key: "gps", label: "Xac nhan GPS", done: true, time: "08:15:00 16/12/2024" },
      { key: "phone", label: "Xac nhan SDT", done: false },
      { key: "delivered", label: "Da giao hang", done: false },
    ],
    cost: "800,000d",
  },
  {
    id: "ORD-2024-002",
    customer: "Tran Van Binh",
    contact: "0912345678",
    pickup: "Nha hang Song Hong, Ha Noi",
    dropoff: "Khach san Muong Thanh, Hai Phong",
    vehicle: "59E-33333",
    driver: "Nguyen Thi Hoa",
    status: "delivered",
    steps: [
      { key: "gps", label: "Xac nhan GPS", done: true, time: "07:30:00 14/12/2024" },
      { key: "phone", label: "Xac nhan SDT", done: true, time: "07:45:00 14/12/2024" },
      { key: "delivered", label: "Da giao hang", done: true, time: "10:30:00 14/12/2024" },
    ],
    cost: "0d",
  },
];

let ordersState = [...mockOrders];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const formatNow = () => {
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", { hour12: false });
  const date = now.toLocaleDateString("en-GB");
  return `${time} ${date}`;
};

const normalizeStatus = (order) => {
  const delivered = order.steps.find((s) => s.key === "delivered")?.done;
  const gpsDone = order.steps.find((s) => s.key === "gps")?.done;
  if (delivered) return "delivered";
  if (gpsDone) return "in_transit";
  return "waiting";
};

export const getOrders = async () => {
  await delay();
  return ordersState.map((o) => ({ ...o, steps: o.steps.map((s) => ({ ...s })) }));
};

export const confirmOrderStep = async (orderId, stepKey) => {
  await delay();
  ordersState = ordersState.map((o) => {
    if (o.id !== orderId) return o;
    const steps = o.steps.map((s) =>
      s.key === stepKey ? { ...s, done: true, time: s.time || formatNow() } : s
    );
    const updated = { ...o, steps };
    return { ...updated, status: normalizeStatus(updated) };
  });
  return ordersState.find((o) => o.id === orderId);
};
