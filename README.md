# CoreLab Analytics

**A quantitative research platform and visualization tool for BSIT academic performance analysis.**

This project serves as the digital integration for the research study: *"The Relationship Between Computer Laboratory Usage and Preliminary and Midterm Performance in Selected Core BSIT Subjects at STI College Malolos."*

## Project Overview

CoreLab Analytics bridges the gap between raw statistical data and actionable educational insights. It allows researchers and administrators to visualize how laboratory usage frequency (hours/week) and intensity (hands-on engagement) correlate with student grade shifts between Preliminary and Midterm periods across five core BSIT subjects.

Designed for the A.Y. 2025–2026 research cohort at STI College Malolos, this platform transforms a longitudinal performance study into an interactive web experience, enabling data exploration and automated statistical analysis.

### Key Features

* **Dynamic Data Visualization** — Parse and visualize CSV response data in real-time using interactive scatter plots and comparative bar charts.
* **Automated Statistical Analysis** — Client-side calculation of Pearson *r* correlation coefficients and linear regression slopes using jstat and simple-statistics.
* **Interactive Dashboards** — Explore performance correlations, distribution patterns, and research findings through filterable, responsive charts and tables.
* **Research Documentation** — Complete access to theoretical framework, methodology, hypotheses, variables, and downloadable research manuscript.
* **Team Portal** — Meet the research team and advisers behind the platform with direct contact options for collaboration.
* **No Backend Overhead** — Entirely client-side processing ensures security, portability, and immediate deployment.

## Technology Stack

This project utilizes a modern, fully-client-side stack built with React and TypeScript, ensuring high performance and portability.

* **Frontend Framework** — React 18 with TypeScript
* **Build Tool** — Vite (with SWC for fast transpilation)
* **Styling** — Tailwind CSS with shadcn/ui component library (Radix UI primitives)
* **Data Processing** — PapaParse for CSV parsing; jstat and simple-statistics for statistical calculations
* **Visualization** — Plotly.js for interactive charts and Recharts for supplementary visualizations
* **Routing** — React Router v6 for multi-page navigation
* **Forms & Validation** — React Hook Form with Zod for schema validation
* **UI Components** — 30+ shadcn/ui primitives (buttons, cards, tables, modals, dialogs, tooltips, etc.)
* **Testing** — Vitest with React Testing Library
* **Linting** — ESLint with TypeScript support

## Directory Structure

```text
corelab-analytics-main/
├── src/
│   ├── components/
│   │   ├── sections/          # Page-level sections (Hero, Research, Finale)
│   │   ├── tool/              # Data visualization & analysis components
│   │   │   ├── DocsSidebar.tsx
│   │   │   ├── PlotlyChart.tsx
│   │   │   └── ResultTables.tsx
│   │   ├── ui/                # shadcn/ui component library (30+ primitives)
│   │   ├── Logo.tsx
│   │   ├── NavLink.tsx
│   │   ├── SiteHeader.tsx
│   │   ├── SiteFooter.tsx
│   │   └── [...other components]
│   ├── pages/
│   │   ├── Index.tsx          # Homepage
│   │   ├── Tool.tsx           # Interactive analysis tool
│   │   ├── Dashboard.tsx      # Research dashboard
│   │   ├── Team.tsx           # Team & advisers portal
│   │   ├── NotFound.tsx       # 404 page
│   │   └── StubPage.tsx
│   ├── lib/
│   │   ├── csv.ts             # CSV parsing utilities
│   │   ├── stats.ts           # Statistical calculations (correlation, regression)
│   │   ├── interpretations.ts # Research insight generation
│   │   ├── validate.ts        # Data validation schemas
│   │   ├── scrollToHash.ts    # Navigation utilities
│   │   ├── utils.ts           # Helper functions
│   │   └── glossary.ts        # Research terminology
│   ├── hooks/
│   │   ├── useTheme.ts        # Dark/light mode management
│   │   ├── use-toast.ts       # Toast notifications
│   │   └── use-mobile.tsx     # Mobile detection
│   ├── assets/                # Images, logos, documents
│   ├── App.tsx                # Root application component
│   ├── main.tsx               # Entry point
│   └── [...styles & config]
├── public/
│   ├── content.json           # Research sections, variables, framework
│   ├── dashboard.json         # Dashboard configuration
│   ├── team.json              # Team & adviser information
│   ├── data/
│   │   └── responses.json     # Survey response data
│   └── team/                  # Team member photos
├── package.json               # Dependencies and scripts
├── vite.config.ts             # Vite configuration
├── tailwind.config.ts         # Tailwind CSS customization
├── tsconfig.json              # TypeScript configuration
├── vitest.config.ts           # Vitest testing setup
├── eslint.config.js           # ESLint rules
└── README.md                  # This file
```

