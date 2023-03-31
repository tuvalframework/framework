






export interface Mixins {
  toolbar: any;
  // ... use interface declaration merging to add custom mixins
}

export interface MixinsOptions extends Partial<Mixins> {
  // ... use interface declaration merging to add custom mixin options
}



export  function createMixins(breakpoints:any, mixins:MixinsOptions):Mixins {
    return {
      toolbar: {
        minHeight: 56,
        [breakpoints.up('xs')]: {
          '@media (orientation: landscape)': {
            minHeight: 48,
          },
        },
        [breakpoints.up('sm')]: {
          minHeight: 64,
        },
      },
      ...mixins,
    };
  }