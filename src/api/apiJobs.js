import supabaseClient from "@/utils/superbase";
export async function getJobs(token, { location, company_id, searchQuery }) {
    const supabase = await supabaseClient(token);
    let query =  supabase
    .from("Jobs")
    .select("*, company:companies(name, logo_url), saved: saved_jobs(id)");
    if (location) {
        query = query.eq("location", location);
      }
      if (company_id) {
        query = query.eq("company_id", company_id);
      }
      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`); // Assuming you want to search by job title
      }
    
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching Jobs:", error);
        return null;
      }
    

return data;
}




export async function saveJob(token, { alreadySaved }, saveData) {
    const supabase = await supabaseClient(token);

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
export async function getSingleJob(token, {job_id}){
  const supabase = await supabaseClient(token);
  const {data, error} = await supabase.from("Jobs").select("* , recruiter_id ,company:companies(name, logo_url), applications: applications(*)").eq("id", job_id)
  .single();
  if(error){
      console.error("Error in fetching company", error);
          return null;
      

  }
  return data;
}


export async function updateHiringStatus(token, {job_id}, isOpen){
  const supabase = await supabaseClient(token);
  const {data, error} = await supabase
  .from("Jobs")
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
  const supabase = await supabaseClient(token);
  const {data, error} = await supabase
  .from("Jobs")
  .insert([Jobdata])
  .select();
  if(error){
      console.error("Error in creating Job", error);
          return null;
      

  }
  return data;
}
export async function getSavedJobs(token){
  const supabase = await supabaseClient(token);
  const {data, error} = await supabase
  .from("saved_jobs")
  .select("*, Job:Jobs(*, company:companies(name, logo_url))");
  if(error){
      console.error("Error in fetching saved Jobs", error);
          return null;
      

  }
  return data;
}
export async function getMyJobs(token, { recruiter_id}){
  const supabase = await supabaseClient(token);
  const {data, error} = await supabase
  .from("Jobs")
  .select("*, company:companies(name, logo_url)")
  .eq("recruiter_id", recruiter_id);
  if(error){
      console.error("Error in fetching Jobs", error);
          return null;
      

  }
  return data;
}

export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("Jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error deleting job:", error);
    return data;
  }

  return data;
}
