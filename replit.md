# Doctor Prescription Web Application

## Overview

This is a comprehensive Doctor Prescription Web Application that allows healthcare professionals to manage patients and create AI-powered prescriptions with voice input capabilities. The system combines modern web technologies with speech recognition and natural language processing to streamline the prescription creation process.

The application features secure authentication, patient management, voice-to-text prescription creation, and PDF generation. It's designed as a full-stack solution with a React frontend, Express.js backend, and PostgreSQL database, following a modular architecture pattern.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation schemas
- **Design Pattern**: Component-based architecture with reusable UI components

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with structured error handling
- **Session Management**: Express sessions for authentication state
- **Password Security**: bcrypt for password hashing
- **Request Validation**: Zod schemas shared between frontend and backend
- **Database Layer**: Drizzle ORM for type-safe database operations
- **File Structure**: Modular separation with routes, storage, and database layers

### Database Design
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with migrations support
- **Schema Structure**: 
  - Doctors table with authentication and profile information
  - Patients table linked to doctors with comprehensive medical information
  - Prescriptions table storing structured medicine data as JSON
- **Relationships**: Foreign key constraints ensuring data integrity
- **Data Types**: UUID primary keys, JSON fields for complex data structures

### Authentication System
- **Method**: Session-based authentication with secure password hashing
- **User Roles**: Doctor-centric system with medical license validation
- **Security**: Password strength requirements and unique constraint validations
- **Session Storage**: Express session middleware with secure configuration

### AI Integration Architecture
- **Speech Recognition**: Web Speech API for browser-based voice input
- **Text Processing**: Client-side NLP parser for extracting prescription data
- **Data Structure**: Structured medicine objects with dosage, frequency, and duration
- **Fallback**: Manual form input when voice recognition is unavailable

### PDF Generation
- **Approach**: Client-side HTML-to-PDF generation using browser print functionality
- **Template**: Professional prescription layout with doctor and patient information
- **Data Formatting**: Structured medicine list with comprehensive details

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **express**: Web framework for Node.js backend
- **bcryptjs**: Password hashing and comparison
- **zod**: Schema validation library

### Frontend UI Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management and validation
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing library

### Development Dependencies
- **vite**: Modern build tool and development server
- **typescript**: Type checking and enhanced development experience
- **@replit/vite-plugin-***: Replit-specific development tools

### Speech and AI Processing
- **Web Speech API**: Browser-native speech recognition (no external API required)
- **Client-side NLP**: Custom text parsing for prescription data extraction

### Authentication and Security
- **express-session**: Session management middleware
- **jsonwebtoken**: JWT token handling (types only)
- **cors**: Cross-origin resource sharing configuration

The application is designed to be self-contained with minimal external API dependencies, relying primarily on browser-native APIs for speech recognition and client-side processing for prescription parsing.