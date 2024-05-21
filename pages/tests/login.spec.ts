import { mount } from '@vue/test-utils';
import Login from '../login.vue';
import { vi } from 'vitest';

// Mock the useRouter hook
const mockUseRouter = () => {
  const push = vi.fn();
  vi.stubGlobal('useRouter', () => ({ push }));
  return push;
};

// Mock the useSupabaseClient hook
const mockUseSupabaseClient = () => {
  vi.stubGlobal('useSupabaseClient', () => ({
    auth: {
      getSession: vi.fn(() => Promise.resolve({data: { session: { user: {} } },  error: null })),
      signInWithPassword: vi.fn(() => Promise.resolve({ data: { user: {} }, error: null })),
    },
  }));
};


// Mock vue-router module
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}));

describe('Login', () => {
  let routerPush: any;

  beforeEach(() => {
    vi.resetAllMocks();
    routerPush = mockUseRouter();
    mockUseSupabaseClient();
  });

  it('should render correctly', () => {
    const wrapper = mount(Login);
    expect(wrapper.exists()).toBe(true);
  });

  it('should redirect to /admin if user is authenticated on mount', async () => {
    const wrapper = mount(Login);
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    expect(routerPush).toHaveBeenCalledWith('/admin');
  });
});
