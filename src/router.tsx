import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'
import MainLayout from '@/components/layout/MainLayout'

const Views = {
  NotFound: lazy(() => import('@/views/NotFound')),
  Index: lazy(() => import('@/views/Index')),
  Editor: lazy(() => import('@/views/Editor')),
  Settings: lazy(() => import('@/views/Settings')),
  Doc: lazy(() => import('@/views/Document')),
  Market: lazy(() => import('@/views/Market')),
  MarketDetail: lazy(() => import('@/views/MarketDetail')),
}

export const routes = createBrowserRouter([
  {
    path: '*',
    element: <Views.NotFound />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Views.Index />,
      },
      {
        path: 'editor',
        element: <Views.Editor />,
      },
      {
        path: 'settings',
        element: <Views.Settings />,
      },
      {
        path: 'market',
        element: <Views.Market />,
      },
      {
        path: 'market/:os/:version/:variant',
        element: <Views.MarketDetail />,
      },
      {
        path: 'doc/:docName?',
        element: <Views.Doc />,
      },
    ],
  },
])
