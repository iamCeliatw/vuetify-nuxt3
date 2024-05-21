import { mount } from "@vue/test-utils";
import LightModeButton from "../homepage/LightModeButton.vue";
// vi.stubGlobal("definePageMeta", vi.fn());
// vi.stubGlobal("useColorMode", vi.fn());

describe('LightModeButton', () => {
  let mockUseColorMode: any;

  beforeEach(() => {
    mockUseColorMode = vi.fn(() => ({
      value: 'dark',
    }));
    vi.stubGlobal('useColorMode', mockUseColorMode);
  });

  it('renders correctly', () => {
    const wrapper = mount(LightModeButton, {
    });
    expect(mockUseColorMode).toHaveBeenCalled();
  });

  it('changes mode on input change', async () => {
    const wrapper = mount(LightModeButton);
    const input = wrapper.find('input');
    await input.trigger('change');
    const colorModeInstance = mockUseColorMode.mock.results[0].value;
    console.log(colorModeInstance,"colorModeInstance");
    expect(colorModeInstance.preference).toBe('light');
  });
});