export const extractFilename = (url: string) => {
    const path = new URL(url).pathname;
    return path.startsWith('/') ? path.slice(1) : path;
};