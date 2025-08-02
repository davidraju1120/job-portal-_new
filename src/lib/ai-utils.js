// AI/NLP utilities for job-applicant match score and suggestions
// Uses HuggingFace Inference API (free, demo, no key needed for some models)

const HF_SIMILARITY_API = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2';

// Compute similarity between two texts (returns a score 0-1)
export async function computeSimilarity(textA, textB) {
  try {
    const response = await fetch(HF_SIMILARITY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: { source_sentence: textA, sentences: [textB] } }),
    });
    const result = await response.json();
    if (Array.isArray(result) && typeof result[0] === 'number') {
      return result[0]; // similarity score
    }
    return 0;
  } catch (e) {
    return 0;
  }
}

// Recommend jobs for user based on profile skills (simple filter/sort)
export function recommendJobs(jobs, userSkills) {
  if (!userSkills) return jobs;
  const userSkillSet = userSkills.toLowerCase().split(',').map(s => s.trim());
  // Sort jobs by number of matching skills
  return jobs
    .map(job => {
      const jobSkills = (job.requirements || '').toLowerCase().split(',').map(s => s.trim());
      const matchCount = jobSkills.filter(skill => userSkillSet.includes(skill)).length;
      return { ...job, matchCount };
    })
    .sort((a, b) => b.matchCount - a.matchCount);
}
