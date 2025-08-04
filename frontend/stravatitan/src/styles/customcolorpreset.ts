import { definePreset } from "@primeuix/themes";
import Aura from '@primeuix/themes/aura';

const customColorPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#ffe5e5',
            100: '#ffcccc',
            200: '#ff9999',
            300: '#ff6666',
            400: '#ff3333',
            500: '#ff0000',
            600: '#cc0000',
            700: '#990000',
            800: '#660000',
            900: '#330000',
            950: '#1a0000',
        },
        surface: {
            0: '#ffffff',
            50: '#f9f9f9',
            100: '#ececec',
            200: '#e0e0e0',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
            950: '#0a0a0a'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.500}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.600}',
                    activeColor: '{primary.700}'
                },
                surface: {
                    0: '#ffffff',
                    50: '#f9f9f9',
                    100: '#ececec',
                    200: '#e0e0e0',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                    950: '#0a0a0a'
                },
                content: {
                    background: '{surface.0}',
                    hoverBackground: '{surface.50}',
                    borderColor: '{surface.200}',
                    color: '{surface.700}',
                    hoverColor: '{surface.800}'
                },
                panel: {
                    background: '{surface.0}',
                    borderColor: '{surface.200}',
                    color: '{surface.700}'
                },
                card: {
                    background: '{surface.0}',
                    borderColor: '{surface.200}',
                    color: '{surface.700}',
                    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }
            },
                            dark: {
                primary: {
                    color: '{primary.400}',
                    contrastColor: '{surface.900}',
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.200}'
                },
                surface: {
                    0: '#ffffff',
                    50: '#18181b',
                    100: '#27272a',
                    200: '#3f3f46',
                    300: '#52525b',
                    400: '#71717a',
                    500: '#a1a1aa',
                    600: '#d4d4d8',
                    700: '#e4e4e7',
                    800: '#f4f4f5',
                    900: '#fafafa',
                    950: '#ffffff'
                },
                formField: {
                    background: '{surface.100}',
                    borderColor: '{surface.300}',
                    hoverBorderColor: '{surface.400}',
                    focusBorderColor: '{primary.color}',
                    color: '{surface.700}',
                    placeholderColor: '{surface.500}',
                    focusRing: {
                        color: '{primary.color}',
                        shadow: '0 0 0 2px rgba(255, 0, 0, 0.2)'
                    }
                },
                content: {
                    background: '{surface.100}',
                    hoverBackground: '{surface.200}',
                    borderColor: '{surface.300}',
                    color: '{surface.700}',
                    hoverColor: '{surface.800}'
                },
                panel: {
                    background: '{surface.100}',
                    borderColor: '{surface.300}',
                    color: '{surface.700}'
                },
                card: {
                    background: '{surface.100}',
                    borderColor: '{surface.300}',
                    color: '{surface.700}',
                    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)'
                },
                dropdown: {
                    background: '{surface.100}',
                    borderColor: '{surface.300}',
                    color: '{surface.700}',
                    hoverBackground: '{surface.200}',
                    focusBorderColor: '{primary.color}'
                },
                overlay: {
                    background: '{surface.100}',
                    borderColor: '{surface.300}',
                    color: '{surface.700}',
                    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                }
            }
        }
    }
});



export default customColorPreset;