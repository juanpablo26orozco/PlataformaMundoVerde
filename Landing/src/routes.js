
import Signup from "../src/pages/Signup";
import PswForget from "../src/pages/PswForget";
import Layout1 from "../src/pages/Layout1/Layout_1";
import Layout2 from "../src/pages/Layout2/Layout2";
import Layout3 from "../src/pages/Layout3/Layout3";
import Layout4 from "../src/pages/Layout4/Layout4";
import Layout5 from "../src/pages/Layout5/Layout5";
import Layout6 from "../src/pages/Layout6/Layout6";
import Layout7 from "../src/pages/Layout7/Layout7";
import Layout8 from "../src/pages/Layout8/Layout8";
import Layout9 from "../src/pages/Layout9/Layout9";
import HuellaCarbono from "../src/pages/HuellaCarbono/HuellaCarbono";

import DocumentosPage from "../src/pages/DocumentosPage";

const routes = [
  { path: "/password-forget", component: <PswForget /> },
  { path: "/sign-up", component: <Signup /> },
  { path: "/huella-carbono", component: <HuellaCarbono /> },
  { path: "/documentos", component: <DocumentosPage /> },
  { path: "/Layout2", component: <Layout2 /> },
  { path: "/Layout3", component: <Layout3 /> },
  { path: "/Layout4", component: <Layout4 /> },
  { path: "/Layout5", component: <Layout5 /> },
  { path: "/Layout6", component: <Layout6 /> },
  { path: "/Layout7", component: <Layout7 /> },
  { path: "/Layout8", component: <Layout8 /> },
  { path: "/Layout9", component: <Layout9 /> },
  { path: "/Layout1", component: <Layout1 /> },
  { path: "/", component: <Layout1 /> },
  // Catch-all route: redirige cualquier ruta desconocida a la landing principal
  { path: "*", component: <Layout1 /> },
];

export default routes;
