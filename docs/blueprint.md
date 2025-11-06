# **App Name**: PUQueue AI

## Core Features:

- User Authentication: Secure login system with role-based access (Student, Admin, Staff) using university email verification using Firebase Authentication and Firestore.
- AI Chatbot: AI-powered chatbot providing instant support, using Gemini via Genkit as a tool to help make choices about which source documents should inform its answer.
- Appointment Booking: Calendar-based appointment scheduling system allowing students to book appointments with different departments, leveraging Firestore.
- Ticket Tracking: A system for students to submit, track, and manage help tickets with status updates and departmental assignments, backed by Firestore.
- Admin Analytics Dashboard: Comprehensive admin dashboard providing analytics on ticket trends, department performance, and AI resolution rates.
- Knowledge Base Training: A tool for admins to upload and train the AI with PDF/CSV documents using Genkit to improve its knowledge base.
- New Ticket Submission: Enable students to create a new ticket directly from the UI.

## Style Guidelines:

- Primary color: Dark green (#1B5E20) for trust and stability.
- Secondary color: Dark blue (#1A237E) to give the site a professional look.
- Background color: white.
- Responsive layout using Tailwind CSS grid and flexbox to ensure compatibility across devices.
- Font pairing: 'Inter' (sans-serif) for body text and 'Space Grotesk' (sans-serif) for headlines, for a modern and readable look.
- Use Heroicons or Lucide icons for a consistent and modern look. Icons should complement the academic theme.
- Subtle fade-in animations for new messages in the chatbot and smooth transitions for page navigation to enhance user experience.