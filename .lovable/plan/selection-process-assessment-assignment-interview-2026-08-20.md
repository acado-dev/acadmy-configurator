# Selection Process: Assessment, Assignment, Interview

Add three new modules under **Form Configuration** in the university admin sidebar, each with the same lifecycle: create → list → search/filter → review responses → evaluate → update selection status.

## Navigation

Under Form Configuration, add: **Assessment**, **Assignment**, **Interview** (after Selection Process). Routes stay under the `/university` prefix:

```text
/university/assessments                  list + search/filters
/university/assessments/new              create (embedded page wizard-style form)
/university/assessments/:id/edit         edit
/university/assessments/:id/responses    student response list
/university/assessments/:id/responses/:studentId   review + evaluate

same pattern for /university/assignments and /university/interviews
```

## 1. Assessment

Create form: course, title, description, start date/time, end date/time, number of questions, question type (MCQ / Descriptive / Mixed), passing score, shortlisting cut-off, max attempts, duration, randomize questions, negative marking, instructions, status (Draft / Active / Closed).

Listing table: name, course, start date, end date, questions, status badge, responses count (clickable), actions View / Edit / Delete (delete behind confirm dialog).

Filters: search by name, course, status, date range, Clear filters.

Responses screen: student name, masked email, course, submission date, score, result (Pass/Fail), selection status, View Response. Review screen shows every question with the student's answer, correct answer where applicable, per-question marks, total score, evaluator remarks, and a selection status control.

## 2. Assignment

Create form: course, title, instructions (rich text), start date/time, submission deadline, assignment type, maximum marks, passing/shortlisting criteria, reference files (file upload **or** URL), submission type (File Upload / Text / Link / Other), allowed file types, max file size, late submission allowed, status.

Listing table: name, course, start date, deadline, total submissions (clickable), status, actions.

Filters: search, course, status, deadline range, Clear filters.

Submissions screen: student name, masked email, course, submission date, submission status (On time / Late / Pending), marks, selection status, View Submission. Review screen shows the submitted file/text/link with a preview or download link, a marks input validated against maximum marks, feedback box, and selection status control.

## 3. Interview

Create form: course, title, description/instructions, interview type (Video / Live / Other), start and end date/time, duration, number of questions, question pool (add/remove questions, each marked Mandatory or Optional), preparation time, response time per question, passing/shortlisting criteria, status.

Listing table: name, course, type, scheduled date + duration, questions, responses/attempts (clickable), status, actions.

Filters: search, course, interview type, status, date range, Clear filters.

Responses screen: student name, masked email, course, interview date, completion status, score/evaluation, selection status, View Interview. Review screen lists each question with the recorded video (player for video type) or text response, per-question rating, overall evaluation score, remarks, and selection status control.

## Common selection status

One shared status set across all three modules: **Shortlisted, Accepted, Rejected, On Hold** (plus `pending` as the untouched default). A shared badge component gives each status consistent colour. Every status change is written into a single per-student selection history store so progress across Assessment → Assignment → Interview is visible; the review screens show a small "progress across stages" strip so the admin can see the student's status at the other stages.

## Technical notes

- Storage: `localStorage` only, consistent with the rest of the app — keys `universityAssessments`, `universityAssignments`, `universityInterviews`, plus `*Responses` / `*Submissions` and `studentSelectionStatus`. Each store seeds realistic sample data on first load (a few activities per course and a handful of student responses) so the screens are not empty.
- New hooks: `useAssessments`, `useAssignments`, `useInterviews`, and `useSelectionStatus` (shared status read/write + history), following the pattern in `useApplicationProcess.ts`.
- New types: `src/types/assessment.ts`, `assignment.ts`, `interview.ts`, with a shared `SelectionStatus` union.
- Courses come from the existing `universityCourses` store used by `UniversityCourses.tsx`.
- UI reuses existing shadcn primitives and the listing/detail layout patterns already used by the courses and applications pages; creation uses embedded pages (not modals), per project convention. Emails are masked in lists.
- Sidebar entries added to `src/components/UniversityLayout.tsx`; routes added to `src/App.tsx`.
