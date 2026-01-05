// Mock data và service cho quản lý chuyến đi

export const mockTrips = [
  {
    id: 1,
    date: "01/12/2024",
    vehicle: "29A-12345",
    driver: "Nguyễn Văn A",
    route: "Hà Nội → Hải Phòng",
    time: "08:30 - 10:30",
    distance: "120 km",
    fuel: "15L",
    status: "completed",
  },
  {
    id: 2,
    date: "01/12/2024",
    vehicle: "30B-98765",
    driver: "Trần Văn B",
    route: "Hà Nội → Nam Định",
    time: "09:00",
    distance: "90 km",
    fuel: "12L",
    status: "in-progress",
  },
  {
    id: 3,
    date: "01/12/2024",
    vehicle: "51F-11111",
    driver: "Hoàng Thị E",
    route: "Hà Nội → Thái Bình",
    time: "07:30 - 09:45",
    distance: "110 km",
    fuel: "14L",
    status: "completed",
  },
  {
    id: 4,
    date: "01/12/2024",
    vehicle: "29A-12345",
    driver: "Nguyễn Văn A",
    route: "Hà Nội → Ninh Bình",
    time: "14:00",
    distance: "95 km",
    fuel: "13L",
    status: "in-progress",
  },
  {
    id: 5,
    date: "30/11/2024",
    vehicle: "30D-33333",
    driver: "Lê Thị C",
    route: "Hà Nội → Hưng Yên",
    time: "10:30 - 10:45",
    distance: "60 km",
    fuel: "8L",
    status: "completed",
  },
];

export const getTripStats = () => ({
  todayTrips: 4,
  inProgress: 2,
  completed: 3,
  totalDistance: "290 km",
});

export const getTrips = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTrips), 300);
  });
};

export const getTripById = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTrips.find((t) => t.id === id)), 300);
  });
};
