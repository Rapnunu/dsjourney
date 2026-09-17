/** Server-side input bounds for API validation. */

export const SESSION_TOPIC_NAME_MAX = 150;
export const SESSION_CATEGORY_NAME_MAX = 100;
export const SESSION_NOTES_MAX = 3000;
export const SESSION_TOPIC_ID_MAX = 64;
export const SESSION_ID_MAX = 100;
export const SESSION_HOURS_MAX = 24;

export const PORTFOLIO_TITLE_MAX = 150;
export const PORTFOLIO_DESCRIPTION_MAX = 5000;
export const PORTFOLIO_TECH_ITEM_MAX = 100;
export const PORTFOLIO_TECH_MAX_COUNT = 30;
export const PORTFOLIO_HIGHLIGHT_ITEM_MAX = 500;
export const PORTFOLIO_HIGHLIGHT_MAX_COUNT = 30;
export const PORTFOLIO_URL_MAX = 2048;
export const PORTFOLIO_ID_MAX = 100;

export const ROADMAP_TOPIC_ID_MAX = 64;

export const MAX_SESSIONS_IMPORT = 500;
export const MAX_ROADMAP_IMPORT = 500;
export const MAX_PORTFOLIO_IMPORT = 200;

/** Matches UI and Neon Auth default minimum (Better Auth email/password). */
export const MIN_PASSWORD_LENGTH = 6;
