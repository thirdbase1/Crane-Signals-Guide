import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a hexadecimal string to a valid Aleo field literal string.
 * This fixes the common "Failed to parse string" error where the Rust-based
 * snarkVM parser expects decimal values for large field literals.
 */
export function hexToField(hex: string): string {
    const cleanHex = hex.startsWith("0x") ? hex : "0x" + hex;
    try {
        return BigInt(cleanHex).toString() + "field";
    } catch (e) {
        throw new Error(`Invalid hexadecimal string provided: ${hex}`);
    }
}
