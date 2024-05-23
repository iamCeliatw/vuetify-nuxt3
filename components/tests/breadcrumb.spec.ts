import type { Mock } from "vitest";
import BreadCrumb from "../homepage/BreadCrumb.vue";
import { mount, shallowMount } from "@vue/test-utils";

vi.stubGlobal("useRoute", vi.fn());
vi.stubGlobal("useRouter", vi.fn());
//watch the route change
describe('BreadCrumb', () => {
  beforeEach(() => {

  });
  it('should render correctly', () => {
    const routeMock = {
      path: '/some/path',
      matched: [
        { meta: { title: 'Page 1' }, name: 'page1', path: '/page1' },
        { meta: { title: 'Page 2' }, name: 'page2', path: '/page2' }
      ],
      params: {}
    };
    
    (useRoute as unknown as Mock).mockReturnValue(routeMock);
    (useRouter as unknown as Mock).mockReturnValue({});
    const wrapper = shallowMount(BreadCrumb, {
      stubs: {
        'v-breadcrumbs': true,
        'v-icon': true
      }
    });

    // console.log(wrapper.vm.items,"~~");
    const expectedItems = [
      { title: 'Home', href: '/', disabled: false },
      { title: 'Page 1', href: '/page1', disabled: false },
      { title: 'Page 2', href: '/page2', disabled: true }
    ];

    expect((wrapper.vm as any).items).toEqual(expectedItems);
  });
  
})