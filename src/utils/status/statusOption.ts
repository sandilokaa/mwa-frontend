export type StatusOption = {
    label: string;
    bgColor: string;
    textColor: string;
};

export const StatusIssueOptions: StatusOption[] = [
    { label: 'On Progress', bgColor: '#FFF9C4', textColor: '#ae8c02' },
    { label: 'Done', bgColor: '#DBF2F2', textColor: '#3e9c9c' },
];

export const StatusProductionOptions: StatusOption[] = [
    { label: 'Not Yet', bgColor: '#F4F5F5', textColor: '#7a7b7d' },
    { label: 'On Going', bgColor: '#FFF9C4', textColor: '#ae8c02' },
    { label: 'Done', bgColor: '#DBF2F2', textColor: '#3e9c9c' },
];

export const StatusEngineeringOptions: StatusOption[] = [
    { label: 'Not Yet', bgColor: '#F4F5F5', textColor: '#7a7b7d' },
    { label: 'On Going', bgColor: '#FFF9C4', textColor: '#ae8c02' },
    { label: 'Done', bgColor: '#DBF2F2', textColor: '#3e9c9c' },
];