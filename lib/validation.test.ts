import {
  validatePhone,
  validateEmail,
  validateAddress,
  validateZip,
  validateLocationName,
  sanitizePhone,
  sanitizeAddress,
} from "./validation";

describe("validation utilities", () => {
  describe("validatePhone", () => {
    it("accepts 10-digit phone numbers", () => {
      expect(validatePhone("1234567890")).toBe(true);
    });

    it("accepts formatted phone with dashes", () => {
      expect(validatePhone("123-456-7890")).toBe(true);
    });

    it("accepts formatted phone with parentheses", () => {
      expect(validatePhone("(123) 456-7890")).toBe(true);
    });

    it("accepts 11-digit with leading 1", () => {
      expect(validatePhone("11234567890")).toBe(true);
    });

    it("accepts E.164 format", () => {
      expect(validatePhone("+1-123-456-7890")).toBe(true);
    });

    it("rejects empty string", () => {
      expect(validatePhone("")).toBe(false);
    });

    it("rejects invalid length", () => {
      expect(validatePhone("123456")).toBe(false);
    });
  });

  describe("validateEmail", () => {
    it("accepts valid emails", () => {
      expect(validateEmail("test@example.com")).toBe(true);
    });

    it("accepts emails with subdomains", () => {
      expect(validateEmail("user@mail.example.co.uk")).toBe(true);
    });

    it("rejects missing @", () => {
      expect(validateEmail("testexample.com")).toBe(false);
    });

    it("rejects missing domain", () => {
      expect(validateEmail("test@")).toBe(false);
    });

    it("rejects spaces", () => {
      expect(validateEmail("test @example.com")).toBe(false);
    });
  });

  describe("validateZip", () => {
    it("accepts 5-digit ZIP", () => {
      expect(validateZip("12345")).toBe(true);
    });

    it("accepts ZIP+4", () => {
      expect(validateZip("12345-6789")).toBe(true);
    });

    it("rejects non-numeric", () => {
      expect(validateZip("abcde")).toBe(false);
    });

    it("rejects invalid length", () => {
      expect(validateZip("123")).toBe(false);
    });
  });

  describe("validateAddress", () => {
    it("accepts complete address", () => {
      const address = {
        street: "123 Main St",
        city: "Springfield",
        state: "IL",
        zip: "62701",
      };
      expect(validateAddress(address)).toBe(true);
    });

    it("rejects missing street", () => {
      const address = {
        street: "",
        city: "Springfield",
        state: "IL",
        zip: "62701",
      };
      expect(validateAddress(address)).toBe(false);
    });

    it("rejects invalid ZIP", () => {
      const address = {
        street: "123 Main St",
        city: "Springfield",
        state: "IL",
        zip: "invalid",
      };
      expect(validateAddress(address)).toBe(false);
    });
  });

  describe("validateLocationName", () => {
    it("accepts valid name", () => {
      expect(validateLocationName("Downtown Office")).toBe(true);
    });

    it("rejects empty string", () => {
      expect(validateLocationName("")).toBe(false);
    });

    it("rejects name exceeding 100 chars", () => {
      expect(validateLocationName("a".repeat(101))).toBe(false);
    });
  });

  describe("sanitizePhone", () => {
    it("converts 10-digit to E.164", () => {
      expect(sanitizePhone("1234567890")).toBe("+11234567890");
    });

    it("converts formatted to E.164", () => {
      expect(sanitizePhone("(123) 456-7890")).toBe("+11234567890");
    });

    it("preserves E.164 format", () => {
      expect(sanitizePhone("+11234567890")).toBe("+11234567890");
    });
  });

  describe("sanitizeAddress", () => {
    it("trims whitespace", () => {
      expect(sanitizeAddress("  123 Main St  ")).toBe("123 Main St");
    });

    it("normalizes multiple spaces", () => {
      expect(sanitizeAddress("123  Main   St")).toBe("123 Main St");
    });
  });
});
