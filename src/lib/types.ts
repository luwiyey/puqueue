

import type { Timestamp } from 'firebase/firestore';

export type DashboardWidget = {
  id: string;
  visible: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'student' | 'admin' | 'staff' | 'guest';
  displayName?: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  theme?: 'light' | 'dark' | 'system';
  dashboardLayout?: DashboardWidget[];
  notificationSettings?: NotificationSettings;
}

export interface TicketHistoryEntry {
  type: 'status_change' | 'comment';
  content: string;
  author: string; 
  timestamp: Timestamp;
}

export interface Ticket {
  id: string;
  subject: string;
  department: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  dateSubmitted: Timestamp;
  lastUpdated: Timestamp;
  studentId: string;
  history?: TicketHistoryEntry[];
  conversationId?: string;
  summary?: string;
  keywords?: string;
  documentType?: 'TOR' | 'COR' | 'CAV' | 'Good Moral' | 'Other';
}

export interface Appointment {
  id:string;
  studentId: string;
  department: string;
  dateTime: Timestamp;
  type: 'Virtual' | 'In-Person';
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  staffId?: string;
  meetingLink?: string;
  subject?: string;
  contactInfo?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  postDate: Timestamp;
  authorId: string;
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    type: 'ticket' | 'appointment' | 'announcement';
    referenceId: string; // e.g., ticketId or appointmentId
    isRead: boolean;
    createdAt: Timestamp;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Timestamp;
}

// For feedback tied to a specific ticket
export interface Feedback {
    id?: string;
    mood: 'happy' | 'neutral' | 'sad';
    comment?: string;
    timestamp: Timestamp;
    userId: string;
    ticketId: string;
}

// For general anonymous feedback
export interface AnonymousFeedback {
    id?: string;
    comment: string;
    department: string;
    timestamp: Timestamp;
}

export interface KnowledgeBaseDocument {
    id: string;
    title: string;
    uploadDate: Timestamp;
    fileType?: 'PDF' | 'CSV' | 'manual';
    adminId: string;
    content?: string; // For manually added text content
}
