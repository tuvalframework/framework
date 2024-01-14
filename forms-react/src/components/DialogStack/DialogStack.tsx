
import React, { createContext, Fragment as _Fragment, useMemo, Fragment } from 'react'
import { UIView } from '../UIView/UIView';
import { useParams } from 'react-router-dom';
import { cTopLeading, cLeading, cTop } from '../../Constants';
import { ConfigContext } from '../../data';
import { HStack, VStack } from '../../layout';
import { Icon, Icons } from '../Icon';
import { ReactView } from '../ReactView/ReactView';
import { ForEach } from '../UIView/ForEach';
import { Text } from '../Text';
import { UIViewBuilder } from '../UIViewBuilder';

export const DialogStackProvider = createContext<any>({});

export const useDialogStack = (): any => {
    const options = React.useContext(DialogStackProvider);
    return options;

}

/* export const DialogStackConfigProvider = createContext<any>({});
export const useDialogStackConfig = (): any => {
    const options = React.useContext(DialogStackConfigProvider);
    return options;

} */

export interface IDialogStackItem {
    title: string;
    view: UIView;
}

interface Props {
    title: string;
    children:any;
}
export const DialogStack = ({ title = '' ,children }) => {
    const [dialogs, setDialogs] = React.useState<IDialogStackItem[]>([]);
    const [currentDialogIndex, setCurrentDialogIndex] = React.useState<number>(0);

    const openDialog = (dialog: any) => {
        setDialogs((dialogs) => [...dialogs, dialog]);
    };

    const closeDialog = () => {
        setDialogs((dialogs) => dialogs.slice(0, dialogs.length - 1));
    };

    const closeAllDialogs = () => {
        setDialogs([]);
    };

    const getDialog = () => {
        return dialogs[dialogs.length - 1];
    };

    let myIndex = 0;
    return (
        <Fragment>
            {
                HStack({ alignment: cTopLeading, spacing: 10 })(
                    (dialogs.length > 1 && currentDialogIndex > 0) ? HStack({ alignment: cLeading })(
                        (title as any) instanceof UIView ? (title as any) :
                        Text('Tasks')
                            .fontSize(14).fontSmoothing('auto')
                            .fontFamily('ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"')

                    )
                        .cursor('pointer')
                        .allWidth(30).background('white')
                        .padding(10)
                        .writingMode('vertical-rl')
                        .onClick(() => {
                            setCurrentDialogIndex(0);
                        }) :




                        HStack({ alignment: cTopLeading })(
                            VStack({ alignment: cTopLeading })(
                                ReactView(
                                    <DialogStackProvider.Provider value={{
                                        openDialog: (view: IDialogStackItem) => {
                                            dialogs[0] = view;
                                            setCurrentDialogIndex(0)
                                            setDialogs([...dialogs]);
                                        }

                                    }}>
                                        <_Fragment>{children}</_Fragment>
                                    </DialogStackProvider.Provider>

                                ),
                            )
                                .cornerRadius(10)
                                //.background('white')
                                .overflow('hidden')
                                .shadow('0 1px 6px 0 rgba(42,56,68,.08)'),
                        )
                            .width(null)
                            .flexBasis('0')
                            .flexGrow('1')
                            .flexShrink('0')
                            .minWidth('490px')

                    ,

                    ...ForEach(dialogs)((dialog, index) =>
                        (((currentDialogIndex - index) >= 2) || (currentDialogIndex === 0 && index !== 0)) ?
                            VStack({ alignment: cTop, spacing: 10 })(
                                Icon(Icons.Close).onClick(() => {
                                    dialogs.splice(index, 1)
                                    setCurrentDialogIndex(currentDialogIndex - 1)
                                    setDialogs([...dialogs]);
                                }),
                                HStack({ alignment: cLeading })(
                                    Text(dialog.title).fontSize(14).fontSmoothing('auto')
                                )
                                    .writingMode('vertical-rl')
                                    .onClick(() => {
                                        setCurrentDialogIndex(index);
                                    })
                            )
                                .cursor('pointer')
                                .allWidth(30).background('white')
                                .padding(10)
                            :
                            HStack({ alignment: cTopLeading })(
                                UIViewBuilder(() => {
                                    // const _index = myIndex++;
                                    return (
                                        VStack({ alignment: cTopLeading })(
                                            //Text(JSON.stringify(_index)),


                                           // Text(`index:${index}, currentIndex:${currentDialogIndex} ${(currentDialogIndex - index) < 2}`),
                                            ReactView(
                                                <DialogStackProvider.Provider value={
                                                    {
                                                        openDialog: (view: IDialogStackItem) => {
                                                          //  alert(index)
                                                            dialogs[index + 1] = view;
                                                            setCurrentDialogIndex(index + 1)
                                                            setDialogs([...dialogs]);
                                                        },
                                                        closeDialog: () => {
                                                            //alert(index)
                                                            dialogs.splice(index, 1)
                                                            setCurrentDialogIndex(currentDialogIndex - 1)
                                                            setDialogs([...dialogs]);
                                                        },
                                                        dialogIndex: index,
                                                        dialogs: dialogs.map((dialog, index) => dialog.title + ' ' + index)
                                                    }

                                                }>
                                                    {
                                                        UIViewBuilder(() =>
                                                            dialog.view
                                                        ).render()
                                                    }

                                                </DialogStackProvider.Provider>
                                            )



                                        )
                                            .cornerRadius(10)
                                            .background('white')
                                            .overflow('hidden')
                                            .shadow('0 1px 6px 0 rgba(42,56,68,.08)')
                                    )
                                })
                                ,
                            )
                                .width(null)
                                .flexBasis('0')
                                .flexGrow('1')
                                .flexShrink('0')
                                .minWidth('490px')




                    )
                ).position('absolute')
                    .top('0')
                    .left('0')
                    .overflowX('auto')
                    .padding().background('#F9FAFB')
                    .render()
            }
        </Fragment>


    );
}