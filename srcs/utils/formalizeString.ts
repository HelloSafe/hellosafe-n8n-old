export default function formalizeString(input: string) {
    // Normalize the string to separate base letters from diacritics
    let normalized = input.normalize("NFD");
    // Remove diacritics and other marks using a regular expression
    let cleaned = normalized.replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLocaleLowerCase();
    return cleaned;
};