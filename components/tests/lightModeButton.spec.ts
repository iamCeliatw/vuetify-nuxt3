import { mount } from "@vue/test-utils";
import LightModeButton from "../homepage/LightModeButton.vue";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockUseColorMode = vi.fn(() => ({
  value: "dark",
  preference: "dark",
}));

vi.stubGlobal("useColorMode", mockUseColorMode);

describe("LightModeButton", () => {
  beforeEach(() => {
    mockUseColorMode.mockClear();
  });

  it("renders correctly", () => {
    const wrapper = mount(LightModeButton);
    expect(wrapper.exists()).toBe(true);
    expect(mockUseColorMode).toHaveBeenCalled();
  });

  it("changes mode to light on input change when initial mode is dark", async () => {
    const wrapper = mount(LightModeButton);
    const input = wrapper.find("input");
    await input.trigger("change");
    const colorModeInstance = mockUseColorMode.mock.results[0].value;
    expect(colorModeInstance.preference).toBe("light");
  });

  it("changes mode to dark on input change when initial mode is light", async () => {
    mockUseColorMode.mockReturnValueOnce({
      value: "light",
      preference: "light",
    });

    const wrapper = mount(LightModeButton);
    const input = wrapper.find("input");
    await input.trigger("change");
    const colorModeInstance = mockUseColorMode.mock.results[0].value;
    expect(colorModeInstance.preference).toBe("dark");
  });
});
