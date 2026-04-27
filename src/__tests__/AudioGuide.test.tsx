import { render, screen, fireEvent } from "@testing-library/react";
import { AudioGuide } from "@/components/AudioGuide";
import { BRIENZ_STORIES } from "@/data/brienz";

const story = BRIENZ_STORIES[0];

describe("AudioGuide", () => {
  it("renders the story title", () => {
    render(<AudioGuide story={story} language="en" />);
    expect(screen.getByText(story.title.en)).toBeInTheDocument();
  });

  it("renders the story summary", () => {
    render(<AudioGuide story={story} language="en" />);
    expect(screen.getByText(story.summary.en)).toBeInTheDocument();
  });

  it("renders the story location", () => {
    render(<AudioGuide story={story} language="en" />);
    expect(screen.getByText(story.location)).toBeInTheDocument();
  });

  it("renders in Chinese", () => {
    render(<AudioGuide story={story} language="zh" />);
    expect(screen.getByText(story.title.zh)).toBeInTheDocument();
  });

  it("renders in Japanese", () => {
    render(<AudioGuide story={story} language="ja" />);
    expect(screen.getByText(story.title.ja)).toBeInTheDocument();
  });

  it("renders in Korean", () => {
    render(<AudioGuide story={story} language="ko" />);
    expect(screen.getByText(story.title.ko)).toBeInTheDocument();
  });

  it("shows the QR code", () => {
    render(<AudioGuide story={story} language="en" />);
    // The QR code appears in multiple places; use getAllByText
    const qrElements = screen.getAllByText(new RegExp(story.qrCode!));
    expect(qrElements.length).toBeGreaterThan(0);
  });

  it("expands story content when 'Read the full story' is clicked", () => {
    render(<AudioGuide story={story} language="en" />);
    // Content should not be visible initially (collapsed)
    const toggleBtn = screen.getByRole("button", { name: /read/i });
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggleBtn);

    expect(toggleBtn).toHaveAttribute("aria-expanded", "true");
  });

  it("shows the audio guide player", () => {
    render(<AudioGuide story={story} language="en" />);
    expect(screen.getByText("Audio Guide")).toBeInTheDocument();
  });

  it("shows the audio guide in Chinese", () => {
    render(<AudioGuide story={story} language="zh" />);
    expect(screen.getByText("语音导览")).toBeInTheDocument();
  });
});
