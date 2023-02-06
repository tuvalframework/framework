export function Renderer(rendererFunc: Function) {
    return (constructor: any) => {
      constructor.Renderer = rendererFunc;
    }
  }