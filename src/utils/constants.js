const UserRoleEnum = {
    ADMIN: "admin",
    PROJECT_ADMIN: "project_admin",
    MEMBER: "member"
}
const AvailableUserRole = Object.values(UserRoleEnum)

const TaskStatusEnum = {
    TODO: "todo",
    IN_PROGRESS:"in_progress",
    DONE: "done"
}
const AvailableTaskStatues = Object.values(TaskStatusEnum)


module.exports = {
    UserRoleEnum,
    AvailableUserRole,
    TaskStatusEnum,
    AvailableTaskStatues
}

