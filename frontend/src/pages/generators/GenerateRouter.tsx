import { useLocation, useParams, Navigate } from "react-router-dom";
import CaptionGenerator from "./CaptionGenerator";
import type { Template } from "../../types/templates";

export default function GenerateRouter() {
  const { type } = useParams();
  const location = useLocation();

  const template = location.state?.template as Template | undefined;

  if (!template) {
    return <Navigate to="/templates" replace />;
  }

  switch (type) {
    case "caption":
      return <CaptionGenerator />;

    default:
      return <Navigate to="/templates" replace />;
  }
}