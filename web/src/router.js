import { createRouter, createWebHistory } from 'vue-router'
import Index from './views/Index/Index.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Index,
            name: 'INDEX'
        },
        {
            path: '/login',
            component: () => import('./views/Registration/Index.vue'),
            name: 'REGISTRATION'
        },
        {
            path: '/setProfile',
            component: () => import('./views/setProfile/Index.vue'),
            name: 'SET_PROFILE'
        },
        {
            path: '/networking',
            component: () => import('./views/Network/Index.vue'),
            name: 'NETWORKING'
        },
        {
            path: '/strategic',
            component: () => import('./views/StrategicSessions/Index.vue'),
            name: 'STRATEGIC_SESSION'
        },
        {
            path: '/expert',
            component: () => import('./views/ExpertRoom/Index.vue'),
            name: 'EXPERT_ROOM'
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/'
        }
    ]
})