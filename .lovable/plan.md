## Phase 3: Project Tracking & Assessment Modules

### A. Project Tracking

#### Database Tables
1. **`projects`** — id, name, description, project_type (enum: field, internal), client_name, location, status (enum: planning, active, on_hold, completed, cancelled), start_date, end_date, budget, created_by, assigned_manager (staff_id), created_at, updated_at
2. **`project_tasks`** — id, project_id, title, description, assigned_to (staff_id), status (enum: todo, in_progress, review, done), priority (enum: low, medium, high, critical), due_date, completed_at, created_at, updated_at
3. **`project_updates`** — id, project_id, content, created_by, created_at
4. **`project_milestones`** — id, project_id, title, target_date, is_completed, completed_at, created_at

#### UI Components
- **Projects list page** (`/admin/projects` tab) — filterable by type, status, manager
- **Project detail view** — description, tasks board, milestones timeline, updates feed, progress chart
- **Create/Edit project form** — all fields including assigning a manager
- **Task management** — add/edit/delete tasks, assign to staff, change status
- **Charts** — project progress (tasks done vs total), status distribution pie chart

### B. Assessment Modules

#### Database Tables
5. **`performance_reviews`** — id, staff_id, reviewer_id, review_period, rating (1-5), strengths, areas_for_improvement, goals, status (enum: draft, submitted, acknowledged), created_at, updated_at
6. **`project_assessments`** — id, project_id, assessor_id, report_quality_score, field_safety_score, timeline_adherence_score, overall_score, comments, created_at
7. **`staff_competencies`** — id, staff_id, skill_name, proficiency_level (enum: beginner, intermediate, advanced, expert), certification_name, certification_date, expiry_date, created_at, updated_at

#### UI Components
- **Assessments tab** in Admin Dashboard with sub-tabs: Performance Reviews, Project Assessments, Competencies
- **Performance review form** — select staff, rate, provide feedback, set goals
- **Project assessment form** — score a completed project on quality/safety/timeline
- **Competency tracker** — manage skills and certifications per staff member

### C. Access Control
- Add `project_manager` to the `app_role` enum
- **Admin & HR**: Full access to everything
- **Project Managers**: Can create/edit projects assigned to them, manage tasks, and view assessments for their projects
- **Staff**: Future self-service view (read-only on assigned tasks)

### D. Navigation
- Add "Projects" and "Assessments" tabs to Admin Dashboard

### Implementation Order
1. Database migration (all tables, enums, RLS, new role)
2. Projects tab — list, create/edit form, detail view
3. Tasks & milestones management within projects
4. Project updates feed
5. Charts (progress, status distribution)
6. Performance reviews module
7. Project assessments module
8. Staff competencies module
