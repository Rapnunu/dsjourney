// ── Types ──────────────────────────────────────────────────────────────

export type ProjectStatus = "completed" | "in_progress" | "planned";

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  highlights: string[];
  startDate: string;
  endDate?: string;
}

export const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  completed: {
    label: "Completed",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    dotColor: "bg-emerald-400",
  },
  in_progress: {
    label: "In Progress",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    dotColor: "bg-amber-400",
  },
  planned: {
    label: "Planned",
    color: "text-zinc-400",
    bgColor: "bg-zinc-500/10",
    dotColor: "bg-zinc-400",
  },
};

// ── Tech color mapping ─────────────────────────────────────────────────

export const TECH_COLORS: Record<string, { text: string; bg: string }> = {
  Python: { text: "text-indigo-400", bg: "bg-indigo-500/10" },
  Pandas: { text: "text-blue-400", bg: "bg-blue-500/10" },
  NumPy: { text: "text-cyan-400", bg: "bg-cyan-500/10" },
  "Scikit-learn": { text: "text-orange-400", bg: "bg-orange-500/10" },
  Matplotlib: { text: "text-teal-400", bg: "bg-teal-500/10" },
  Seaborn: { text: "text-sky-400", bg: "bg-sky-500/10" },
  "Next.js": { text: "text-zinc-300", bg: "bg-zinc-500/10" },
  TypeScript: { text: "text-blue-400", bg: "bg-blue-500/10" },
  React: { text: "text-sky-400", bg: "bg-sky-500/10" },
  "Tailwind CSS": { text: "text-cyan-400", bg: "bg-cyan-500/10" },
  SQL: { text: "text-amber-400", bg: "bg-amber-500/10" },
  PostgreSQL: { text: "text-blue-400", bg: "bg-blue-500/10" },
  Git: { text: "text-rose-400", bg: "bg-rose-500/10" },
  GitHub: { text: "text-zinc-300", bg: "bg-zinc-500/10" },
  Streamlit: { text: "text-rose-400", bg: "bg-rose-500/10" },
  "Jupyter Notebook": { text: "text-orange-400", bg: "bg-orange-500/10" },
  XGBoost: { text: "text-emerald-400", bg: "bg-emerald-500/10" },
  Plotly: { text: "text-violet-400", bg: "bg-violet-500/10" },
  Docker: { text: "text-blue-400", bg: "bg-blue-500/10" },
};

const DEFAULT_TECH_COLOR = { text: "text-zinc-400", bg: "bg-zinc-500/10" };

export function getTechColor(tech: string) {
  return TECH_COLORS[tech] ?? DEFAULT_TECH_COLOR;
}

// ── Mock Projects ──────────────────────────────────────────────────────

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    title: "DS Prep Tracker",
    description:
      "A full-stack web application to track data science interview preparation progress. Features include study session logging, roadmap visualization, readiness scoring, and analytics dashboards.",
    status: "in_progress",
    technologies: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Git", "GitHub"],
    githubUrl: "https://github.com/Rapnunu/ds-prep-tracker",
    demoUrl: "https://ds-prep-tracker.vercel.app",
    highlights: [
      "Built 6 interactive dashboard pages",
      "Implemented animated SVG progress visualizations",
      "Designed a responsive dark-mode UI system",
    ],
    startDate: "2026-07-15",
  },
  {
    id: "proj-2",
    title: "FrostHub",
    description:
      "A collaborative platform for data science teams to share notebooks, datasets, and model experiments. Includes real-time collaboration features and experiment versioning.",
    status: "in_progress",
    technologies: ["Python", "React", "PostgreSQL", "Docker", "Git"],
    githubUrl: "https://github.com/Rapnunu/frosthub",
    highlights: [
      "Designed REST API with 15+ endpoints",
      "Implemented experiment version tracking",
      "Built real-time notebook collaboration",
    ],
    startDate: "2026-06-01",
  },
  {
    id: "proj-3",
    title: "Customer Churn Prediction",
    description:
      "An end-to-end machine learning pipeline to predict customer churn for a telecom company. Achieved 92% accuracy using gradient-boosted decision trees with feature engineering.",
    status: "completed",
    technologies: ["Python", "Pandas", "Scikit-learn", "XGBoost", "Matplotlib", "Jupyter Notebook"],
    githubUrl: "https://github.com/Rapnunu/churn-prediction",
    highlights: [
      "Achieved 92% accuracy with XGBoost",
      "Engineered 25+ features from raw data",
      "Created comprehensive EDA with 15 visualizations",
    ],
    startDate: "2026-05-01",
    endDate: "2026-06-10",
  },
  {
    id: "proj-4",
    title: "House Price Prediction",
    description:
      "A regression model to predict housing prices using the Ames Housing dataset. Explored multiple algorithms and applied feature selection to improve model interpretability.",
    status: "completed",
    technologies: ["Python", "Pandas", "NumPy", "Scikit-learn", "Seaborn", "Jupyter Notebook"],
    githubUrl: "https://github.com/Rapnunu/house-prices",
    highlights: [
      "Compared 5 regression algorithms",
      "Applied PCA and feature selection",
      "Reduced RMSE by 18% through hyperparameter tuning",
    ],
    startDate: "2026-04-10",
    endDate: "2026-05-15",
  },
  {
    id: "proj-5",
    title: "Sales Forecasting Dashboard",
    description:
      "An interactive Streamlit dashboard for forecasting monthly sales using time series analysis. Supports multiple product lines and generates exportable reports.",
    status: "completed",
    technologies: ["Python", "Streamlit", "Pandas", "Plotly", "SQL"],
    githubUrl: "https://github.com/Rapnunu/sales-forecast",
    demoUrl: "https://sales-forecast-demo.streamlit.app",
    highlights: [
      "Built interactive dashboard with Streamlit",
      "Implemented ARIMA and Prophet models",
      "Integrated SQL data pipeline for live updates",
    ],
    startDate: "2026-03-20",
    endDate: "2026-04-25",
  },
];

