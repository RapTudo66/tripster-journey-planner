
import { useState, useEffect } from "react";
import { User, ThumbsUp, MessageCircle, Share2, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { SocialMediaPost } from "@/lib/supabase";

interface SocialMediaFeedProps {
  location: string;
  poiName?: string;
}

export const SocialMediaFeed = ({ location, poiName }: SocialMediaFeedProps) => {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram");
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      
      // Mock data - in a real app, this would be an API call
      setTimeout(() => {
        const mockPosts: SocialMediaPost[] = [
          {
            id: "1",
            platform: "instagram",
            username: "traveller_jane",
            content: `Amazing day exploring ${poiName || location}! The views are breathtaking 😍 #travel #wanderlust #${location.toLowerCase().replace(/\s+/g, "")}`,
            image_url: `https://source.unsplash.com/random/600x600/?${location.toLowerCase().replace(/\s+/g, "")}`,
            likes: 124,
            comments: 23,
            posted_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            location: location,
            tags: ["travel", "wanderlust", location.toLowerCase().replace(/\s+/g, "")]
          },
          {
            id: "2",
            platform: "facebook",
            username: "Mark Thompson",
            content: `Day 2 in ${location} and I'm falling in love with this place! If you haven't been here, you need to add it to your bucket list right now.`,
            image_url: `https://source.unsplash.com/random/600x600/?${location.toLowerCase().replace(/\s+/g, "")},landmark`,
            likes: 87,
            comments: 14,
            posted_at: new Date(Date.now() - 3600000 * 24).toISOString(),
            location: location,
            tags: ["vacation", "memories", "travel"]
          },
          {
            id: "3",
            platform: "twitter",
            username: "@worldtraveler",
            content: `Just had the best meal at a local restaurant in ${location}. The food scene here is incredible! #foodie #${location.toLowerCase().replace(/\s+/g, "")}`,
            image_url: `https://source.unsplash.com/random/600x600/?${location.toLowerCase().replace(/\s+/g, "")},food`,
            likes: 56,
            comments: 8,
            posted_at: new Date(Date.now() - 3600000 * 12).toISOString(),
            location: location,
            tags: ["foodie", "cuisine", "localfood"]
          }
        ];
        
        setPosts(mockPosts);
        setLoadingPosts(false);
      }, 1000);
    };
    
    fetchPosts();
  }, [location, poiName]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPostContent.trim()) {
      toast({
        title: "Post vazio",
        description: "Por favor, escreva algo para publicar.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate posting to social media
    const newPost: SocialMediaPost = {
      id: Date.now().toString(),
      platform: selectedPlatform,
      username: selectedPlatform === "instagram" ? "traveller_jane" : 
               selectedPlatform === "facebook" ? "Mark Thompson" : "@worldtraveler",
      content: newPostContent,
      image_url: undefined, // No image for now, would need file upload
      likes: 0,
      comments: 0,
      posted_at: new Date().toISOString(),
      location: location,
      tags: [location.toLowerCase().replace(/\s+/g, ""), "travel"]
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent("");
    
    toast({
      title: "Post publicado!",
      description: "Seu post foi publicado com sucesso.",
    });
  };

  const formatPostDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "agora mesmo";
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      return date.toLocaleDateString("pt-BR");
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case "facebook":
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case "twitter":
        return <Twitter className="w-4 h-4 text-sky-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-background rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Feed de Redes Sociais</h2>
        <p className="text-muted-foreground text-sm">Veja e compartilhe experiências em {poiName || location}</p>
      </div>
      
      {/* Post form */}
      <div className="p-4 border-b">
        <form onSubmit={handlePostSubmit}>
          <Textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder={`Compartilhe sua experiência em ${poiName || location}...`}
            className="mb-3"
          />
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Button 
              type="button"
              variant={selectedPlatform === "instagram" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPlatform("instagram")}
              className="flex items-center gap-1"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </Button>
            <Button 
              type="button"
              variant={selectedPlatform === "facebook" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPlatform("facebook")}
              className="flex items-center gap-1"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </Button>
            <Button 
              type="button"
              variant={selectedPlatform === "twitter" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPlatform("twitter")}
              className="flex items-center gap-1"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
          </div>
          
          <Button type="submit" className="w-full">Publicar</Button>
        </form>
      </div>
      
      {/* Posts list */}
      <div className="divide-y">
        {loadingPosts ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Carregando posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum post encontrado para esta localização.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{post.username}</span>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatPostDate(post.posted_at)}
                  </div>
                </div>
              </div>
              
              <p className="mb-3 whitespace-pre-wrap">{post.content}</p>
              
              {post.image_url && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt="Post" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              
              <div className="flex gap-4 text-muted-foreground text-sm">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
