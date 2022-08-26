export const TConsoleManifest = {
    version: 9,
    infos: {
        applicationName: "Name of your application.",
        author: "By You",
        version: "Version 0.0",
        date: "Created on the ...",
        copyright: "(c) Your Corporation Unlimited",
        start: "console"
    },
    compilation: {
        platform: "tvc",
        keymap: "tvc",
        machine: "modern",
        speed: "fast",
        syntax: "enhanced",
        endian: "little",
        stringBaseIndex: 1,
        noWarning: [],
        displayEndAlert: false,
        displayErrorAlert: true,
        useLocalTabs: true
    },
    display: {
        tvStandard: "pal",
        width: 1920,
        height: 1080,
        background: "color",
        backgroundColor: "#000000",
        bodyBackgroundColor: "#000000",
        bodyBackgroundImage: "./runtime/resources/star_night.jpeg",
        smoothing: false,
        scaleX: 0.5, // değişti
        scaleY: 0.5,
        screenScale: 1,
        fps: false,
        fpsFont: "12px Verdana",
        fpsColor: "#FFFF00",
        fpsX: 10,
        fpsY: 16,
        fullPage: false, //değişti
        fullScreen: false, // değişti
        keepProportions: true,
        fullScreenIcon: false,
        fullScreenIconX: -34,
        fullScreenIconY: 2,
        fullScreenIconImage: "./runtime/resources/full_screen.png",
        smallScreenIconImage: "./runtime/resources/small_screen.png"
    },
    bootScreen: {
        active: true,
        waitSounds: 0,
        clickSounds: false
    },
    sprites: {
        collisionBoxed: false,
        collisionPrecision: 1,
        collisionAlphaThreshold: 1
    },
    rainbows: {
        mode: "slow"
    },
    fonts: {
        listFonts: "PC",
        amiga: [],
        google: [
            "roboto"
        ]
    },
    sounds: {
        mode: "PC",
        volume: 1,
        preload: true,
        numberOfSoundsToPreload: 32,
        soundPoolSize: 32
    },
    gamepad: {
        mapping: {
            up: "ArrowUp",
            down: "ArrowDown",
            left: "ArrowLeft",
            right: "ArrowRight",
            fire: "Space"
        }
    },
    fileSystem: {
        caseSensitive: false
    },
    default: {
        screen: {
            x: 0,
            y: 0,
            width: 1920,
            height: 1080,
            numberOfColors: 32,
            pixelMode: "lowres",
            palette: [
                "#000000",
                "#FFFFFF",
                "#000000",
                "#222222",
                "#FF0000",
                "#00FF00",
                "#0000FF",
                "#666666",
                "#555555",
                "#333333",
                "#773333",
                "#337733",
                "#777733",
                "#333377",
                "#773377",
                "#337777",
                "#000000",
                "#EECC88",
                "#CC6600",
                "#EEAA00",
                "#2277FF",
                "#4499DD",
                "#55AAEE",
                "#AADDFF",
                "#BBDDFF",
                "#CCEEFF",
                "#FFFFFF",
                "#440088",
                "#AA00EE",
                "#EE00EE",
                "#EE0088",
                "#EEEEEE"
            ],
            window: {
                x: 0,
                y: 0,
                width: 80,
                height: 25,
                border: 0,
                paper: 0,
                pen: 1,
                background: "opaque",
                font: {
                    "name": "IBM Plex Mono",
                    "type": "google",
                    "height": 40
                },
                cursorOn: false,
                cursorImage: "./runtime/resources/cursor_pc.png",
                cursorColors: [
                    {
                        "r": 68,
                        "g": 68,
                        "b": 0,
                        "a": 128
                    },
                    {
                        "r": 136,
                        "g": 136,
                        "b": 0,
                        "a": 128
                    },
                    {
                        "r": 187,
                        "g": 187,
                        "b": 0,
                        "a": 128
                    },
                    {
                        "r": 221,
                        "g": 221,
                        "b": 0,
                        "a": 128
                    },
                    {
                        "r": 238,
                        "g": 238,
                        "b": 0,
                        "a": 128
                    },
                    {
                        "r": 255,
                        "g": 255,
                        "b": 34,
                        "a": 128
                    },
                    {
                        "r": 255,
                        "g": 255,
                        "b": 136,
                        "a": 128
                    },
                    {
                        "r": 255,
                        "g": 255,
                        "b": 204,
                        "a": 128
                    },
                    {
                        "r": 255,
                        "g": 255,
                        "b": 255,
                        "a": 128
                    },
                    {
                        "r": 170,
                        "g": 170,
                        "b": 255,
                        "a": 128
                    },
                    {
                        "r": 136,
                        "g": 136,
                        "b": 204,
                        "a": 128
                    },
                    {
                        "r": 102,
                        "g": 102,
                        "b": 170,
                        "a": 128
                    },
                    {
                        "r": 34,
                        "g": 34,
                        "b": 102,
                        "a": 128
                    },
                    {
                        "r": 0,
                        "g": 0,
                        "b": 68,
                        "a": 128
                    },
                    {
                        "r": 0,
                        "g": 0,
                        "b": 17,
                        "a": 128
                    },
                    {
                        "r": 0,
                        "g": 0,
                        "b": 0,
                        "a": 128
                    }
                ]
            }
        }
    }
}