// ── Derived data ───────────────────────────────────────────────────────

export interface PortfolioStats {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  portfolioScore: number;
}

export function getPortfolioStats(projects: Project[]): PortfolioStats {
  const total = projects.length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const inProgress = projects.filter((p) => p.status === "in_progress").length;

  // Score formula: completed projects weighted more, bonus for diversity of tech
  const uniqueTechs = new Set(projects.flatMap((p) => p.technologies)).size;
  const score = Math.min(
    100,
    Math.round(
      (total > 0 ? completed / total : 0) * 50 + // Completion weight
      (uniqueTechs / 20) * 30 +            // Tech diversity weight
      (inProgress > 0 ? 20 : 0)            // Active work bonus
    )
  );

  return {
    totalProjects: total,
    completedProjects: completed,
    inProgressProjects: inProgress,
    portfolioScore: score,
  };
}

export function getUniqueTechnologies(projects: Project[]): string[] {
  const techs = new Set<string>();
  for (const project of projects) {
    for (const tech of project.technologies) {
      techs.add(tech);
    }
  }
  // Sort alphabetically
  return [...techs].sort();
}

export interface RecruiterInsight {
  portfolioStrength: number;
  strengths: string[];
  improvements: string[];
  readinessSuggestions: string[];
}

export function getRecruiterInsight(projects: Project[]): RecruiterInsight {
  const stats = getPortfolioStats(projects);
  const techs = getUniqueTechnologies(projects);

  const hasPython = techs.includes("Python");
  const hasML = techs.some((t) => ["Scikit-learn", "XGBoost"].includes(t));
  const hasSQL = techs.some((t) => ["SQL", "PostgreSQL"].includes(t));
  const hasWeb = techs.some((t) => ["React", "Next.js"].includes(t));
  const hasViz = techs.some((t) => ["Matplotlib", "Seaborn", "Plotly", "Streamlit"].includes(t));
  const hasDevOps = techs.some((t) => ["Docker", "Git", "GitHub"].includes(t));

  const strengths: string[] = [];
  if (hasPython) strengths.push("Strong Python foundation across multiple projects");
  if (hasML) strengths.push("Hands-on ML experience with real-world datasets");
  if (hasSQL) strengths.push("Database and SQL querying skills demonstrated");
  if (hasWeb) strengths.push("Full-stack development capability");
  if (hasViz) strengths.push("Data visualization and dashboard building experience");
  if (hasDevOps) strengths.push("Version control and deployment workflows");
  if (stats.completedProjects >= 3) strengths.push("Portfolio shows ability to complete projects end-to-end");

  const improvements: string[] = [];
  if (!hasML) improvements.push("Add a machine learning project to demonstrate predictive modeling");
  if (!hasSQL) improvements.push("Include a project with SQL-based data analysis");
  if (!hasViz) improvements.push("Build an interactive data visualization dashboard");
  if (stats.completedProjects < 3) improvements.push("Complete more projects to show follow-through");
  if (!techs.includes("Docker")) improvements.push("Consider containerizing a project with Docker");
  if (improvements.length === 0) improvements.push("Add a deep learning or NLP project for advanced differentiation");
  improvements.push("Write detailed README documentation for each project");

  const readinessSuggestions: string[] = [
    "Practice explaining project decisions in mock interviews",
    "Prepare a 2-minute elevator pitch for your top project",
    "Be ready to discuss trade-offs and alternative approaches",
    "Quantify impact — recruiters love specific metrics (e.g. 92% accuracy, 18% RMSE reduction)",
  ];

  // Score: combination of completions, tech breadth, and strengths
  const portfolioStrength = Math.min(
    100,
    Math.round(
      (strengths.length / 7) * 60 +
      (stats.totalProjects > 0
        ? stats.completedProjects / stats.totalProjects
        : 0) * 30 +
      (stats.inProgressProjects > 0 ? 10 : 0)
    )
  );

  return { portfolioStrength, strengths, improvements, readinessSuggestions };
}
