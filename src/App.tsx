import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AiReport from "./pages/AiReport";
import ProductPage from "./pages/ProductPage";
import ActionBoard from "./pages/ActionBoard";
import DataImport from "./pages/DataImport";
import MonthlyReport from "./pages/MonthlyReport";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AppLayout />}>
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/ai-report" element={<AiReport />} />
        <Route path="/app/product-page" element={<ProductPage />} />
        <Route path="/app/action-board" element={<ActionBoard />} />
        <Route path="/app/data-import" element={<DataImport />} />
        <Route path="/app/monthly-report" element={<MonthlyReport />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
