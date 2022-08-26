import { int } from '../src/float';
import { ArrayList } from '../src/collections/ArrayList';

/**
 * Dummy test
 */
describe("Dummy test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy()
  })

  it("DummyClass is instantiable", () => {
    const arrayList = new ArrayList<int>();
    //expect(new DummyClass()).toBeInstanceOf(DummyClass)
    //expect(new ArrayList<int>()).toBeInstanceOf(ArrayList);
  })
})
