import React, { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { computeSimilarity } from '@/lib/ai-utils';

// Show AI match score between user profile and job requirements
const AIMatchScore = ({ user, job }) => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScore = async () => {
      if (!user?.unsafeMetadata?.skills || !job?.requirements) return;
      setLoading(true);
      const sim = await computeSimilarity(user.unsafeMetadata.skills, job.requirements);
      setScore(sim);
      setLoading(false);
    };
    fetchScore();
  }, [user, job]);

  if (!user?.unsafeMetadata?.skills || !job?.requirements) return null;

  return (
    <div className="my-4 p-4 bg-blue-950/60 rounded-lg text-white flex items-center gap-4">
      <span className="font-bold">AI Match Score:</span>
      {loading ? (
        <BarLoader width={100} color="#f89655" />
      ) : score !== null ? (
        <span className="text-2xl font-extrabold text-blue-300">{Math.round(score * 100)}%</span>
      ) : (
        <span className="italic text-gray-300">N/A</span>
      )}
    </div>
  );
};

export default AIMatchScore;
