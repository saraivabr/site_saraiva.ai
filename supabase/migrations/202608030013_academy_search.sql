-- The public editorial search indexes only published educational metadata.
-- CRM PII and private conversations remain outside this index.

alter table public.academy_courses
  add column search_document tsvector generated always as (
    to_tsvector(
      'portuguese',
      coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(author, '')
    )
  ) stored;
alter table public.academy_lessons
  add column search_document tsvector generated always as (
    to_tsvector(
      'portuguese',
      coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(body, '')
    )
  ) stored;
create index academy_courses_search_idx
  on public.academy_courses using gin (search_document);
create index academy_lessons_search_idx
  on public.academy_lessons using gin (search_document);
comment on column public.academy_courses.search_document is
  'Public editorial metadata search; visibility remains governed by RLS and editorial status.';
comment on column public.academy_lessons.search_document is
  'Educational content search; private user progress is never indexed.';
