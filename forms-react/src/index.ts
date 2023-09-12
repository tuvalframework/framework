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
export * from './data/DataProviderContext'

export * from './UIController'
export * from './UIFormController'
export * from './Constants'
export * from './formbuilder/FormBuilder'

export * from './UIAppearance'

export * from './Bios'

//--------------------
export { useNavigate, useLocation, useParams, Link } from 'react-router-dom'
export { useState, useEffect, useMemo } from 'react'
/* import ReactDOM from 'react-dom/client';
export { ReactDOM as ReactDOM }; */
export { useGetList, useStore, useRecordContext } from 'ra-core'
export { css } from "@emotion/css";

export { useQuery, QueryClient } from 'react-query';

export { nanoid } from 'nanoid'

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