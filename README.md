# Cocktail Card Composer

A web application for managing cocktail recipe cards. Create, edit, reorder, and export cocktail tech cards to PDF — designed for bar staff and cocktail enthusiasts.

## Features

- Create and edit cocktail cards with name, image, glass type, method, ice, and recipe
- Drag-and-drop reordering
- Export all cards to a styled PDF document
- Rich text editor for recipe descriptions
- Image upload support

## Tech Stack

- **Client:** React, TypeScript, Vite, Tailwind CSS, Radix UI, dnd-kit, jsPDF
- **Server:** Node.js, Express, TypeScript

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd CoctaillsTechCardGenerator
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

### 4. Start the server

Open a terminal and run:

```bash
cd server
npm run dev
```

The API server will start on `http://localhost:3001`. On first run it automatically creates an empty `cocktails.json` database file.

### 5. Start the client

Open a **second** terminal and run:

```bash
cd client
npm run dev
```

The client dev server will start on `http://localhost:5173` (default Vite port). API requests are automatically proxied to the server.

### 6. Open the app

Navigate to `http://localhost:5173` in your browser.

## Project Structure

```
├── client/            # React frontend (Vite)
│   └── src/
│       ├── api/       # API client functions
│       ├── components/# UI components
│       ├── hooks/     # Custom React hooks
│       └── types/     # TypeScript interfaces
├── server/            # Express backend
│   └── src/
│       ├── db/        # JSON file database
│       ├── middleware/ # Error handling
│       ├── routes/    # API routes
│       └── types/     # TypeScript interfaces
```

## Production Build

```bash
# Build the client
cd client
npm run build

# Build the server
cd ../server
npm run build
npm start
```
