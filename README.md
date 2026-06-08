# NUDAssess - AI-Powered Test Bank Platform

A comprehensive competency-based test bank and assessment management system with generative AI integration. NUDAssess enables educators to create, manage, and analyze quizzes and exams following a table of specification framework, ensuring alignment with required student competencies. Powered by Google Gemini for intelligent question generation.

## Table of Contents

- [Overview](#overview)
- [Related Repositories](#related-repositories)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Dependencies](#dependencies)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [Team Members](#team-members)
- [License](#license)

## Overview

NUDAssess is a sophisticated test bank platform designed to support competency-based assessment and examination management. It combines educational best practices with cutting-edge AI technology to help educators design valid and reliable assessments aligned with curriculum standards.

### Core Concept:

**Table of Specification (TOS) Framework** - NUDAssess uses a structured approach to assessment design where educators define learning objectives, required competencies, and cognitive levels. The system uses this framework to guide both manual and AI-powered question generation, ensuring that assessments maintain validity and reliability.

### Key Capabilities:

- **Competency-Based Assessment**: Define and track required student competencies
- **Table of Specification**: Structure assessments using TOS framework to ensure curriculum alignment
- **AI-Powered Question Generation**: Leverage Google Gemini to generate contextually relevant questions aligned with competencies
- **Test Bank Management**: Build and maintain comprehensive question repositories
- **Real-time Student Performance Analytics**: Track competency mastery and learning outcomes
- **Automated Grading & Analysis**: Intelligent evaluation and item analysis
- **Multi-format Export**: CSV and PDF reports for data analysis and distribution
- **Multi-role Access Control**: Teacher, Admin, and Super Admin capabilities
- **Secure Authentication**: Email-based login with OTP verification

## Related Repositories

This project is part of a multi-platform assessment system:

### Mobile Client for Students

- **Repository**: [NUDAssess Mobile Client](https://github.com/your-org/nudassess-mobile-client)
- **Purpose**: Native mobile application for students to take quizzes and exams on iOS and Android devices
- **Technology**: Built with Flutter
- **Features**:
  - Take quizzes and exams on mobile devices
  - View quiz results and competency progress
  - Real-time synchronization with the web platform
  - Access test bank questions for study

### Web Platform (This Repository)

- **Purpose**: Comprehensive test bank and assessment management platform
- **Users**: Teachers, Administrators, Super Administrators
- **Focus**: TOS-based assessment design, AI-powered question generation, and competency tracking

Both repositories share the same backend services (Firebase, Supabase) and work together to provide a seamless competency-based assessment experience across platforms.

## Features

### Question Management

- **Manual Creation**: Create questions with detailed options and configurations
- **Competency-Aligned Generation**: Generate questions that target specific student competencies
- **AI-Powered Creation**: Leverage Google Gemini to automatically generate contextually relevant questions
- **Test Bank Repository**: Organize and manage a comprehensive question library with metadata tagging
- **Question Analytics**: View detailed performance metrics and item analysis
- **Similarity Detection**: Check for duplicate or similar questions to maintain bank quality
- **Question Tagging**: Tag questions by competency, difficulty level, cognitive domain, and topic

### Quiz & Exam Management

- **Table of Specification-Based Creation**: Generate quizzes that follow defined TOS specifications
- **Competency Alignment**: Ensure quizzes assess required competencies and learning outcomes
- **Flexible Quiz Design**: Create and customize quizzes with multiple sections and question types
- **Smart Configuration**: Set time limits, scoring rules, and difficulty parameters
- **Multi-Question Type Support**: Support various question formats and complexities
- **Automated Answer Keys**: Generate comprehensive answer keys with explanations
- **Scheduling & Publishing**: Control quiz availability and student access
- **Hybrid Creation**: Combine manual selection with AI-powered question suggestion

### Class Management

- Create and manage multiple classes
- Assign students to classes
- Track class performance metrics
- Bulk member import from CSV

### Analytics & Reporting

- **Item Analysis**: Detailed difficulty indices, discrimination coefficients, and effectiveness metrics
- **Competency Mastery Tracking**: Monitor student progress toward required competencies
- **Assessment Validity Reports**: Analyze test reliability and validity statistics
- **Table of Specification Analysis**: Verify quiz alignment with TOS framework
- **Student Performance Tracking**: Individual and class-level performance metrics
- **Quiz Statistics**: Comprehensive insights on question performance and class trends
- **Multi-Format Exports**: CSV and PDF reports for different stakeholders
- **Visual Analytics**: Interactive charts and dashboards for data visualization
- **Test of Specification Reports**: Detailed TOS compliance and coverage analysis
- **Gradebook Generation**: Automated gradebook creation and distribution

### Authentication & Security

- Secure email-based authentication
- OTP verification for sign-up
- Password reset functionality
- Multi-role authorization (Admin, Super Admin, Educator, Student)
- Protected routes with role-based access

### Competency Management

- Define and organize student learning competencies
- Map competencies to learning objectives
- Set competency mastery targets
- Track competency achievement across assessments
- Generate competency-based progress reports
- Align curriculum standards with assessments

### User Management

- Student profiles with competency progress tracking
- Teacher/Educator dashboards with TOS design tools
- Admin control panels for system management
- Super Admin management and oversight interface
- Customizable account settings and preferences
- Role-based feature access and permissions

### Data Management & Test Bank

- CSV import/export functionality for questions and student data
- Bulk operations on student records and competency assignments
- Test bank organization and metadata management
- Competency mapping and linking to assessments
- Report generation in multiple formats
- Data backup and version control

### AI Integration

- **AI Question Generation**: Google Gemini-powered question creation aligned with specified competencies
- **Competency-Focused Suggestions**: AI recommends questions that fill gaps in test specifications
- **Relevance Validation**: Automatic checking to ensure generated questions are relevant to competencies
- **Question Enhancement**: AI assistance in refining and improving question quality
- **Text Embedding & Similarity**: Advanced NLP for detecting duplicate or similar questions
- **Adaptive Question Suggestion**: Smart recommendations based on TOS and item analysis data

## Tech Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 6.2.0
- **Styling**: TailwindCSS 4.0.17 + Material-UI 7.3.1
- **State Management**: React Router 7.4.1
- **UI Components**: Material-UI (MUI), Radix UI
- **Charts & Analytics**: Chart.js, Recharts, MUI X-Charts
- **Backend Services**: Firebase, Supabase
- **AI Services**: Google Generative AI (Gemini)
- **PDF Generation**: jsPDF, jsPDF AutoTable
- **Excel Handling**: XLSX
- **Date Management**: Day.js
- **Animations**: Framer Motion
- **Rich Text Editor**: Jodit React
- **Code Quality**: ESLint, Prettier

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 16.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: Version 7.0.0 or higher (comes with Node.js)
- **Git**: Version 2.0.0 or higher ([Download](https://git-scm.com/))

### Required API Keys & Credentials:

- Firebase project credentials
- Supabase project URL and API key
- Google Generative AI API key
- Email service configuration (for authentication)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Assess
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Generative AI
VITE_GOOGLE_GENERATIVE_AI_KEY=your_google_generative_ai_key

# Application URLs
VITE_APP_URL=http://localhost:5173
```

### 4. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

To create a production build:

```bash
npm run build
```

The compiled files will be in the `dist/` directory.

### 6. Preview Production Build

```bash
npm run preview
```

### 7. Linting

Check code quality with ESLint:

```bash
npm run lint
```

## Dependencies

### Core Dependencies

| Package          | Version | Purpose             |
| ---------------- | ------- | ------------------- |
| react            | ^19.1.1 | UI library          |
| react-dom        | ^19.1.1 | React DOM rendering |
| react-router-dom | ^7.4.1  | Client-side routing |
| vite             | ^6.2.0  | Build tool          |

### UI & Styling

| Package             | Version  | Purpose                |
| ------------------- | -------- | ---------------------- |
| @mui/material       | ^7.3.1   | Material-UI components |
| @mui/icons-material | ^7.1.0   | Material-UI icons      |
| tailwindcss         | ^4.0.17  | Utility-first CSS      |
| framer-motion       | ^12.6.3  | Animation library      |
| lucide-react        | ^0.542.0 | Icon library           |

### Backend & Authentication

| Package               | Version | Purpose                   |
| --------------------- | ------- | ------------------------- |
| firebase              | ^12.2.1 | Authentication & database |
| @supabase/supabase-js | ^2.49.4 | Supabase client           |

### AI & Data Processing

| Package               | Version | Purpose           |
| --------------------- | ------- | ----------------- |
| @google/generative-ai | ^0.24.1 | Google Gemini API |

### Charts & Analytics

| Package          | Version | Purpose                    |
| ---------------- | ------- | -------------------------- |
| chart.js         | ^4.5.0  | Chart library              |
| react-chartjs-2  | ^5.3.0  | React wrapper for Chart.js |
| recharts         | ^2.15.3 | React charts library       |
| @mui/x-charts    | ^8.8.0  | MUI charting components    |
| @mui/x-data-grid | ^8.3.1  | MUI data grid              |

### File Handling

| Package          | Version | Purpose              |
| ---------------- | ------- | -------------------- |
| jspdf            | ^3.0.3  | PDF generation       |
| jspdf-autotable  | ^5.0.2  | PDF table formatting |
| xlsx             | ^0.18.5 | Excel file handling  |
| csv-import-react | ^1.0.16 | CSV import component |

### Utilities

| Package           | Version  | Purpose             |
| ----------------- | -------- | ------------------- |
| dayjs             | ^1.11.13 | Date management     |
| jodit-react       | ^5.2.19  | Rich text editor    |
| reactjs-otp-input | ^2.0.10  | OTP input component |

### Dev Dependencies

| Package              | Version | Purpose           |
| -------------------- | ------- | ----------------- |
| eslint               | ^9.21.0 | Code linting      |
| prettier             | ^3.5.3  | Code formatting   |
| @vitejs/plugin-react | ^4.3.4  | Vite React plugin |

## Project Structure

```
Assess/
├── src/
│   ├── pages/              # Main page components
│   │   ├── Auth/          # Authentication pages
│   │   ├── Dashboard/     # User dashboard
│   │   ├── MyClasses/     # Class management
│   │   ├── QuestionManagement/ # Question CRUD
│   │   ├── QuizManagement/     # Quiz management
│   │   ├── ReportnAnalytics/   # Reports & analytics
│   │   ├── Admin/         # Admin panel
│   │   └── SAdmin/        # Super Admin panel
│   ├── components/
│   │   ├── elements/      # Reusable UI elements
│   │   ├── section/       # Section components
│   │   └── printables/    # PDF & export components
│   ├── helper/            # Utility functions & services
│   │   ├── Firebase.js    # Firebase configuration
│   │   ├── Supabase.jsx   # Supabase configuration
│   │   ├── Gemini.js      # AI integration
│   │   └── ...
│   ├── assets/
│   │   ├── fonts/         # Custom fonts
│   │   └── images/        # Static images
│   ├── App.jsx            # Root component
│   └── main.jsx           # Entry point
├── public/                # Static files
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
└── README.md              # This file
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

### Build & Preview

```bash
npm run build
npm run preview
```

### Code Quality

```bash
npm run lint
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port.

### Dependencies Issues

If you encounter dependency issues, try:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading

Ensure your `.env.local` file exists in the root directory and all required variables are set.

## Team Members

| Name                | Role                           |
| ------------------- | ------------------------------ |
| Shamiah Mendoza     | Project Lead / UI/UX Designer  |
| Lorriane Miraballes | UI/UX Designer / Documentation |
| Red Ochavillo       | Full Stack Developer           |
| Alvin Camacho       | Adviser                        |

## License

This project is proprietary and confidential. All rights reserved.

---

**Last Updated**: June 2026
