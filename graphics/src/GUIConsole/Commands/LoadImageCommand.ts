import { Override, int, SubProcessCommandBase, ImageBank } from '@tuval/core';
import { GuiConsole } from '../GuiConsole';
import { GuiTVC } from '../GuiTVC';


export class LoadImageCommand extends SubProcessCommandBase {
    public CommandName: string = 'Input';
    public imageBank: ImageBank;


    public constructor(console: GuiConsole<GuiTVC>, public path: string, public index: int) {
        super(console);
        this.imageBank = console.tvc.Banks.getBank(1,'application');/*  new ImageBank(console.tvc, path, ["#000000",
            "#FFFFFF", "#000000",
            "#222222", "#FF0000",
            "#00FF00", "#0000FF", "#666666", "#555555",
            "#333333", "#773333", "#337733", "#777733", "#333377", "#773377",
            "#337777", "#000000", "#EECC88", "#CC6600", "#EEAA00", "#2277FF",
            "#4499DD", "#55AAEE", "#AADDFF", "#BBDDFF", "#CCEEFF", "#FFFFFF", "#440088", "#AA00EE", "#EE00EE", "#EE0088", "#EEEEEE"
        ],
            {
                hotSpots: [{ x: 0, y: 0 }],
                alpha: false,
                domain: 'images',
                type: 'images',
                path: 'images'
            }); */


    }
    public Execute(console: GuiConsole<GuiTVC>): void {
        //console.tvc.currentScreen.currentTextWindow.print(this.Text, true);
    }

    @Override
    public IsWaitable(): boolean {
        return true;
    }

    @Override
    public GetReturnObject(): any {
        return {
            type: 8,
            instruction: "waitPromise",
            args: {
                promise: this.imageBank.load(this.path, {
                    hotSpots: [{ x: 0, y: 0 }],
                    alpha: false,
                    domain: 'images',
                    type: 'images',
                    path: 'images'
                }),
                callback: () => { },
                errorCallback: () => { }
            }
        }
    }
}