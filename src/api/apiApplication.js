import supabaseClient, {supabaseUrl} from "@/utils/superbase";

export async function applyToJob(token,_,Jobdata){
    const supabase = await supabaseClient(token);


    const random = Math.floor(Math.random()* 90000)
    const fileName = `resume-${random}-${Jobdata.candidate_id}`;

    
    
    
    const {error: storageError}  = await supabase.storage
    .from("resume")
    .upload(fileName, Jobdata.resume);
    // const {data, error} = await supabase.from("companies").select("*");
    if(storageError){
        console.error("Error in uploading resume", storageError);
            return null;    
    }
   

    const resume = `${supabaseUrl}/storage/v1/object/public/resume/${fileName}`;
        // const {data, error} = await supabase.from("companies").select("*");
   
   const {data, error} = await supabase.from("applications")
   .insert([
    {
        ...Jobdata,
        resume,
       
    },
   ])
   .select();
   if(error){
    console.error("Error Submiting Applications:", error);
   }
    return data;
}
export async function updateApplicationsStatus(token, {job_id}, status){
    const supabase = await supabaseClient(token);
    const {data, error} = await supabase.from("applications")
    .update({status})
    .eq("job_id", job_id)
    .select();
    if(error || data.length === 0){
        console.error("Error is updataing  Applications", error);
            return null;
        

    }
    return data;
}
export async function getApplications(token, {user_id}){
    const supabase = await supabaseClient(token);
    const {data, error} = await supabase.from("applications")
    // .update({status})
    .select("*, Job:Jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

    if(error){
        console.error("Error is fetching  Applications", error);
            return null;
        

    }
    return data;
}