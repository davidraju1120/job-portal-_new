import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseUrl } from '@/utils/superbase';

// Social feed post structure: { id, user_id, name, content, image, link, created_at }

const Feed = () => {
  const { user, isLoaded } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [link, setLink] = useState('');
  const [posting, setPosting] = useState(false);

  // Fetch posts from Supabase
  useEffect(() => {
    if (!isLoaded) return;
    setLoading(true);
    fetchPosts();
  }, [isLoaded]);

  const fetchPosts = async () => {
    const supabase = await import('@/utils/superbase').then(mod => mod.default(user.sessionId));
    const { data, error } = await supabase.from('feed').select('*').order('created_at', { ascending: false });
    if (!error) setPosts(data);
    setLoading(false);
  };

  // Handle image upload to Supabase storage
  const uploadImage = async (file) => {
    if (!file) return '';
    const supabase = await import('@/utils/superbase').then(mod => mod.default(user.sessionId));
    const fileName = `feed-${Date.now()}-${user.id}`;
    const { error } = await supabase.storage.from('feed-images').upload(fileName, file);
    if (error) return '';
    return `${supabaseUrl}/storage/v1/object/public/feed-images/${fileName}`;
  };

  // Post to feed
  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    let imageUrl = '';
    if (image) imageUrl = await uploadImage(image);
    const supabase = await import('@/utils/superbase').then(mod => mod.default(user.sessionId));
    const { error } = await supabase.from('feed').insert([
      {
        user_id: user.id,
        name: user.fullName,
        content,
        image: imageUrl,
        link,
        created_at: new Date().toISOString(),
      },
    ]);
    setPosting(false);
    if (!error) {
      setContent('');
      setImage(null);
      setLink('');
      fetchPosts();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="gradient-title font-extrabold text-5xl text-center pb-8">Social Feed</h1>
      {isLoaded && (
        <form className="mb-8 bg-gray-800 p-4 rounded-lg" onSubmit={handlePost}>
          <Input
            placeholder="What's on your mind? (text, advice, updates...)"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            className="mb-2"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="mb-2"
          />
          <Input
            placeholder="Link (optional)"
            value={link}
            onChange={e => setLink(e.target.value)}
            className="mb-2"
          />
          <Button type="submit" variant="blue" disabled={posting || !content}>
            {posting ? 'Posting...' : 'Post'}
          </Button>
        </form>
      )}
      {loading ? (
        <BarLoader width="100%" color="#f89655" />
      ) : (
        <div className="flex flex-col gap-4">
          {posts.length === 0 && <div>No posts yet. Be the first to post!</div>}
          {posts.map(post => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.name}</CardTitle>
                <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleString()}</span>
              </CardHeader>
              <CardContent>
                <div className="mb-2">{post.content}</div>
                {post.image && <img src={post.image} alt="feed" className="max-h-64 rounded-lg mb-2" />}
                {post.link && (
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                    {post.link}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
