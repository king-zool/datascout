import Scout from "./scout";
import {getDb} from "@/db";
import {plans} from "@/db/schema";
import {ensureCatalogueImported} from "@/lib/catalogue-import";
export const dynamic="force-dynamic";
export default async function Home(){
 try{
  await ensureCatalogueImported();
  const initialPlans=await getDb().select().from(plans);
  return <Scout initialPlans={initialPlans}/>;
 }catch(error){
  console.error('Unable to render the catalogue',error);
  return <Scout initialError="Could not load saved plans. Please try again."/>;
 }
}
