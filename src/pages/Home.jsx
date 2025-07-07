import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Image, Video } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to PromptVault
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your personal AI prompt library. Store, organize, and share your best prompts for image and video generation.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild size="lg">
            <Link to="/library/new">
              <Plus className="mr-2 h-4 w-4" />
              Create New Prompt
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/library">
              <Search className="mr-2 h-4 w-4" />
              Browse Library
            </Link>
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Image className="h-5 w-5" />
              <span>Image Prompts</span>
            </CardTitle>
            <CardDescription>
              Store and organize your image generation prompts with visual previews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Upload reference images</li>
              <li>• Preview thumbnails</li>
              <li>• Copy prompts with one click</li>
              <li>• Organize by categories</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="h-5 w-5" />
              <span>Video Prompts</span>
            </CardTitle>
            <CardDescription>
              Save video generation prompts with YouTube reference videos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Embed YouTube videos</li>
              <li>• Video preview player</li>
              <li>• Detailed prompt descriptions</li>
              <li>• Share with community</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="bg-muted/50 rounded-lg p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">Quick Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Total Prompts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Image Prompts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Video Prompts</div>
          </div>
        </div>
      </div>
    </div>
  );
}

