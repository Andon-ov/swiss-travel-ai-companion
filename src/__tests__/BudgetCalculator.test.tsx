import { render, screen, fireEvent } from "@testing-library/react";
import { BudgetCalculator } from "@/components/BudgetCalculator";

describe("BudgetCalculator", () => {
  it("renders without crashing", () => {
    render(<BudgetCalculator />);
    expect(screen.getByText(/Budget Planner/i)).toBeInTheDocument();
  });

  it("shows CHF total", () => {
    render(<BudgetCalculator />);
    // CHF total is shown in the large total amount element
    expect(screen.getByText(/CHF\s+1,200/)).toBeInTheDocument();
  });

  it("renders in Chinese", () => {
    render(<BudgetCalculator language="zh" />);
    expect(screen.getByText(/预算规划器/)).toBeInTheDocument();
  });

  it("renders in Japanese", () => {
    render(<BudgetCalculator language="ja" />);
    expect(screen.getByText(/予算プランナー/)).toBeInTheDocument();
  });

  it("renders in Korean", () => {
    render(<BudgetCalculator language="ko" />);
    expect(screen.getByText(/예산 플래너/)).toBeInTheDocument();
  });

  it("has a Swiss Travel Pass toggle", () => {
    render(<BudgetCalculator />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("toggles Swiss Travel Pass on click", () => {
    render(<BudgetCalculator />);
    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("has budget tier buttons", () => {
    render(<BudgetCalculator />);
    expect(screen.getByText("Budget")).toBeInTheDocument();
    expect(screen.getByText("Mid-range")).toBeInTheDocument();
    expect(screen.getByText("Luxury")).toBeInTheDocument();
  });

  it("has a days range slider", () => {
    render(<BudgetCalculator />);
    const slider = screen.getByLabelText("Number of days");
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("type", "range");
  });

  it("shows money-saving tips", () => {
    render(<BudgetCalculator />);
    expect(screen.getByText(/Money-Saving Tips/i)).toBeInTheDocument();
  });
});
