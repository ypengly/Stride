# 🏃 Stride

### A mobile-first fitness tracker for walking & running.

**Track your route. Monitor your pace. Count your steps. Understand your progress.**

Stride is a modern, mobile-first fitness tracker built for walkers and runners. It uses your device's GPS and motion sensors to track activities in real time, while keeping your activity history and statistics stored locally in the browser.

> **Built with Next.js · TypeScript · Tailwind CSS · Leaflet · Recharts**

---

## ✨ Features

| Feature                    | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| 📍 **Live GPS Tracking**   | Track your walking or running route in real time           |
| ⏱️ **Live Pace & Speed**   | Monitor elapsed time, pace, speed, and distance            |
| 👟 **Step Counting**       | Browser-based step detection using motion sensors          |
| 🗺️ **Interactive Maps**   | Visualize your GPS route with Leaflet                      |
| 📊 **Activity Statistics** | Review your performance and progress over time             |
| 📜 **Activity History**    | Browse previous walking and running sessions               |
| 🔥 **Streak Tracking**     | Keep track of your activity streaks                        |
| 🔢 **Calorie Estimates**   | MET-based calorie estimation based on activity             |
| 💾 **Local Storage**       | Activities persist directly in your browser                |
| 📱 **Mobile First**        | Designed primarily for smartphones                         |
| 🌙 **Dark UI**             | Modern dark interface with vibrant fitness-focused accents |

---

## 🎯 Dashboard

The dashboard gives you a quick overview of your recent activity, statistics, streaks, and progress.

> Add a screenshot here:

```md
![Stride Dashboard](./screenshots/dashboard.png)
```

---

## 🏃 Live Activity Tracking

Start an activity and Stride tracks your workout in real time.

### Live metrics

* 📍 GPS location
* 🛣️ Distance
* ⏱️ Duration
* 🏃 Current pace
* ⚡ Current speed
* 👟 Steps
* 🔥 Estimated calories
* 🗺️ GPS route

```text
START
  ↓
GPS + Motion Sensors
  ↓
Live Activity Tracking
  ↓
Pause / Resume
  ↓
Finish
  ↓
Activity Summary
```

---

## 📊 Activity History & Statistics

Every completed activity can be reviewed later.

Stride provides:

* Total distance
* Total duration
* Average pace
* Average speed
* Steps
* Estimated calories
* Activity streaks
* Historical activity records
* Individual activity details

---

## 👟 Step Detection

Stride uses the browser's `DeviceMotionEvent` API to estimate steps using accelerometer data and peak detection.

This is intentionally designed as a **practical browser-based approximation**, rather than a clinical pedometer.

If motion sensors aren't available, users can manually enter their steps from the activity summary.

---

## 🗺️ GPS Tracking

Stride uses browser geolocation to track your route.

To prevent inaccurate distance calculations:

* GPS fixes with accuracy worse than **35m** are discarded.
* Implausible GPS jumps are ignored.
* Movement implying speeds above approximately **45 km/h** is rejected.
* Distance is calculated from accepted GPS coordinates.

The distance logic is implemented in:

```text
lib/distance.ts
```

---

## 💾 Data Storage

Activity data currently persists in **LocalStorage** through a small storage abstraction:

```text
lib/storage.ts
```

This keeps the UI independent from the storage implementation.

### Current architecture

```text
Components
     ↓
Hooks
     ↓
Storage Abstraction
     ↓
LocalStorage
```

The architecture is intentionally designed so LocalStorage can later be replaced with a backend such as **Supabase** without requiring changes throughout the application.

### Future architecture

```text
Components
     ↓
Hooks
     ↓
Storage Abstraction
     ↓
Supabase / Database
```

---

# 🛠️ Tech Stack

### Frontend

* **Next.js** — App Router
* **React**
* **TypeScript**
* **Tailwind CSS**

### Maps & Visualization

* **Leaflet** — Interactive GPS maps
* **Recharts** — Statistics and data visualization

### Browser APIs

* Geolocation API
* DeviceMotionEvent
* LocalStorage
* SessionStorage

---

# 📁 Project Structure

