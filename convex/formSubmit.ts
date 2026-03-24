"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

/**
 * Form Submission Automation via Puppeteer
 * Handles non-API directories that require manual form filling
 *
 * Prerequisites:
 * 1. Node.js runtime (use "use node" directive)
 * 2. Puppeteer library (bun add puppeteer)
 * 3. Fly.io worker coordination
 */

// Type definitions for form submission
interface FormSubmissionData {
  businessName: string;
  address: string;
  phone: string;
  website?: string;
  city: string;
  state: string;
  zipCode: string;
  email?: string;
}

interface FormSubmissionResult {
  success: boolean;
  directoryKey: string;
  submissionId: string;
  timestamp: number;
  error?: string;
  screenshot?: string; // Base64 on error
}

/**
 * Submit to a form-based directory using Puppeteer
 * Runs in a Fly.io worker environment
 *
 * Supported directories:
 * - CitySearch
 * - YellowPages (form backup)
 * - Mapquest
 * - DexKnows
 * - Thumbtack
 */
export const submitFormDirectory = internalAction({
  args: {
    submissionId: v.id("submissions"),
    directoryKey: v.string(), // "citysearch", "yellowpages_form", "mapquest", etc.
    locationData: v.object({
      businessName: v.string(),
      address: v.string(),
      phone: v.string(),
      website: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      email: v.optional(v.string()),
    }),
  },
  handler: async (_ctx, args): Promise<FormSubmissionResult> => {
    try {
      // Lazy load Puppeteer (only when needed)
      const puppeteer = require("puppeteer");

      // Route to appropriate handler
      const result = await submitToFormDirectory(
        puppeteer,
        args.directoryKey,
        args.locationData
      );

      return {
        directoryKey: args.directoryKey,
        submissionId: args.submissionId,
        timestamp: Date.now(),
        ...result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      return {
        success: false,
        directoryKey: args.directoryKey,
        submissionId: args.submissionId,
        timestamp: Date.now(),
        error: errorMessage,
      };
    }
  },
});

/**
 * Route to directory-specific form handler
 */
async function submitToFormDirectory(
  puppeteer: any,
  directoryKey: string,
  locationData: FormSubmissionData
): Promise<{ success: boolean; error?: string }> {
  const browser = await puppeteer.launch({ headless: true });

  try {
    switch (directoryKey) {
      case "citysearch":
        return await submitCitySearch(browser, locationData);
      case "yellowpages_form":
        return await submitYellowPagesForm(browser, locationData);
      case "mapquest":
        return await submitMapquest(browser, locationData);
      case "dexknows":
        return await submitDexKnows(browser, locationData);
      case "thumbtack":
        return await submitThumbTack(browser, locationData);
      default:
        throw new Error(`Unknown form directory: ${directoryKey}`);
    }
  } finally {
    await browser.close();
  }
}

/**
 * CitySearch Form Submission
 * URL: https://www.citysearch.com/
 *
 * Form fields: Business name, address, phone, website
 * Success indicator: Confirmation page or modal
 */
async function submitCitySearch(
  browser: any,
  data: FormSubmissionData
): Promise<{ success: boolean; error?: string }> {
  const page = await browser.newPage();

  try {
    // Navigate to CitySearch add business page
    await page.goto("https://www.citysearch.com/", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Find and click "Claim Business" or "Add Business" button
    const claimButton = await page.$('button[aria-label*="Claim"]');
    if (!claimButton) {
      throw new Error("Could not find Claim Business button");
    }
    await claimButton.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // Fill form fields
    await page.type('input[name="businessName"]', data.businessName);
    await page.type('input[name="address"]', data.address);
    await page.type('input[name="phone"]', data.phone);
    if (data.website) {
      await page.type('input[name="website"]', data.website);
    }

    // Submit form
    const submitBtn = await page.$('button[type="submit"]');
    if (!submitBtn) {
      throw new Error("Could not find submit button");
    }
    await submitBtn.click();

    // Wait for confirmation (success page or modal)
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 });

    // Check for success indicator
    const confirmationText = await page.$eval(
      "body",
      (el: HTMLElement) => el.innerText
    );
    if (confirmationText.includes("success") || confirmationText.includes("submitted")) {
      return { success: true };
    }

    return { success: false, error: "No confirmation detected" };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMsg };
  } finally {
    await page.close();
  }
}

/**
 * YellowPages Form Submission (backup method)
 * URL: https://www.yellowpages.com/
 *
 * Note: YellowPages has API (premium), this is form fallback
 */
async function submitYellowPagesForm(
  _browser: any,
  _data: FormSubmissionData
): Promise<{ success: boolean; error?: string }> {
  // Placeholder: implement similar to CitySearch
  return {
    success: false,
    error: "YellowPages form submission not yet implemented",
  };
}

/**
 * Mapquest Local Business Form Submission
 */
async function submitMapquest(
  _browser: any,
  _data: FormSubmissionData
): Promise<{ success: boolean; error?: string }> {
  // Placeholder
  return {
    success: false,
    error: "Mapquest form submission not yet implemented",
  };
}

/**
 * DexKnows Directory Form Submission
 */
async function submitDexKnows(
  _browser: any,
  _data: FormSubmissionData
): Promise<{ success: boolean; error?: string }> {
  // Placeholder
  return {
    success: false,
    error: "DexKnows form submission not yet implemented",
  };
}

/**
 * ThumbTack Service Directory Form Submission
 */
async function submitThumbTack(
  _browser: any,
  _data: FormSubmissionData
): Promise<{ success: boolean; error?: string }> {
  // Placeholder
  return {
    success: false,
    error: "ThumbTack form submission not yet implemented",
  };
}
