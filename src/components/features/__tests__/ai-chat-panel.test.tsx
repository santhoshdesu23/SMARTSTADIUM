import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AiChatPanel } from "@/components/features/ai-chat-panel";

describe("AiChatPanel", () => {
  it("provides accessible input guidance for assistive technology", () => {
    render(
      <AiChatPanel
        assistantType="accessibility"
        title="Accessibility AI Assistant"
        suggestions={["Need help with seating"]}
      />
    );

    const input = screen.getByLabelText(/message input/i);
    expect(input).toHaveAttribute("aria-describedby", "chat-input-help");
    expect(screen.getByText(/press enter to send, shift\+enter for a new line/i)).toBeInTheDocument();
  });
});
