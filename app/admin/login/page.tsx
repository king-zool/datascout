import AdminLogin from '../../admin-login';
import {isAdmin} from '@/lib/admin-auth';
import {redirect} from 'next/navigation';
export const dynamic='force-dynamic';
export default async function Login(){if(await isAdmin())redirect('/admin');return <AdminLogin/>}
