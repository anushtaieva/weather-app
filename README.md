# Weather Dashboard

Weather Dashboard is a responsive weather application built with Vue 3 and OpenWeather API.

## Features

### Weather

* City search with autocomplete
* Current weather information
* 5-day weather forecast
* Hourly temperature chart using Chart.js
* Temperature visualization for the current day and 5-day forecast

### Dashboard

* Multiple weather blocks
* Up to 5 weather blocks
* Add and remove weather blocks
* Confirmation modal before deletion
* Default weather based on user's IP location

### Favorites

* Add cities to favorites
* Remove cities from favorites
* Maximum 5 favorite cities
* Favorite cities stored in localStorage
* Dedicated Favorites page
* Favorite status indicator

### Localization

* English / Ukrainian interface
* OpenWeather responses localized according to selected language

### UI / UX

* Responsive layout (360px - 1200px+)
* Day / Night theme
* Loading indicators
* Modal notifications
* Persistent data using localStorage

---

## Technologies

* Vue 3
* Vue Router
* Vue I18n
* Axios
* Chart.js
* Vite
* OpenWeather API

---

## Installation

Clone repository:

```bash
git clone https://github.com/anushtaieva/weather-app
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
VITE_OPENWEATHER_API_KEY=YOUR_API_KEY
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Environment Variables

| Variable                 | Description         |
| ------------------------ | ------------------- |
| VITE_OPENWEATHER_API_KEY | OpenWeather API Key |

---

## Project Structure

```text
src
├── api
├── components
├── composables
├── i18n
├── router
├── views
└── assets
```

---

## Additional Functionality

* User city detection by IP
* Persistent weather blocks
* Persistent favorites
* Theme switching (Day / Night)
* Multilingual support

---

## Author

Created as a test assignment using Vue 3.
