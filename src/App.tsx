import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import Page1 from "@/pages/dashboard/Page1";
import Page2 from "@/pages/dashboard/Page2";
import Page3 from "@/pages/dashboard/Page3";
import CreateRecipePage from "@/pages/dashboard/CreateRecipePage";
import RecipeDetailPage from "@/pages/dashboard/RecipeDetailPage";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="page1" replace />} />
        <Route path="page1" element={<Page1 />} />
        <Route path="page2" element={<Page2 />} />
        <Route path="page3" element={<Page3 />} />
        <Route path="create-recipe" element={<CreateRecipePage />} />
        <Route path="recipe/:id" element={<RecipeDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
