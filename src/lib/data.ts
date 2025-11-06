// Mock data for PUQueue AI

// Mock user roles: 'student', 'admin', 'staff'
export const mockUser = {
  name: 'Alex Doe',
  email: 'alex.doe@university.edu',
  role: 'student', // Change to 'admin' to see admin view
  avatar: 'https://picsum.photos/seed/user1/100/100',
};

export type Ticket = {
  id: string;
  subject: string;
  department: 'IT Support' | 'Admissions' | 'Financial Aid' | 'Housing';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  lastUpdated: string;
  messages: { author: string; text: string; timestamp: string }[];
};

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Cannot connect to university Wi-Fi',
    department: 'IT Support',
    status: 'Resolved',
    lastUpdated: '2024-07-20T10:00:00Z',
    messages: [
      { author: 'Alex Doe', text: 'I cannot connect to the Eduroam Wi-Fi in the library.', timestamp: '2024-07-19T09:00:00Z' },
      { author: 'IT Support', text: 'Have you tried forgetting the network and reconnecting?', timestamp: '2024-07-19T09:30:00Z' },
      { author: 'Alex Doe', text: 'Yes, that worked. Thanks!', timestamp: '2024-07-20T10:00:00Z' },
    ],
  },
  {
    id: 'TKT-002',
    subject: 'Question about scholarship application',
    department: 'Financial Aid',
    status: 'In Progress',
    lastUpdated: '2024-07-21T14:20:00Z',
    messages: [
       { author: 'Alex Doe', text: 'Where can I find the deadline for the general scholarship application?', timestamp: '2024-07-21T14:00:00Z' },
       { author: 'Financial Aid', text: 'We are looking into this for you and will get back shortly.', timestamp: '2024-07-21T14:20:00Z' },
    ],
  },
  {
    id: 'TKT-003',
    subject: 'Leaky faucet in dorm room',
    department: 'Housing',
    status: 'Open',
    lastUpdated: '2024-07-22T11:00:00Z',
    messages: [
        { author: 'Alex Doe', text: 'My faucet in room 201, North Hall is leaking.', timestamp: '2024-07-22T11:00:00Z' },
    ],
  },
];

export type Appointment = {
  id: string;
  department: 'Academic Advising' | 'Career Services' | 'Writing Center';
  staffName: string;
  date: string;
  time: string;
};

export const mockAppointments: Appointment[] = [
  {
    id: 'APP-001',
    department: 'Academic Advising',
    staffName: 'Dr. Evelyn Reed',
    date: '2024-07-25',
    time: '11:00 AM',
  },
  {
    id: 'APP-002',
    department: 'Career Services',
    staffName: 'Mr. John Carter',
    date: '2024-08-02',
    time: '2:30 PM',
  },
];

// Mock data for Admin Analytics
export const mockTicketStats = {
  totalTickets: 125,
  openTickets: 23,
  resolvedToday: 15,
  avgResolutionTime: '2.5 hours',
};

export const mockTicketTrends = [
    { date: 'Jul 15', 'CSS': 10, 'Registrar': 5, 'Guidance': 3 },
    { date: 'Jul 16', 'CSS': 12, 'Registrar': 7, 'Guidance': 2 },
    { date: 'Jul 17', 'CSS': 8, 'Registrar': 10, 'Guidance': 5 },
    { date: 'Jul 18', 'CSS': 15, 'Registrar': 8, 'Guidance': 4 },
    { date: 'Jul 19', 'CSS': 11, 'Registrar': 12, 'Guidance': 6 },
    { date: 'Jul 20', 'CSS': 13, 'Registrar': 9, 'Guidance': 7 },
    { date: 'Jul 21', 'CSS': 10, 'Registrar': 11, 'Guidance': 5 },
  ];

export const mockDepartmentPerformance = [
    { department: 'CSS', tickets: 79, appointments: 25, satisfaction: '95%' },
    { department: 'Registrar', tickets: 62, appointments: 12, satisfaction: '88%' },
    { department: 'Guidance', tickets: 32, appointments: 48, satisfaction: '91%' },
    { department: "Dean's Office", tickets: 18, appointments: 5, satisfaction: '93%' },
];


// Mock data for Student Analytics
export const mockStudentTicketActivity = [
  { month: 'Jan', opened: 2, resolved: 2 },
  { month: 'Feb', opened: 1, resolved: 1 },
  { month: 'Mar', opened: 3, resolved: 2 },
  { month: 'Apr', opened: 0, resolved: 1 },
  { month: 'May', opened: 2, resolved: 2 },
  { month: 'Jun', opened: 1, resolved: 1 },
];

export const mockStudentAppointmentInsights = [
  { department: 'Registrar', appointments: 4, fill: 'var(--color-registrar)' },
  { department: 'Guidance', appointments: 2, fill: 'var(--color-guidance)' },
  { department: "Dean's Office", appointments: 1, fill: "var(--color-deans-office)" },
  { department: 'CSS', appointments: 3, fill: 'var(--color-css)' },
];

export const mockAiInteractionLog = {
    totalQuestions: 42,
    successfulAnswers: 35,
    ticketsCreatedAfter: 3,
};
