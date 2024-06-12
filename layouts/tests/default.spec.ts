import { describe, it, expect } from "vitest";
import Default from "../default.vue";
import { mount } from "@vue/test-utils";
vi.stubGlobal("useRouter", () => ({}));
vi.stubGlobal("useSupabaseClient", () => ({}));
describe("Default layout", () => {
  it("should render correctly", () => {
    const wrapper = mount(Default);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it("hamberger icon should render correctly", () => {
    const wrapper = mount(Default);
    // const drawer = wrapper.find(".v-navigation-drawer");
    const hamburgerIcon = wrapper.find(".icon-selector"); // 用你的實際選擇器替換 '.icon-selector'
    // expect(hamburgerIcon.classes()).toContain("mdi-hamburger");
  });
});
