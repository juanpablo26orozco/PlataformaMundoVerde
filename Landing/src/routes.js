
import Layout1 from "../src/pages/Layout1/Layout_1";
import HuellaCarbono from "../src/pages/HuellaCarbono/HuellaCarbono";
import DocumentosPage from "../src/pages/Documentos/DocumentosPage";
import AutogestionPage from "../src/pages/Autogestion/AutogestionPage";
import CalculadoraPage from "../src/pages/Calculadora/CalculadoraPage";

const routes = [

  { path: "/huella-carbono", component: <HuellaCarbono /> },
  { path: "/calculadora", component: <CalculadoraPage /> },
  { path: "/documentos", component: <DocumentosPage /> },
  { path: "/autogestion", component: <AutogestionPage /> },
  { path: "/Layout1", component: <Layout1 /> },
  { path: "/", component: <Layout1 /> },
  // Catch-all route: redirige cualquier ruta desconocida a la landing principal
  { path: "*", component: <Layout1 /> },
];

export default routes;
