import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarLoader } from 'react-spinners';

// Free AI API for skill extraction (HuggingFace Inference API, no key needed for some models)
const HF_SKILL_EXTRACTION_API = 'https://api-inference.huggingface.co/models/dslim/bert-base-NER';

const Profile = () => {
  const { user, isLoaded } = useUser();
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [resume, setResume] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load user profile from Clerk metadata
  useEffect(() => {
    if (isLoaded && user) {
      setBio(user?.unsafeMetadata?.bio || '');
      setSkills(user?.unsafeMetadata?.skills || '');
    }
  }, [isLoaded, user]);

  // Extract skills from bio or resume text
  const extractSkills = async (text) => {
    setExtracting(true);
    setMessage('Extracting skills using AI...');
    try {
      const response = await fetch(HF_SKILL_EXTRACTION_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: text }),
      });
      const data = await response.json();
      // Extract skills/entities from response (simplified for demo)
      const entities = data[0]?.entities || [];
      const skillList = entities.map(e => e.word).join(', ');
      setSkills(skillList);
      setMessage('Skills extracted!');
    } catch (e) {
      setMessage('Failed to extract skills.');
    }
    setExtracting(false);
  };

  // Handle resume upload and extract text
  const handleResume = async (file) => {
    setResume(file);
    setMessage('Reading resume...');
    // For demo: just use file name as text, real: use PDF/text extraction API
    const text = file.name;
    await extractSkills(text);
  };

  // Save profile (to Clerk metadata)
  const saveProfile = async () => {
    setSaving(true);
    setMessage('Saving profile...');
    try {
      await user.update({ unsafeMetadata: { bio, skills } });
      setMessage('Profile saved!');
    } catch (e) {
      setMessage('Failed to save profile.');
    }
    setSaving(false);
  };

  if (!isLoaded) return <BarLoader width="100%" color="#f89655" />;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="gradient-title font-extrabold text-5xl text-center pb-8">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="font-bold">Bio</label>
          <Input
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            className="mb-2"
          />
          <Button
            variant="blue"
            onClick={() => extractSkills(bio)}
            disabled={extracting || !bio}
            className="mb-4"
          >
            {extracting ? 'Extracting...' : 'Extract Skills from Bio'}
          </Button>
          <label className="font-bold">Resume (PDF, DOC)</label>
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={e => handleResume(e.target.files[0])}
            className="mb-2"
          />
          <label className="font-bold">Skills</label>
          <Input
            value={skills}
            onChange={e => setSkills(e.target.value)}
            placeholder="Skills (comma separated)"
            className="mb-2"
          />
          <Button
            onClick={saveProfile}
            variant="blue"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
          {message && <div className="mt-2 text-sm text-blue-400">{message}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
