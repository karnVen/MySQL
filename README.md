
# 📊 Personal Activity Tracker & Dashboard

A full-stack data project that tracks daily activities (Coding, Eating, Sleep, etc.) by importing logs from Excel/CSV into a MySQL database. The ultimate goal is to visualize this data on a responsive web dashboard.

## 🚀 Features
- **Data Ingestion:** Automated script to read `.csv` files and upload them to MySQL.
- **Smart Data Cleaning:** Automatically handles mixed date formats (e.g., `DD-MM-YYYY` and `MM/DD/YYYY PM`) using Moment.js.
- **Duplicate Prevention:** Checks for existing IDs to prevent double-entries.
- **Search Capability:** Scripts to query specific activities (e.g., "OdinProject_react").
- **(Coming Soon):** Responsive Frontend Dashboard to visualize time spent on tasks.

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Database:** MySQL
- **Libraries:** - `mysql2` (Database connection)
  - `csv-parser` (Reading Excel exports)
  - `moment` (Date parsing & formatting)
  - `dotenv` (Environment variable management)

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/activity-tracker.git](https://github.com/yourusername/activity-tracker.git)
cd activity-tracker

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Configure Database

Create a MySQL database named `daily_log` and run this SQL query to create the table:

```sql
CREATE DATABASE IF NOT EXISTS daily_log;
USE daily_log;

CREATE TABLE activities (
    id INT PRIMARY KEY,
    activity_tag VARCHAR(50) NOT NULL,
    start_time DATETIME,
    end_time DATETIME,
    duration TIME,
    loops INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### 4. Environment Variables

Create a `.env` file in the root folder and add your database credentials:

```env
PORT=3000
DATABASE_HOST=127.0.0.1
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=daily_log

```

## 📂 Usage

### Importing Data

1. Save your Excel file as `activities.csv`.
2. Ensure columns are: `ID`, `Tag`, `From`, `To`, `Duration`, `Loops`.
3. Run the upload script:

```bash
node upload_csv.js

```

### Searching Data

To find specific activities (e.g., "OdinProject"):

```bash
node search.js

```

## 🗺️ Roadmap

* [x] Backend Data Ingestion (CSV to MySQL)
* [x] Date Normalization (Handling formatting errors)
* [ ] Create REST API Endpoints (Express.js)
* [ ] Build React/Frontend Dashboard
* [ ] Add Charts & Graphs for productivity analysis

## 🤝 Contributing

Feel free to open issues or pull requests if you have suggestions for better data visualization techniques!