## Research Overview

### Study Design
- **Participants** — 86 BSIT students at STI College Malolos
- **Subjects** — Five core BSIT courses: Computer Programming 1 & 2, Event-Driven Programming, Systems Administration & Maintenance, and Introduction to Computing
- **Approach** — Quantitative correlational analysis

### Key Variables

| Variable | Type | Definition | Measurement |
|----------|------|-----------|------------|
| **Lab Frequency** | Independent | Weekly laboratory hours attended (scheduled + voluntary) | Ratio scale (hours/week); Mean: 4.31, SD: 1.82 |
| **Lab Intensity** | Independent | Behavioral engagement depth (hands-on coding, configuration, debugging) | 5-item Likert composite; Scale 5–25; Mean: 16.23, SD: 2.86 |
| **Performance Change** | Dependent | Academic grade shift (Midterm − Preliminary) | Numerical difference; Mean: +1.30, SD: 3.06 |

### Research Questions
1. To what extent does laboratory frequency predict performance change?
2. To what extent does laboratory intensity predict performance change?
3. Is there a combined effect when both variables are considered?

## Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Bun** or **npm** (package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd corelab-analytics-main

# Install dependencies
bun install
# or
npm install
```

### Development Server

```bash
# Start Vite dev server (with hot reload)
bun dev
# or
npm run dev
```

The application will be available at `http://localhost:8080` (or the configured port).

### Build for Production

```bash
# Create optimized production build
bun run build
# or
npm run build

# Preview production build locally
bun run preview
```

### Testing

```bash
# Run all tests once
bun test
# or
npm test

# Watch mode (re-run on changes)
bun test:watch
```

### Linting

```bash
# Check for code style issues
bun lint
```

## Pages & Features

### 1. **Homepage** (`/`)
- Hero section introducing CoreLab Analytics
- Overview of the research project
- Quick links to the tool and dashboard
- Downloadable research manuscript (PDF)

### 2. **Tool** (`/tool`)
- Interactive CSV data parser for survey responses
- Real-time scatter plot generation with regression lines
- Comparative bar charts by subject and performance tier
- Detailed statistical output (correlation, p-values, confidence intervals)
- Research-backed interpretation engine
- Downloadable results table (CSV)

### 3. **Dashboard** (`/dashboard`)
- Curated research findings and visualizations
- Summary statistics across the full dataset
- Key insights and methodology overview
- Distribution analysis of predictor variables

### 4. **Team** (`/team`)
- Research team member profiles and contact information
- Research advisers' contributions
- Collaboration and data access contact form

## API & Data Files

All data is sourced from JSON files in the `/public` directory:

- **`content.json`** — Research chapters, theoretical framework, RRL, methodology
- **`dashboard.json`** — Dashboard configuration and pre-computed insights
- **`team.json`** — Team profiles, adviser information, contact details
- **`data/responses.json`** — Full anonymized survey response dataset

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Code should follow ESLint rules and TypeScript best practices. All new features should include tests.

## Advisers & Support

- **Prof. Katrina Faith Esguerra** — Research methodology and statistical analysis guidance
- **Prof. Alexander Venus** — Technical development and platform architecture

## Contact & Collaboration

For inquiries about the research, dataset access, or collaboration opportunities:

**Email:** corelabanalytics@gmail.com

Research Team: Shae Espino (Lead), Mark Justine Bolacja, Raver Lee Lopez, Sean Azada, Aaron Jhay Diaz, John Mark Reyes, Ma. Irish Pearl Velasco

## License

This project is part of an academic research initiative. Use of the platform and dataset is subject to research ethics protocols and institutional guidelines.

## Acknowledgments

- STI College Malolos for institutional support and access to research participants
- All participating BSIT students and course instructors
- The Vite, React, and shadcn/ui communities for exceptional tooling

---

**CoreLab Analytics** — Transforming laboratory usage data into educational insight, one visualization at a time.
