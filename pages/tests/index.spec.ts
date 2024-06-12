import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { shallowMount } from "@vue/test-utils";
import HomePage from "../index.vue";
import { ref } from "vue";

// 模拟函数
const mockUseColorMode = () => {
  vi.stubGlobal(
    "useColorMode",
    vi.fn(() => ({ value: "dark" }))
  );
};
vi.stubGlobal(
  "useHead",
  vi.fn(() => ({ title: "Home" }))
);
const mockUseAsyncData = (data: any) => {
  vi.stubGlobal(
    "useAsyncData",
    vi.fn(() => ({
      data: ref(data),
      pending: ref(false),
      error: ref(null),
    }))
  );
};

const mockUseSupabaseClient = () => {
  vi.stubGlobal(
    "useSupabaseClient",
    vi.fn(() => ({
      from: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    }))
  );
};

const mockUseRouter = () => {
  const push = vi.fn();
  const currentRoute = { value: { path: "/" } };
  vi.stubGlobal("useRouter", () => ({
    push,
    currentRoute,
  }));
  return { push, currentRoute };
};

vi.mock("@nuxtjs/composition-api", () => ({
  useAsyncData: vi.fn(),
  useColorMode: vi.fn(() => ({ preference: "light" })),
}));

vi.mock("@supabase/auth-helpers-vue", () => ({
  useSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(),
    })),
  })),
}));

vi.mock("vue-router", () => ({
  useRouter: vi.fn(),
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockUseColorMode();
    mockUseAsyncData([]);
    mockUseSupabaseClient();
    mockUseRouter();
    // mockUseRoute();
  });

  it("should render correctly", () => {
    const wrapper = shallowMount(HomePage, {
      stubs: {
        HomepageNavbar: true,
        HomepageMainSection: {
          template: '<div class="mock-main-section"></div>',
          props: ["articles", "pending", "error"],
        },
        HomepageMessageBoard: true,
        HomepageBreadCrumb: {
          template: '<div class="bread-crumb"></div>',
        },
      },
    });
  });

  it("shows articles when loaded", async () => {
    const articlesData = [
      {
        id: 1,
        category_id: 1,
        status: 1,
        content: "<h2>在Nuxt3中動態設定Layout</h2>",
        description: "test",
        key: "nuxt",
        title: "Article 1",
        publish_date: "2024-05-05T00:00:00",
      },
      {
        id: 2,
        category_id: 1,
        status: 1,
        content: "<h2>在Nuxt3中動態設定Layout</h2>",
        description: "test",
        key: "nuxt",
        title: "Article 1",
        publish_date: "2024-05-05T00:00:00",
      },
    ];
    (useAsyncData as unknown as Mock).mockReturnValueOnce({
      data: ref(articlesData),
      pending: ref(false),
      error: ref(null),
    });

    const wrapper = shallowMount(HomePage, {
      stubs: {
        HomepageNavbar: true,
        HomepageMainSection: {
          template: '<div class="mock-main-section"></div>',
          props: ["articles", "pending", "error"],
        },
        HomepageMessageBoard: true,
        HomepageBreadCrumb: true,
      },
    });
    await wrapper.vm.$nextTick();

    const mainSection = wrapper.findComponent({ name: "MainSection" });
    expect(mainSection.exists()).toBe(true);
    expect(mainSection.props("articles")).toEqual(articlesData);
  });
});
