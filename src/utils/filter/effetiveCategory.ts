export const getEffectiveCategory = (category: string): string => {
    return category === "Overall" ? "" : category;
};