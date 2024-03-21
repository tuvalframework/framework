//export * from './main'
export * from './components'

export * from './components/UIView/UIView'
export * from './components/UIView/UIViewRenderer'
export * from './components/UIView/ViewProperty'
export * from './components/UIView/ForEach'
export * from './components/UIView/Switch'
export * from './components/UIView/KeyFrameCollection'

export * from './layout'


export * from './components/Text/Text'

export * from './components/Router/UIRoutes/UIRoutes'
export * from './components/Router/UIRoute/UIRoute'
export * from './components/Router/Outlet/UIRouteOutlet'
export * from './components/Router/UIRouteLink/UIRouteLink'
export * from './components/Router/Navigate'

export * from './components/List'
export * from './components/Fragment'

export * from './components/ReactView/ReactView'
export * from './components/ReactView/ReactViewClass'

export * from './DesktopController'

export * from './Color'
export * from './ColorClass'
export * from './ColorConverter'

export * from './components/Icon'

export * from './UITemplate'

export * from './loaders/WidgetLoader'
export * from './loaders/DOMElementLoader'
export * from './data/DataProviderContext'

export * from './UIController'
export * from './UIFormController'
export * from './Constants'
export * from './formbuilder/FormBuilder'

export * from './UIAppearance'


//--------------------
import { useParams as _useParams} from 'react-router-dom';

function getSelected(param: string) {
    const regex = /\[(.*?)\]/;
    const match = param.match(regex);

    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}

export function useParams() {
    const params = _useParams();
    const newParams = {};
    for (let key in params) {
        const splitted = params[key].split('-');
        if (splitted.length > 1) {
            const param = getSelected(splitted[splitted.length - 1]) ?? splitted[splitted.length - 1];
            newParams[key] = param;
        } else {
            newParams[key] = params[key];
        }
    }
    return newParams as any;
}   


export { useNavigate, useLocation,  Link, HashRouter, Routes, Router, Route } from 'react-router-dom'
export { useState, useEffect, useMemo } from 'react'
/* import ReactDOM from 'react-dom/client';
export { ReactDOM as ReactDOM }; */
export { useGetList, useStore, useRecordContext } from 'ra-core'
export { css } from "@emotion/css";

export { useQuery, QueryClient, QueryClientProvider, useQueryClient, useMutation } from '@tanstack/react-query';

import { customAlphabet } from 'nanoid'
export const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 20)
//export { nanoid } from 'nanoid'

export { confirmDialog } from 'primereact/confirmdialog';

export {dayjs} from './dayjs'

//-------------------

export * from './data'

import './exports';
import { Navigate } from 'react-router-dom';

export * from './SvgIcon'
export * from './tracker'
export * from './thema-system'
export * from './If'
export * from './IconLibrary'
export * from './RealmHttpClient'
export * from './utils'
export * from './hooks/hooks'
export * from './queryParams'
export * from './bios'