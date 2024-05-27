import { shallowMount } from "@vue/test-utils";
import Article from "../article/[key].vue";
vi.stubGlobal(
  "useHead",
  vi.fn(() => ({ title: "Article" }))
);
vi.stubGlobal("useRouter", () => ({}));

const mockUseRoute = () => {
  //params
  vi.stubGlobal(
    "useRoute",
    vi.fn(() => ({
      params: {
        key: ["test"],
      },
    }))
  );
};
const mockUseAsyncData = (data: any) => {
  vi.stubGlobal(
    "useAsyncData",
    vi.fn(() => ({
      data: ref([{ title: "Test Title", description: "Test Description" }]),
      pending: ref(false),
      error: ref(null),
    }))
  );
};

const mockUseSupabaseClient = (data: any) => {
  vi.stubGlobal(
    "useSupabaseClient",
    vi.fn(() => ({
      data: ref(data),
      pending: ref(false),
      error: ref(null),
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          equal: vi.fn(() =>
            Promise.resolve({
              equal: vi.fn(() =>
                Promise.resolve({
                  data: [
                    {
                      id: 1,
                      title: "Test Article",
                      description: "This is a test article",
                    },
                  ],
                  error: null,
                })
              ),
            })
          ),
        })),
      })),
    }))
  );
};

describe("Article", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockUseSupabaseClient([]);
    mockUseRoute();
    mockUseAsyncData([]);
  });
  it("should render correctly", () => {
    const wrapper = shallowMount(Article);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it("useHead should be called with specific object", () => {
    const wrapper = shallowMount(Article);
    expect(useHead).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Title",
        meta: [
          {
            property: "og:title",
            content: "Test Title",
          },
          {
            property: "og:description",
            content: "Test Description",
          },
        ],
      })
    );
  });
});
