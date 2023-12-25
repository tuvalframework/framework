import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIController } from "../UIController";
import React, { Fragment } from "react";
import { ReactView } from "../components/ReactView/ReactView";
import { Fragment as UIFragment } from "../components/Fragment";
import { UIView } from "../components/UIView/UIView";
import { DialogContainer } from "../layout";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5000 * 60 * 1000, // 5 minutes
            retry: false
        }
    },
});

export abstract class BiosController extends UIController {
    public abstract LoadBiosView(): UIView;

    public override LoadView(): UIView {
        const view = this.LoadBiosView() ?? UIFragment();
        return (
            ReactView(


                <QueryClientProvider client={queryClient}>
                    <DialogContainer></DialogContainer>
                    {
                        view.render()
                    }
                </QueryClientProvider>

            )
        )
    }
}