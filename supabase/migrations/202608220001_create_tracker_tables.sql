begin;

-- StudySession records. Text IDs preserve the application's existing s-* IDs,
-- while the composite key allows the same seeded ID for different users.
create table public.study_sessions (
  user_id uuid not null references auth.users (id) on delete cascade,
  id text not null,
  topic_id text not null,
  topic_name text not null,
  category_name text not null,
  study_date date not null,
  hours_studied numeric not null,
  difficulty_rating smallint not null,
  notes text not null,
  created_at timestamptz not null default now(),

  primary key (user_id, id),
  constraint study_sessions_id_not_blank check (btrim(id) <> ''),
  constraint study_sessions_topic_id_not_blank check (btrim(topic_id) <> ''),
  constraint study_sessions_topic_name_not_blank check (btrim(topic_name) <> ''),
  constraint study_sessions_category_name_not_blank check (btrim(category_name) <> ''),
  constraint study_sessions_hours_positive check (hours_studied > 0),
  constraint study_sessions_difficulty_valid check (difficulty_rating between 1 and 5)
);

-- Only user-specific roadmap state is stored here. Static topic metadata remains
-- in the application's roadmap dataset.
create table public.roadmap_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  topic_id text not null,
  mastery text not null,
  last_studied date,

  primary key (user_id, topic_id),
  constraint roadmap_progress_topic_id_not_blank check (btrim(topic_id) <> ''),
  constraint roadmap_progress_mastery_valid check (
    mastery in ('not_started', 'learning', 'practiced', 'mastered')
  )
);

-- Project records. Existing string IDs and string-array fields are preserved.
create table public.portfolio_projects (
  user_id uuid not null references auth.users (id) on delete cascade,
  id text not null,
  title text not null,
  description text not null,
  status text not null,
  technologies text[] not null default '{}',
  github_url text,
  demo_url text,
  highlights text[] not null default '{}',
  start_date date not null,
  end_date date,

  primary key (user_id, id),
  constraint portfolio_projects_id_not_blank check (btrim(id) <> ''),
  constraint portfolio_projects_title_not_blank check (btrim(title) <> ''),
  constraint portfolio_projects_status_valid check (
    status in ('planned', 'in_progress', 'completed')
  ),
  constraint portfolio_projects_dates_valid check (
    end_date is null or end_date >= start_date
  )
);

-- Common user-scoped sorting and filtering paths. The composite primary keys
-- already index lookups by user_id and record/topic ID.
create index study_sessions_user_date_idx
  on public.study_sessions (user_id, study_date desc);

create index roadmap_progress_user_mastery_idx
  on public.roadmap_progress (user_id, mastery);

create index portfolio_projects_user_status_idx
  on public.portfolio_projects (user_id, status);

alter table public.study_sessions enable row level security;
alter table public.roadmap_progress enable row level security;
alter table public.portfolio_projects enable row level security;

create policy "Users can select their own study sessions"
  on public.study_sessions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own study sessions"
  on public.study_sessions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own study sessions"
  on public.study_sessions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own study sessions"
  on public.study_sessions
  for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can select their own roadmap progress"
  on public.roadmap_progress
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own roadmap progress"
  on public.roadmap_progress
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own roadmap progress"
  on public.roadmap_progress
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own roadmap progress"
  on public.roadmap_progress
  for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can select their own portfolio projects"
  on public.portfolio_projects
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own portfolio projects"
  on public.portfolio_projects
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own portfolio projects"
  on public.portfolio_projects
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own portfolio projects"
  on public.portfolio_projects
  for delete
  to authenticated
  using (auth.uid() = user_id);

revoke all on table public.study_sessions from anon;
revoke all on table public.roadmap_progress from anon;
revoke all on table public.portfolio_projects from anon;

grant select, insert, update, delete on table public.study_sessions to authenticated;
grant select, insert, update, delete on table public.roadmap_progress to authenticated;
grant select, insert, update, delete on table public.portfolio_projects to authenticated;

commit;
