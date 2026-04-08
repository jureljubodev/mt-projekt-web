import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Properties from './pages/Properties/Properties';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';
import ProjectPage from './pages/ProjectPage/ProjectPage';

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
