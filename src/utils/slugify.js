// slugify.js (or inline in each file)
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with dashes
    .replace(/[^\w\-]+/g, '')   // Remove non-alphanumeric chars
    .replace(/\-\-+/g, '-');    // Replace multiple dashes with single dash
}
