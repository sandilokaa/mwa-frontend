import { StatusIssueOptions, StatusOption } from "./statusOption";

export const getIssueOptions = (status: string, revisionDate?: string | Date |null): StatusOption[] => {
    const isOverdue = status === 'overdue';
    const hasRevisionDate = Boolean(revisionDate);

    if (isOverdue && hasRevisionDate) {
        return StatusIssueOptions.filter(option => option.label === 'Done');
    }

    return StatusIssueOptions;
};