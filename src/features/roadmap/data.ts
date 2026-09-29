import type { RoadmapCategory, RoadmapTopic } from "./types";

const roadmapCatalogSource: RoadmapCategory[] = [
  {
    id: "python",
    name: "Python",
    description: "Core Python programming for data science",
    topics: [
      {
        id: "py-1",
        name: "Variables & Data Types",
        difficulty: "beginner",
        estimatedHours: 3,
        resourceLink: "https://docs.python.org/3/tutorial/",
        lastStudied: "2026-07-20",
        mastery: "mastered",
      },
      {
        id: "py-2",
        name: "Control Flow & Loops",
        difficulty: "beginner",
        estimatedHours: 4,
        resourceLink: "https://docs.python.org/3/tutorial/controlflow.html",
        lastStudied: "2026-07-19",
        mastery: "mastered",
      },
      {
        id: "py-3",
        name: "Functions & Decorators",
        difficulty: "intermediate",
        estimatedHours: 5,
        resourceLink: "https://realpython.com/primer-on-python-decorators/",
        lastStudied: "2026-07-18",
        mastery: "practiced",
      },
      {
        id: "py-4",
        name: "Object-Oriented Programming",
        difficulty: "intermediate",
        estimatedHours: 8,
        resourceLink: "https://realpython.com/python3-object-oriented-programming/",
        lastStudied: "2026-07-15",
        mastery: "practiced",
      },
      {
        id: "py-5",
        name: "List Comprehensions & Generators",
        difficulty: "intermediate",
        estimatedHours: 3,
        resourceLink: "https://docs.python.org/3/howto/functional.html",
        lastStudied: "2026-07-14",
        mastery: "learning",
      },
      {
        id: "py-6",
        name: "Error Handling & Debugging",
        difficulty: "intermediate",
        estimatedHours: 4,
        resourceLink: "https://docs.python.org/3/tutorial/errors.html",
        mastery: "learning",
      },
      {
        id: "py-7",
        name: "File I/O & Serialization",
        difficulty: "beginner",
        estimatedHours: 3,
        resourceLink: "https://docs.python.org/3/tutorial/inputoutput.html",
        mastery: "not_started",
      },
      {
        id: "py-8",
        name: "NumPy & Pandas Fundamentals",
        difficulty: "advanced",
        estimatedHours: 12,
        resourceLink:
          "https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html",
        mastery: "not_started",
      },
    ],
  },
  {
    id: "sql",
    name: "SQL",
    description: "Database querying and data manipulation",
    topics: [
      {
        id: "sql-1",
        name: "Select & Filtering",
        difficulty: "beginner",
        estimatedHours: 3,
        resourceLink: "https://www.w3schools.com/sql/sql_select.asp",
        lastStudied: "2026-07-21",
        mastery: "mastered",
      },
      {
        id: "sql-2",
        name: "Joins (Inner, Left, Right, Full)",
        difficulty: "intermediate",
        estimatedHours: 5,
        resourceLink: "https://www.sqlitetutorial.net/sqlite-join/",
        lastStudied: "2026-07-20",
        mastery: "mastered",
      },
      {
        id: "sql-3",
        name: "Aggregations & Group By",
        difficulty: "intermediate",
        estimatedHours: 4,
        resourceLink: "https://www.thoughtspot.com/sql-tutorial/sql-group-by",
        lastStudied: "2026-07-18",
        mastery: "practiced",
      },
      {
        id: "sql-4",
        name: "Subqueries & CTEs",
        difficulty: "intermediate",
        estimatedHours: 5,
        resourceLink: "https://www.thoughtspot.com/sql-tutorial/sql-subquery",
        mastery: "learning",
      },
      {
        id: "sql-5",
        name: "Window Functions",
        difficulty: "advanced",
        estimatedHours: 6,
        resourceLink: "https://www.thoughtspot.com/sql-tutorial/sql-window-functions",
        mastery: "not_started",
      },
      {
        id: "sql-6",
        name: "Query Optimization & Indexing",
        difficulty: "advanced",
        estimatedHours: 5,
        resourceLink: "https://use-the-index-luke.com/sql/where-clause",
        mastery: "not_started",
      },
    ],
  },
  {
    id: "statistics",
    name: "Statistics",
    description: "Statistical foundations for data analysis",
    topics: [
      {
        id: "stat-1",
        name: "Descriptive Statistics",
        difficulty: "beginner",
        estimatedHours: 4,
        resourceLink:
          "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data",
        lastStudied: "2026-07-17",
        mastery: "mastered",
      },
      {
        id: "stat-2",
        name: "Probability Distributions",
        difficulty: "intermediate",
        estimatedHours: 6,
        resourceLink:
          "https://www.khanacademy.org/math/statistics-probability/random-variables-probability-distributions",
        lastStudied: "2026-07-16",
        mastery: "practiced",
      },
      {
        id: "stat-3",
        name: "Hypothesis Testing",
        difficulty: "intermediate",
        estimatedHours: 6,
        resourceLink:
          "https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample",
        lastStudied: "2026-07-12",
        mastery: "learning",
      },
      {
        id: "stat-4",
        name: "Confidence Intervals",
        difficulty: "intermediate",
        estimatedHours: 4,
        resourceLink:
          "https://www.khanacademy.org/math/statistics-probability/confidence-intervals-one-sample",
        mastery: "learning",
      },
      {
        id: "stat-5",
        name: "Correlation & Regression",
        difficulty: "intermediate",
        estimatedHours: 5,
        resourceLink:
          "https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data",
        mastery: "not_started",
      },
      {
        id: "stat-6",
        name: "Bayesian Statistics",
        difficulty: "advanced",
        estimatedHours: 8,
        resourceLink:
          "https://seeing-theory.brown.edu/bayesian-inference/index.html",
        mastery: "not_started",
      },
      {
        id: "stat-7",
        name: "A/B Testing",
        difficulty: "advanced",
        estimatedHours: 5,
        resourceLink: "https://www.evanmiller.org/ab-testing/",
        mastery: "not_started",
      },
    ],
  },
  {
    id: "ml",
    name: "Machine Learning",
    description: "Core ML algorithms and techniques",
    topics: [
      {
        id: "ml-1",
        name: "Linear Regression",
        difficulty: "beginner",
        estimatedHours: 5,
        resourceLink: "https://scikit-learn.org/stable/modules/linear_model.html",
        lastStudied: "2026-07-10",
        mastery: "practiced",
      },
      {
        id: "ml-2",
        name: "Logistic Regression",
        difficulty: "intermediate",
        estimatedHours: 5,
        resourceLink:
          "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression",
        lastStudied: "2026-07-08",
        mastery: "learning",
      },
      {
        id: "ml-3",
        name: "Decision Trees & Random Forests",
        difficulty: "intermediate",
        estimatedHours: 6,
        resourceLink: "https://scikit-learn.org/stable/modules/tree.html",
        mastery: "learning",
      },
      {
        id: "ml-4",
        name: "Support Vector Machines",
        difficulty: "advanced",
        estimatedHours: 6,
        resourceLink: "https://scikit-learn.org/stable/modules/svm.html",
        mastery: "not_started",
      },
      {
        id: "ml-5",
        name: "K-Means Clustering",
        difficulty: "intermediate",
        estimatedHours: 4,
        resourceLink:
          "https://scikit-learn.org/stable/modules/clustering.html#k-means",
        mastery: "not_started",
      },
      {
        id: "ml-6",
        name: "Neural Networks Basics",
        difficulty: "advanced",
        estimatedHours: 10,
        resourceLink:
          "https://docs.pytorch.org/tutorials/beginner/blitz/neural_networks_tutorial.html",
        mastery: "not_started",
      },
      {
        id: "ml-7",
        name: "Model Evaluation Metrics",
        difficulty: "intermediate",
        estimatedHours: 4,
        resourceLink:
          "https://scikit-learn.org/stable/modules/model_evaluation.html",
        mastery: "not_started",
      },
      {
        id: "ml-8",
        name: "Feature Engineering",
        difficulty: "advanced",
        estimatedHours: 7,
        resourceLink: "https://scikit-learn.org/stable/modules/preprocessing.html",
        mastery: "not_started",
      },
    ],
  },
  {
    id: "git",
    name: "Git & GitHub",
    description: "Version control and collaboration workflows",
    topics: [
      {
        id: "git-1",
        name: "Basic Commands (init, add, commit, push)",
        difficulty: "beginner",
        estimatedHours: 2,
        resourceLink: "https://git-scm.com/docs/gittutorial",
        lastStudied: "2026-07-21",
        mastery: "mastered",
      },
      {
        id: "git-2",
        name: "Branching & Merging",
        difficulty: "intermediate",
        estimatedHours: 3,
        resourceLink:
          "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging",
        lastStudied: "2026-07-20",
        mastery: "mastered",
      },
      {
        id: "git-3",
        name: "Pull Requests & Code Review",
        difficulty: "intermediate",
        estimatedHours: 3,
        resourceLink:
          "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests",
        lastStudied: "2026-07-19",
        mastery: "practiced",
      },
      {
        id: "git-4",
        name: "Conflict Resolution",
        difficulty: "intermediate",
        estimatedHours: 3,
        resourceLink:
          "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts",
        mastery: "learning",
      },
      {
        id: "git-5",
        name: "CI/CD Basics with GitHub Actions",
        difficulty: "advanced",
        estimatedHours: 5,
        resourceLink: "https://docs.github.com/en/actions",
        mastery: "not_started",
      },
    ],
  },
];

function stripCatalogProgress(categories: RoadmapCategory[]): RoadmapCategory[] {
  return categories.map((category) => ({
    ...category,
    topics: category.topics.map(
      ({ id, name, difficulty, estimatedHours, resourceLink }): RoadmapTopic => ({
        id,
        name,
        difficulty,
        estimatedHours,
        ...(resourceLink ? { resourceLink } : {}),
        mastery: "not_started",
      }),
    ),
  }));
}

/** Shared roadmap curriculum without user-specific progress. */
export const roadmapCatalogData = stripCatalogProgress(roadmapCatalogSource);

/** @deprecated Use roadmapCatalogData for authenticated runtime state. */
export const mockRoadmapData = roadmapCatalogData;
