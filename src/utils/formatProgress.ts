export const formatProgress = (value?: string) => {
    const map: Record<string, string> = {
        'pr approved': 'PR Approved',
        'po confirmed': 'PO Confirmed',
        'paid': 'Paid',
        'delivered': 'Delivered'
    };
    return map[value ?? ''] || value || '-';
};
