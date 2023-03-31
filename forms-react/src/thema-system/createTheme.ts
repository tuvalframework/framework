import { deepmerge } from "../utils/deepmerge";
import generateUtilityClass from "../utils/generateUtilityClass";
import { createMixins, Mixins, MixinsOptions } from "./createMixins";
import { createPalette, Palette, PaletteOptions } from "./createPalette";
import  { createTransitions, Transitions, TransitionsOptions } from "./createTransitions";
import createTypography, { Typography, TypographyOptions } from "./createTypography";
import { Shadows, shadows } from "./shadows";
import { systemCreateTheme } from "./system/createTheme/systemCreateTheme";
import { ZIndex, zIndex, ZIndexOptions } from "./zIndex";


export interface ThemeOptions  {
    mixins?: MixinsOptions;
    components?: any;
    palette?: PaletteOptions;
    shadows?: Shadows;
    transitions?: TransitionsOptions;
    typography?: TypographyOptions | ((palette: Palette) => TypographyOptions);
    zIndex?: ZIndexOptions;
    unstable_strictMode?: boolean;
  }
  
  /**
   * Our [TypeScript guide on theme customization](https://mui.com/guides/typescript/#customization-of-theme) explains in detail how you would add custom properties.
   */
  export interface Theme  {
    mixins: Mixins;
    components?: any;
    palette: Palette;
    shadows: Shadows;
    transitions: Transitions;
    typography: Typography;
    zIndex: ZIndex;
    unstable_strictMode?: boolean;
  }
  

  


export function createTheme(options: ThemeOptions = {}, ...args:object[]): Theme {
    const {
        breakpoints: breakpointsInput,
        mixins: mixinsInput = {},
        spacing: spacingInput,
        palette: paletteInput = {},
        transitions: transitionsInput = {},
        typography: typographyInput = {},
        shape: shapeInput,
        ...other
    } = options as any;

    if ((options as any).vars) {
        throw new Error(
            ' `vars` is a private field used for CSS variables support.\n' +
            'Please use another name.',
        );
    }

    const palette = createPalette(paletteInput);
    const systemTheme = systemCreateTheme(options);

    let muiTheme = deepmerge(systemTheme, {
        mixins: createMixins(systemTheme.breakpoints, mixinsInput),
        palette,
        // Don't use [...shadows] until you've verified its transpiled code is not invoking the iterator protocol.
        shadows: shadows.slice(),
        typography: createTypography(palette, typographyInput),
        transitions: createTransitions(transitionsInput),
        zIndex: { ...zIndex },
    });

    muiTheme = deepmerge(muiTheme, other);
    muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme) as any;

    if (process.env.NODE_ENV !== 'production') {
        const stateClasses = [
            'active',
            'checked',
            'completed',
            'disabled',
            'error',
            'expanded',
            'focused',
            'focusVisible',
            'required',
            'selected',
        ];

        const traverse = (node, component) => {
            let key;

            // eslint-disable-next-line guard-for-in, no-restricted-syntax
            for (key in node) {
                const child = node[key];
                if (stateClasses.indexOf(key) !== -1 && Object.keys(child).length > 0) {
                    if (process.env.NODE_ENV !== 'production') {
                        const stateClass = generateUtilityClass('', key);
                        console.error(
                            [
                                ` The \`${component}\` component increases ` +
                                `the CSS specificity of the \`${key}\` internal state.`,
                                'You can not override it like this: ',
                                JSON.stringify(node, null, 2),
                                '',
                                `Instead, you need to use the '&.${stateClass}' syntax:`,
                                JSON.stringify(
                                    {
                                        root: {
                                            [`&.${stateClass}`]: child,
                                        },
                                    },
                                    null,
                                    2,
                                ),
                                '',
                                'https:/tuval/r/state-classes-guide',
                            ].join('\n'),
                        );
                    }
                    // Remove the style to prevent global conflicts.
                    node[key] = {};
                }
            }
        };

        Object.keys(muiTheme.components).forEach((component) => {
            const styleOverrides = muiTheme.components[component].styleOverrides;

            if (styleOverrides && component.indexOf('Mui') === 0) {
                traverse(styleOverrides, component);
            }
        });
    }

    return muiTheme as any;
}

let warnedOnce = false;

export function createMuiTheme(...args) {
    if (process.env.NODE_ENV !== 'production') {
        if (!warnedOnce) {
            warnedOnce = true;
            console.error(
                [
                    'MUI: the createMuiTheme function was renamed to createTheme.',
                    '',
                    "You should use `import { createTheme } from '@mui/material/styles'`",
                ].join('\n'),
            );
        }
    }

    return createTheme(...args);
}