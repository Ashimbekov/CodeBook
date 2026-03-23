import { createRouter, createWebHistory } from 'vue-router'

const HomePage = () => import('../views/HomePage.vue')
const CoursePage = () => import('../views/CoursePage.vue')
const LessonPage = () => import('../views/LessonPage.vue')
const NotFoundPage = () => import('../views/NotFoundPage.vue')
const RoadmapPage = () => import('../views/RoadmapPage.vue')

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/roadmap', name: 'roadmap', component: RoadmapPage },
  { path: '/course/:lang', name: 'course', component: CoursePage },
  {
    path: '/course/:lang/module/:moduleId/lesson/:lessonId',
    name: 'lesson',
    component: LessonPage
  },
  {
    path: '/course/:lang/module/:moduleId',
    redirect: to => ({
      name: 'lesson',
      params: { ...to.params, lessonId: '1' }
    })
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
