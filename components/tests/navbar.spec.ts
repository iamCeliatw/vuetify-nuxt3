import { mount, shallowMount } from "@vue/test-utils";
import Navbar from "../homepage/Navbar.vue";
import LightModeButton from "../homepage/LightModeButton.vue";
vi.stubGlobal("useColorMode", vi.fn());
vi.stubGlobal(
  "useRouter",
  vi.fn(() => ({
    currentRoute: {
      value: {
        path: "/",
      },
    },
  }))
);

describe("Navbar", () => {
  it("should render correctly", () => {
    const wrapper = shallowMount(Navbar, {
      stubs: {
        //   HomepageNavbar: true,
        LightModeButton: true,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
