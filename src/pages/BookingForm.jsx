import { Navigate,useLocation,useParams } from 'react-router-dom';

export default function BookingForm(){const {id}=useParams();const {search}=useLocation();const service=new URLSearchParams(search).get('service');const target=`/projects?creative=${id}&action=book${service?`&service=${service}`:''}`;return <Navigate to={target} replace/>}