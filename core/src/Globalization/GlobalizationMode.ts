export class GlobalizationMode {
    private static GetGlobalizationInvariantMode(): boolean {
        return false;
    }
    private static readonly c_InvariantModeConfigSwitch: string = "System.Globalization.Invariant";
    public /* internal */ static get Invariant(): boolean {
        return GlobalizationMode.GetGlobalizationInvariantMode();
    }
}