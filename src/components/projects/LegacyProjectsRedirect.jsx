import { Navigate,useLocation } from 'react-router-dom';
export default function LegacyProjectsRedirect(){const {search}=useLocation();return <Navigate to={`/projects${search}`} replace/>}