import { Suspense, lazy } from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';

const Home = lazy(() => import('./pages/Home/Home'));
const Properties = lazy(() => import('./pages/Properties/Properties'));
const About = lazy(() => import('./pages/About/About'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const ProjectPage = lazy(() => import('./pages/ProjectPage/ProjectPage'));

export default function App() {
  const isGithubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
  const Router = isGithubPages ? HashRouter : BrowserRouter;

  return (
    <Router>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="ponuda" element={<Properties />} />
            <Route path="ponuda/:slug" element={<ProjectPage />} />
            <Route path="o-nama" element={<About />} />
            <Route path="kontakt" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
