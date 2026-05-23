# Holidaze

Holidaze is a venue booking application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

The project allows users to browse venues, search and filter listings, book stays and manage their profile. Registered venue managers can also create, edit and delete venues, as well as view bookings for their own venues.

---

## Running the project

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Open

http://localhost:5173/

### Build for production

```bash
npm run build
```

### Build for production

```bash
npm run preview
```

---

## Environment variables

Create a `.env` file in the project root with:

```env
VITE_API_BASE_URL=https://v2.api.noroff.dev
VITE_NOROFF_API_KEY=your_api_key_here
```

---

## Available Scripts

```bash
npm run dev       # Start local development server
npm run build     # Build project for production
npm run preview   # Preview production build locally
```

---

## Technologies used

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Noroff API v2
- LocalStorage

---

## Features

**Visitor / customer**
-Browse venues
-Search venues using the API search endpoint
-Filter venues by max price and guest count
-Sort venues by newest, oldest, price low to high, and price high to low
-Paginated venue results
-View venue details
-View venue images
-View amenities
-View booked dates
-Register and log in
-Create bookings
-Booking date validation
-Prevent overlapping bookings
-View own bookings on profile page
-Update avatar

**Venue manager**
-Register as a venue manager
-Access protected manager dashboard
-Create venues
-Add multiple image URLs
-Add city and country
-Add amenities
-Edit own venues
-Delete own venues
-View bookings for managed venues

**UI and quality**
-Responsive layout
-Custom logo and favicon
-Reusable button component
-Shared color system
-Google Font: Exo
-Accessibility improvements
-SEO improvements
-Lighthouse performance optimizations

---

# Links

**Live site:**

https://vold-art.github.io/project-exam-2-holidaze/

**GitHub repository:**

https://github.com/Vold-Art/project-exam-2-holidaze

**Figma design:**

Prototype: https://www.figma.com/proto/K2if5xwo77wM7EVl5vFJyb/Holidaze?node-id=0-1&t=nvvsG9hAfYaCLrvr-1

Design: https://www.figma.com/design/K2if5xwo77wM7EVl5vFJyb/Holidaze?node-id=0-1&p=f&t=gbRcgn06xrTtYUqT-0

**Project board:**

Kanban: https://github.com/users/Vold-Art/projects/11/views/1

Gantt: https://github.com/users/Vold-Art/projects/11/views/4

---

# Author

Arnt Helge Vold
Vold-Art @ GitHub
FED2 | Noroff