```text
stride/
│
├── app/
│   ├── page.tsx                  # Dashboard
│   │
│   ├── activity/
│   │   ├── live/                # Live activity tracker
│   │   └── summary/             # Post-activity summary
│   │
│   ├── history/
│   │   ├── page.tsx             # Activity history
│   │   └── [id]/                # Activity details
│   │
│   ├── stats/                   # Statistics dashboard
│   └── profile/                 # Profile & local data controls
│
├── components/
│   ├── ui/                      # Design system
│   ├── activity/                # Activity tracker UI
│   ├── dashboard/               # Dashboard components
│   ├── charts/                  # Charts
│   ├── nav/                     # Navigation
│   └── toast/                   # Notifications
│
├── hooks/
│   ├── useGeolocationTracking.ts
│   ├── useStepCounter.ts
│   ├── useActivityTracker.ts
│   ├── useLocalActivities.ts
│   └── useProfile.ts
│
└── lib/
    ├── types.ts
    ├── distance.ts
    ├── format.ts
    ├── calories.ts
    ├── storage.ts
    ├── streak.ts
    ├── analytics.ts
    └── demoData.ts
```

---

# 🎨 Design System

Stride uses a dark, athletic interface designed around three accent colors.

| Accent        | Hex       | Purpose                   |
| ------------- | --------- | ------------------------- |
| 🟠 **Ember**  | `#ff6a3d` | Actions & pace            |
| 🔵 **Signal** | `#3db2ff` | GPS, routes & distance    |
| 🟢 **Mint**   | `#5ee6a8` | Streaks & positive states |

### Typography

**Space Grotesk**
Display & UI

**Manrope**
Body text

**JetBrains Mono**
Statistics and numerical readouts

### Signature Element

Stride's visual identity is built around **"the Trace"** — a hand-drawn GPS-style line used throughout the application.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/ypengly/Stride.git
cd Stride
```

## 2. Install dependencies

```bash
npm install
```

## 3. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 📱 GPS & Motion Permissions

For GPS and motion sensors to work correctly, run the application using:

```text
https://
```

or:

```text
localhost
```

Modern browsers restrict access to geolocation and motion APIs on insecure connections.

When prompted, allow:

* 📍 Location access
* 👟 Motion / sensor access

---

# 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

---

# ⚠️ Known Browser Limitations

### 👟 Step Detection

Step detection depends on the browser's motion sensor support.

* Requires device motion sensors
* iOS Safari may require explicit permission
* Generally unavailable on desktop browsers
* Can stop when the page loses focus
* Manual step entry is available as a fallback

> Step counting is an approximation and should not be treated as a medical-grade pedometer.

### 📍 GPS Tracking

GPS tracking runs while the application is open and in the foreground.

Locking the phone or switching applications may pause tracking depending on the browser and operating system.

The application clearly displays this limitation during live tracking.

### 🔥 Calories

Calories are calculated using a simple **MET-based estimation**.

They are intended for general activity tracking and should not be considered medically accurate.

---

# 🧭 Roadmap

Stride is intentionally structured so additional functionality can be added later.

### Planned / Possible Improvements

* [ ] Supabase backend
* [ ] User authentication
* [ ] Cloud activity synchronization
* [ ] Cross-device activity history
* [ ] Advanced running analytics
* [ ] Personal records
* [ ] Weekly / monthly goals
* [ ] Improved sensor-based step detection
* [ ] Background GPS tracking where supported
* [ ] PWA / installable mobile experience
* [ ] Social features
* [ ] Leaderboards
* [ ] Activity sharing

---

# 🔐 Current Scope

Stride currently focuses on the **core fitness tracking experience**.

It intentionally does **not** include:

* Authentication
* Followers
* Messaging
* Leaderboards
* Social feeds
* Cloud synchronization

The data model and storage layer are designed so these features can be introduced later without requiring a complete rewrite.

---

# 🤝 Contributing

Contributions, ideas, and feedback are welcome.

If you'd like to improve Stride:

```bash
git clone https://github.com/ypengly/Stride.git
cd Stride
npm install
npm run dev
```

Create a branch:

```bash
git checkout -b feature/my-feature
```

Make your changes, commit them, and open a pull request.

---

# 📄 License

This project is currently available for personal and educational use.

---

<div align="center">

### 🏃 Keep Moving. Keep Tracking. Keep Improving.

**Stride**

Made with ❤️ and code.

</div>
