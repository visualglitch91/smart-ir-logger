export function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = padWithZero(date.getMonth() + 1);
  const day = padWithZero(date.getDate());
  const hours = padWithZero(date.getHours());
  const minutes = padWithZero(date.getMinutes());
  const seconds = padWithZero(date.getSeconds());
  const milliseconds = padMilliseconds(date.getMilliseconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export function uniqueId(): string {
  const timestamp: number = Date.now();
  const randomPart: string = Math.random().toString(36).substring(2, 10); // Random string
  return btoa(`${timestamp.toString(36)}-${randomPart}`);
}

function padWithZero(number: number): string {
  return number.toString().padStart(2, "0");
}

function padMilliseconds(milliseconds: number): string {
  return milliseconds.toString().padStart(3, "0");
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    // Attempt to copy text to clipboard
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard:", text);
  } catch (err) {
    // Handle any errors
    console.error("Failed to copy text to clipboard:", err);
  }
}

export function takeRight<T>(array: T[], n: number): T[] {
  if (n >= array.length) {
    return array.slice();
  } else if (n <= 0) {
    return [];
  } else {
    return array.slice(array.length - n);
  }
}
