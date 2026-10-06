import Scout from '../scout';
import {isAdmin} from '@/lib/admin-auth';
import {redirect} from 'next/navigation';
export const dynamic='force-dynamic';
export default async function Admin(){if(!await isAdmin())redirect('/admin/login');return <Scout admin/>}
