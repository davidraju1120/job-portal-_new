import { supabase } from "@/utils/superbase";
export async function getjobs({ location, company_id, searchQuery }) {
    let query =  supabase
        .from("jobs")
        .select("*, company:companies(name, logo_url), saved: saved_jobs(id)");
    if (location) {
        query = query.eq("location", location);
    }
    if (company_id) {
        query = query.eq("company_id", company_id);
    }
    if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
    }
    const { data, error } = await query;
    if (error) {
        console.error("Error fetching jobs:", error);
        return null;
    }
    return data;
}
// Backward compatibility export
export { getjobs as getJobs };

export async function saveJob({ alreadySaved }, saveData) {
    

if(alreadySaved){
   // If the job is already saved, remove it
    const {data, error:deleteError} = await supabase
    .from("saved_jobs") //Savedjobs
    .delete()
    .eq("job_id", saveData.job_id);
    if(deleteError){
        console.error("error is deleting saved jobs", deleteError);
        return data;
    }
  
    return data;

}
else{
  // If the job is not saved, add it to saved jobs
    const {data, error:insertError} = await supabase
    .from("saved_jobs")
    .insert([saveData])
    .select();


    if(insertError) {
                console.error("Error fetching jobs", insertError);
                return null;
            }

return data;
}

}
export async function getSingleJob({job_id}){
  
  const {data, error} = await supabase.from("jobs").select("* , recruiter_id ,company:companies(name, logo_url), applications: applications(*)").eq("id", job_id)
  .single();
  if(error){
      console.error("Error in fetching company", error);
          return null;
      

  }
  return data;
}


export async function updateHiringStatus({job_id}, isOpen){
  
  const {data, error} = await supabase
  .from("jobs")
  .update(isOpen)
  .eq("id", job_id)
  .select();
  if(error){
      console.error("Error in Updating Job", error);
          return null;
      

  }
  return data;
}
//post a job
export async function addNewJob(token,_, Jobdata){
  
  const {data, error} = await supabase
  .from("jobs")
  .insert([Jobdata])
  .select();
  if(error){
      console.error("Error in creating Job", error);
          return null;
      

  }
  return data;
}
export async function getSavedjobs(token){
  
  const {data, error} = await supabase
  .from("saved_jobs")
  .select("*, Job:jobs(*, company:companies(name, logo_url))");
  if(error){
      console.error("Error in fetching saved jobs", error);
          return null;
      

  }
  return data;
}
export async function getMyjobs({ recruiter_id}){
  
  const {data, error} = await supabase
  .from("jobs")
  .select("*, company:companies(name, logo_url)")
  .eq("recruiter_id", recruiter_id);
  if(error){
      console.error("Error in fetching jobs", error);
          return null;
      

  }
  return data;
}

export { getMyjobs as getMyJobs };

export async function deleteJob({ job_id }) {
  

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error deleting job:", error);
    return data;
  }

  return data;
}
