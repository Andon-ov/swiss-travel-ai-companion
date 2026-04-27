import { BRIENZ_STORIES } from "@/data/brienz";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

describe("BRIENZ_STORIES", () => {
  it("has at least 3 stories", () => {
    expect(BRIENZ_STORIES.length).toBeGreaterThanOrEqual(3);
  });

  it("each story has required fields", () => {
    BRIENZ_STORIES.forEach((story) => {
      expect(story.id).toBeTruthy();
      expect(story.location).toBeTruthy();
      expect(story.qrCode).toBeTruthy();
    });
  });

  it("each story has translations for all supported languages", () => {
    BRIENZ_STORIES.forEach((story) => {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        expect(story.title[lang]).toBeTruthy();
        expect(story.summary[lang]).toBeTruthy();
        expect(story.content[lang]).toBeTruthy();
      });
    });
  });

  it("QR codes are unique", () => {
    const qrCodes = BRIENZ_STORIES.map((s) => s.qrCode);
    const uniqueQrCodes = new Set(qrCodes);
    expect(uniqueQrCodes.size).toBe(qrCodes.length);
  });

  it("story IDs are unique", () => {
    const ids = BRIENZ_STORIES.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("QR codes follow the BRIENZ-XXX pattern", () => {
    const pattern = /^BRIENZ-\d{3}$/;
    BRIENZ_STORIES.forEach((story) => {
      expect(story.qrCode).toMatch(pattern);
    });
  });

  it("stories have image URLs", () => {
    BRIENZ_STORIES.forEach((story) => {
      expect(story.imageUrl).toBeTruthy();
      expect(story.imageUrl).toMatch(/^https?:\/\//);
    });
  });
});
