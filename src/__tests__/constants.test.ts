import {
  BUDGET_CATEGORIES,
  BUDGET_TIPS,
  SWISS_PASS_COSTS,
  SWISS_DESTINATIONS,
  SUPPORTED_LANGUAGES,
  LANGUAGE_LABELS,
  UI_STRINGS,
} from "@/lib/constants";

describe("constants", () => {
  describe("BUDGET_CATEGORIES", () => {
    it("has 5 categories", () => {
      expect(BUDGET_CATEGORIES).toHaveLength(5);
    });

    it("each category has low, mid, and high daily costs", () => {
      BUDGET_CATEGORIES.forEach((cat) => {
        expect(cat.dailyCost.low).toBeGreaterThan(0);
        expect(cat.dailyCost.mid).toBeGreaterThan(cat.dailyCost.low);
        expect(cat.dailyCost.high).toBeGreaterThan(cat.dailyCost.mid);
      });
    });

    it("each category has an id, label, and icon", () => {
      BUDGET_CATEGORIES.forEach((cat) => {
        expect(cat.id).toBeTruthy();
        expect(cat.label).toBeTruthy();
        expect(cat.icon).toBeTruthy();
      });
    });
  });

  describe("BUDGET_TIPS", () => {
    it("has tips for all supported languages", () => {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        expect(BUDGET_TIPS[lang]).toBeDefined();
        expect(BUDGET_TIPS[lang].length).toBeGreaterThan(0);
      });
    });

    it("each tip is a non-empty string", () => {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        BUDGET_TIPS[lang].forEach((tip) => {
          expect(typeof tip).toBe("string");
          expect(tip.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("SWISS_PASS_COSTS", () => {
    it("has valid CHF costs for all durations", () => {
      const keys = Object.keys(SWISS_PASS_COSTS) as (keyof typeof SWISS_PASS_COSTS)[];
      expect(keys.length).toBeGreaterThan(0);
      keys.forEach((key) => {
        expect(SWISS_PASS_COSTS[key]).toBeGreaterThan(0);
      });
    });

    it("3-day pass costs less than 1-month pass", () => {
      expect(SWISS_PASS_COSTS["3days"]).toBeLessThan(SWISS_PASS_COSTS["1month"]);
    });
  });

  describe("SWISS_DESTINATIONS", () => {
    it("includes Brienz as a destination", () => {
      const brienz = SWISS_DESTINATIONS.find((d) => d.id === "brienz");
      expect(brienz).toBeDefined();
      expect(brienz?.name).toBe("Brienz");
    });

    it("all destinations have id, name, and region", () => {
      SWISS_DESTINATIONS.forEach((dest) => {
        expect(dest.id).toBeTruthy();
        expect(dest.name).toBeTruthy();
        expect(dest.region).toBeTruthy();
      });
    });
  });

  describe("LANGUAGE_LABELS", () => {
    it("has labels for all supported languages", () => {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        expect(LANGUAGE_LABELS[lang]).toBeTruthy();
      });
    });
  });

  describe("UI_STRINGS", () => {
    it("has translations for all supported languages", () => {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        const strings = UI_STRINGS[lang];
        expect(strings).toBeDefined();
        expect(strings.welcome).toBeTruthy();
        expect(strings.chatTitle).toBeTruthy();
        expect(strings.budgetTitle).toBeTruthy();
        expect(strings.brienzTitle).toBeTruthy();
      });
    });

    it("has nav translations for all supported languages", () => {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        const nav = UI_STRINGS[lang].nav;
        expect(nav).toBeDefined();
        expect(nav.home).toBeTruthy();
        expect(nav.brienz).toBeTruthy();
        expect(nav.budget).toBeTruthy();
        expect(nav.itinerary).toBeTruthy();
      });
    });
  });
});
