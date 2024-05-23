import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import Slug from '../[...slug].vue';
import { useRoute } from 'vue-router';

// 模拟 definePageMeta 函数
vi.stubGlobal('definePageMeta', vi.fn());
vi.stubGlobal('setPageLayout', vi.fn());
const mockUseRoute = () => {
  //params 
  vi.stubGlobal('useRoute', vi.fn(() => ({
    params: {
      slug: ['admin', 'path']
    }
  }))
);
}
// 模拟 vue-router 模块
vi.mock('vue-router', () => ({
  useRoute: vi.fn()
}));

describe('Slug', () => {
  beforeEach(() => {
    mockUseRoute();
    const routeMock = {
      params: {
        slug: ['admin', 'path']
      }
    };
    (useRoute as unknown as Mock).mockReturnValue(routeMock);
  });

  it('renders correctly', () => {
    const wrapper = mount(Slug);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
