import { EventBus } from "@tuval/core"

export interface IToastService {
    Success: (message: string, detail?: string) => void;
    Info: (message: string, detail?: string) => void;
    Warn: (message: string, detail?: string) => void;
    Error: (message: string, detail?: string) => void;
}

const ToastService = {
    Success: (message: string, detail?: string) => {
        EventBus.Default.fire('tuval.desktop.toast', {
            severity: 'success',
            summary: message,
            detail: detail
        });
    },
    Info: (message: string, detail?: string) => {
        EventBus.Default.fire('tuval.desktop.toast', {
            severity: 'info',
            summary: message,
            detail: detail
        });
    },
    Warn: (message: string, detail?: string) => {
        EventBus.Default.fire('tuval.desktop.toast', {
            severity: 'warn',
            summary: message,
            detail: detail
        });
    },
    Error: (message: string, detail?: string) => {
        EventBus.Default.fire('tuval.desktop.toast', {
            severity: 'error',
            summary: message,
            detail: detail
        });
    }
}

export const useToastService = (): IToastService => {
    return ToastService;
}