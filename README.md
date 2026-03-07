# Real-Time Collaborative Spreadsheet

A lightweight real-time collaborative spreadsheet built using **Next.js, TypeScript, TailwindCSS, Firebase, and Zustand**.

This project is inspired by **Google Sheets**, focusing on real-time collaboration, clean architecture, and efficient state management.

---

# Features

### Spreadsheet Grid
- Dynamic spreadsheet grid
- Row numbers and column headers
- Editable cells
- Google Sheets–like UI

### Real-time Collaboration
- Multiple users can edit the same document
- Changes sync instantly across sessions

### Presence
- Shows active collaborators inside the document

### State Management
- Global spreadsheet state using **Zustand**

### Formula Support
Basic formula support such as:

```
=SUM(A1:A5)
=A1+B1
```

### Dashboard
- List of spreadsheet documents
- Create/open documents

---

# Tech Stack

Frontend:
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

State Management:
- Zustand

Backend:
- Firebase Firestore

Realtime Sync:
- Firestore realtime listeners

Deployment:
- Vercel

---

# Architecture

The application follows a layered architecture:

```
UI (React Components)
        ↓
State Management (Zustand)
        ↓
Realtime Sync (Firebase)
        ↓
Database (Firestore)
```

### Component Structure

```
components/
   spreadsheet/
      Cell.tsx
      Row.tsx
      Spreadsheet.tsx
store/
   sheetStore.ts
lib/
   firebase.ts
   firestore.ts
```

---

# Getting Started

### Install dependencies

```
npm install
```

### Run development server

```
npm run dev
```

Open:

```
http://localhost:3000
```

---

# Real-Time Behaviour

The application uses **Firestore realtime listeners** to synchronize spreadsheet updates across multiple sessions.

When a cell is updated:

1. Zustand updates the local state
2. Firebase writes the change to Firestore
3. Firestore notifies other connected clients
4. Other clients update their state automatically

---

# Future Improvements

- Drag-to-fill functionality
- Column resizing
- Keyboard navigation
- Advanced formula parser
- Offline support

---

# Demo

The application demonstrates:

- Realtime synchronization
- Multi-user editing
- Spreadsheet UI

---

# Author

Lalith MVS