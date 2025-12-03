import { createBrowserRouter } from "react-router";
import { LightmojiStudio } from "./pages/LightmojiStudio";

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <LightmojiStudio />,
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

export default AppRoutes;
