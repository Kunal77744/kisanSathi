/**
 * Simple helper to merge class names conditionally.
 * Combines active class lists and filters out falsy values.
 */
export function cn(...inputs: (string | undefined | null | boolean | {[key: string]: boolean})[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}
