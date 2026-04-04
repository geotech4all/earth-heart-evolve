## Staff Management Portal — Phase 2

### Database Schema
1. **`departments`** table — id, name, description, created_at
2. **`staff_roles`** table — id, name, description, created_at (custom roles like Geologist, Engineer, etc.)
3. **`staff`** table — id, user_id (nullable), first_name, last_name, email, phone, department_id, role_id, hire_date, status (enum: onboarding, active, inactive), profile_photo_url, created_at, updated_at
4. **`onboarding_checklists`** table — id, staff_id, item_name, is_completed, completed_at, created_at
5. **`staff_documents`** table — id, staff_id, document_name, document_type, file_url, uploaded_at
6. Add `hr` to the existing `app_role` enum for HR access control
7. Storage bucket `staff-documents` for document uploads

### RLS Policies
- Admin & HR roles can manage all staff data
- Staff members can view their own profile (future self-service)

### Pages & Components
1. **Staff Management page** (`/admin/staff`) — list all staff with search/filter
2. **Add/Edit Staff form** — registration with all fields
3. **Staff Profile view** — details, documents, onboarding progress
4. **Onboarding Checklist** — track completion of onboarding steps
5. **Departments & Roles management** — CRUD for custom departments and roles
6. **Document upload** — upload ID, certificates, contracts
7. **Welcome email notification** — send on staff creation

### Navigation
- Add Staff Management tab to the Admin Dashboard

### Implementation Order
1. Database migration (tables, enums, RLS, storage)
2. Admin dashboard tabs for Staff, Departments, Roles
3. Staff list & registration form
4. Onboarding checklist component
5. Document upload functionality
6. Welcome email notification
