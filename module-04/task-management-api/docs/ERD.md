# ERD - Task Management Web App

```mermaid
erDiagram
    users ||--o{ projects : "sở hữu"
    users ||--o{ project_members : "tham gia"
    projects ||--o{ project_members : "có thành viên"
    projects ||--o{ tasks : "chứa"
    users ||--o{ tasks : "được giao"
    tasks ||--o{ comments : "có"
    users ||--o{ comments : "viết"
    tasks ||--o{ attachments : "có"
    users ||--o{ attachments : "tải lên"

    users {
        int id PK
        string name
        string email UK
        string password
        datetime created_at
        datetime updated_at
    }

    projects {
        int id PK
        string name
        text description
        date start_date
        date end_date
        int owner_id FK
        datetime created_at
        datetime updated_at
    }

    project_members {
        int id PK
        int project_id FK
        int user_id FK
        datetime created_at
        datetime updated_at
    }

    tasks {
        int id PK
        int project_id FK
        string title
        text description
        enum status
        enum priority
        date due_date
        int assignee_id FK
        datetime created_at
        datetime updated_at
    }

    comments {
        int id PK
        int task_id FK
        int user_id FK
        text content
        datetime created_at
        datetime updated_at
    }

    attachments {
        int id PK
        int task_id FK
        int uploaded_by FK
        string original_name
        string file_name
        string mime_type
        int size
        datetime created_at
        datetime updated_at
    }
```

## Ràng buộc quan trọng

- `users.email` là duy nhất; `users.password` lưu chuỗi đã hash bằng bcrypt.
- `projects.owner_id` tham chiếu `users.id`.
- `project_members` có ràng buộc duy nhất trên cặp `(project_id, user_id)`.
- `tasks.project_id` tham chiếu `projects.id`; xóa dự án sẽ xóa toàn bộ công việc của dự án (`ON DELETE CASCADE`).
- `tasks.assignee_id` tham chiếu `users.id`; khi người dùng bị xóa, công việc chuyển về chưa có người phụ trách (`ON DELETE SET NULL`).
- `comments.task_id`, `attachments.task_id` xóa theo công việc (`ON DELETE CASCADE`).
- `comments.user_id`, `attachments.uploaded_by` xóa theo người dùng (`ON DELETE CASCADE`).

## Quan hệ tóm tắt

| Quan hệ | Kiểu | Mô tả |
| --- | --- | --- |
| users - projects | 1 - N | Một người sở hữu nhiều dự án |
| users - projects | N - N | Một người tham gia nhiều dự án, một dự án có nhiều thành viên (qua `project_members`) |
| projects - tasks | 1 - N | Một dự án có nhiều công việc |
| users - tasks | 1 - N | Một người được giao nhiều công việc |
| tasks - comments | 1 - N | Một công việc có nhiều bình luận |
| tasks - attachments | 1 - N | Một công việc có nhiều tệp đính kèm |
