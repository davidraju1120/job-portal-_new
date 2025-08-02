import supabaseClient, { supabaseUrl } from "@/utils/superbase";

export async function getCompanies(token){
    const supabase = await supabaseClient(token);
    const {data, error} = await supabase.from("companies").select("*");
    if(error){
        console.error("Error is fetching companies", error);
            return null;
        

    }
    return data;
}
export async function addNewCompany(token,_,companyData){
    const supabase = await supabaseClient(token);

    
    const random = Math.floor(Math.random()* 90000)
    const fileName = `logo-${random}-${companyData.name}`;

    
    
    
    const {error: storageError}  = await supabase.storage
    .from("company_logo")
    .upload(fileName, companyData.logo);
    // const {data, error} = await supabase.from("companies").select("*");
    if(storageError){
        console.error("Error in uploading company logo", storageError);
            return null;    
    }
   

    const logo_url = `${supabaseUrl}/storage/v1/object/public/company_logo/${fileName}`;
    const {data, error} = await supabase.from("companies")
    .insert([
        {
            name: companyData.name,
            logo_url,
        },
    ])
    .select();
    if(error){
        console.error("Error is submitting companies", error);
            return null;
        

    }
    return data;
}