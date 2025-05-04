// src/utils.ts
export function getHighResPhoto(url: string | null | undefined, size: number = 400): string {
    if (!url) return "";
    return url.replace(/=s\d+-c$/, `=s${size}-c`);
}
