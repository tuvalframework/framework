import { Guid, as, int, Override, TString, ClassInfo, typeOf } from '@tuval/core';
import { GraphicTypes } from '../../GDITypes';

@ClassInfo({
    fullName: GraphicTypes.Imaging.FrameDimension,
    instanceof: [
        GraphicTypes.Imaging.FrameDimension
    ]
})
export class FrameDimension {

    private guid: Guid = null as any;
    private name: string = '';;

    private static page: FrameDimension;
    private static resolution: FrameDimension;
    private static time: FrameDimension;


    public constructor(guid: Guid);
    public constructor(guid: Guid, name: string);
    public constructor(...args: any[]) {
        if (args.length === 1) {
            const guid: Guid = args[0];
            this.guid = guid;
        } else if (args.length === 2) {
            const guid: Guid = args[0];
            const name: string = args[1];
            this.guid = guid;
            this.name = name;
        }
    }


    public get Guid(): Guid {
        return this.guid;
    }

    public static get Page(): FrameDimension {
        if (FrameDimension.page == null)
            FrameDimension.page = new FrameDimension(new Guid("7462dc86-6180-4c7e-8e3f-ee7333a7a483"), "Page");
        return FrameDimension.page;
    }

    public static get Resolution(): FrameDimension {
        if (FrameDimension.resolution == null) {
            FrameDimension.resolution = new FrameDimension(new Guid("84236f7b-3bd3-428f-8dab-4ea1439ca315"), "Resolution");
        }
        return FrameDimension.resolution;
    }

    public static get Time(): FrameDimension {
        if (FrameDimension.time == null)
            FrameDimension.time = new FrameDimension(new Guid("6aedbd6d-3fb5-418a-83a6-7f45229dc872"), "Time");
        return FrameDimension.time;
    }

    @Override
    public Equals(o: FrameDimension): boolean {
        const fd: any = as<FrameDimension>(o, GraphicTypes.Imaging.FrameDimension);
        if (fd == null)
            return false;

        return (this.guid.Equals(fd.guid));
    }

    @Override
    public GetHashCode(): int {
        return this.guid.GetHashCode();
    }

    @Override
    public ToString(): string {
        if (this.name == null)
            this.name = TString.Format("[FrameDimension: {0}]", this.guid);
        return this.name;
    }
}