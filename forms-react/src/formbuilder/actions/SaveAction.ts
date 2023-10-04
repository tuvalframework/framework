import { is } from "@tuval/core";
import { useFormController } from "../../UIFormController";
import { Text, UIViewBuilder } from "../../components";
import { Button } from "../../components/Button";
import { useDialog } from "../../layout";
import { useProtocol } from "../../data/DataProviderContext/DataProviderClass";
import { Fragment } from "../../components/Fragment";
import { compileFormula, useFormBuilder } from "../FormBuilder";
import { useNavigate } from "react-router-dom";

export const SaveAction = (formMeta, action) => UIViewBuilder(() => {
    const { label, successAction, successActions } = action;
    const formController = useFormController();
    const dialog = useDialog();
    const formBuilder = useFormBuilder();
    const navigate = useNavigate();

    let invalidateResource = null;
    let formMutate = null;
    let createMutate = null;
    let updateMutate = null;
    let isFormMutateExcuting = false;
    let isFormLoading = false;

    const views = []
    const { fieldMap, layout, mode, resource, resourceId, title, protocol, mutation, query, actions } = formMeta as any;

    if (protocol) {
        const { query: _query, __mutation, getOne, create, update } = useProtocol(protocol);

        if (mode === 'create') {
            const { mutate, isLoading, invalidateResourceCache } = create(resource);
            createMutate = mutate;
            invalidateResource = invalidateResourceCache;
            isFormMutateExcuting = isLoading;
        }

        if (mode === 'update') {
            const { mutate, isLoading, invalidateResourceCache } = update(resource);
            updateMutate = mutate;
            invalidateResource = invalidateResourceCache;
            isFormMutateExcuting = isLoading;
        }

        if (is.string(mutation)) {
            const { mutate, isLoading: isMutateLoading } = __mutation`${mutation}`;
            formMutate = mutate;
            isFormMutateExcuting = isMutateLoading;
        }
    }


    return (
        (!is.function(formMutate) && !is.function(createMutate) && !is.function(updateMutate)) ? Fragment() :
            Button(
                Text(label)
            )
                .loading(isFormMutateExcuting)
                .onClick(() => {
                    if (createMutate != null) {
                        createMutate(formController.GetFormData(), {
                            onSuccess: (e) => {
                                if (is.function(invalidateResource)) {
                                    invalidateResource();
                                }
                                if (successAction === 'prev') {
                                    formBuilder.prevForm();
                                } else if (successAction === 'next') {
                                    formBuilder.nextForm();
                                } else if (successAction === 'hide') {
                                    dialog.Hide();
                                }

                                if (is.array(successActions)) {
                                    successActions.forEach(successAction => {
                                        if (successAction.type === 'prev') {
                                            formBuilder.prevForm();
                                        } else if (successAction.type === 'next') {
                                            formBuilder.nextForm();
                                        } else if (successAction.type === 'hide') {
                                            dialog.Hide();
                                        } else if (successAction.type === 'navigate') {
                                            navigate(compileFormula(e, successAction.url))
                                        }
                                    })
                                }
                            }
                        });
                    }
                    if (updateMutate != null) {
                        updateMutate(resourceId, formController.GetFormData(), {
                            onSuccess: (e) => {
                                if (is.function(invalidateResource)) {
                                    invalidateResource();
                                }
                                if (successAction === 'prev') {
                                    formBuilder.prevForm();
                                } else if (successAction === 'next') {
                                    formBuilder.nextForm();
                                } else if (successAction === 'hide') {
                                    dialog.Hide();
                                }

                                if (is.array(successActions)) {
                                    successActions.forEach(successAction => {
                                        if (successAction.type === 'prev') {
                                            formBuilder.prevForm();
                                        } else if (successAction.type === 'next') {
                                            formBuilder.nextForm();
                                        } else if (successAction.type === 'hide') {
                                            dialog.Hide();
                                        } else if (successAction.type === 'navigate') {
                                            navigate(compileFormula(e, successAction.url))
                                        }
                                    })
                                }
                            }
                        });
                    }
                    // formController.SetValue('tenant_id', useSessionService().TenantId);
                    if (is.function(formMutate)) {
                        //alert(JSON.stringify(formController.GetFormData()))
                        formMutate(formController.GetFormData(), {
                            onSuccess: () => {
                                if (successAction === 'prev') {
                                    formBuilder.prevForm();
                                } else if (successAction === 'next') {
                                    formBuilder.nextForm();
                                } else if (successAction === 'hide') {
                                    dialog.Hide();
                                }

                            }
                        });
                    }
                })
    )
}
)