export const formatProgressProc = (value?: string) => {
    const map: Record<string, string> = {
        'pr approved': 'PR Approved',
        'po confirmed': 'PO Confirmed',
        'paid': 'Paid',
        'delivered': 'Delivered'
    };
    return map[value ?? ''] || value || '-';
};

export const formatProgressRec = (value?: string) => {
    const map: Record<string, string> = {
        'interview hr': 'Interview HR',
        'interview user': 'Interview User',
        'interview comben': 'Interview Comben',
        'offer letter': 'Offer Letter'
    };
    return map[value ?? ''] || value || '-';
};
