import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi, type Mock } from 'vitest';
import GithubMessageBoard from '../homepage/MessageBoard.vue';
import Giscus from '@giscus/vue';


describe('GithubMessageBoard', () => {
  let mockUseColorMode: any;

  beforeEach(() => {
    mockUseColorMode = vi.fn(() => ({
      value: 'light',
    }));
    vi.stubGlobal('useColorMode', mockUseColorMode);
    vi.stubGlobal('Giscus', vi.fn());
  });
  it('should render correctly', () => {
    const colorModeMock = { value: 'light' };
    (useColorMode as Mock).mockReturnValue(colorModeMock);

    const wrapper = shallowMount(GithubMessageBoard, {
      global: {
        components: {
          Giscus,
        },
      },
    });

    expect(wrapper.findComponent(Giscus).exists()).toBe(true);
    expect(wrapper.findComponent(Giscus).props('theme')).toBe('light_protanopia');
  });

  it('should compute theme correctly based on color mode', () => {
    const colorModeMock = { value: 'dark' };
    (useColorMode as Mock).mockReturnValue(colorModeMock);

    const wrapper = shallowMount(GithubMessageBoard, {
      global: {
        components: {
          Giscus,
        },
      },
    });

    expect(wrapper.findComponent(Giscus).props('theme')).toBe('dark_protanopia');
  });
});
