import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Grid, List, Image, Video, Copy, Eye } from 'lucide-react';

export default function Library() {
  const [prompts, setPrompts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch prompts from Firestore
    setLoading(false);
  }, []);

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || prompt.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text);
    // TODO: Show toast notification
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Prompt Library</h1>
          <p className="text-muted-foreground">
            Manage and organize your AI prompts
          </p>
        </div>
        <Button asChild>
          <Link to="/library/new">
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Image Prompts</SelectItem>
            <SelectItem value="video">Video Prompts</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {!loading && filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Library className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first prompt'
            }
          </p>
          <Button asChild>
            <Link to="/library/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Prompt
            </Link>
          </Button>
        </div>
      )}

      {/* Prompts Grid/List */}
      {filteredPrompts.length > 0 && (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{prompt.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={prompt.type === 'image' ? 'default' : 'secondary'}>
                        {prompt.type === 'image' ? (
                          <><Image className="mr-1 h-3 w-3" /> Image</>
                        ) : (
                          <><Video className="mr-1 h-3 w-3" /> Video</>
                        )}
                      </Badge>
                      {prompt.isPrivate && (
                        <Badge variant="outline">Private</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="line-clamp-3 mb-4">
                  {prompt.text}
                </CardDescription>
                
                {/* Media Preview */}
                {prompt.type === 'image' && prompt.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={prompt.imageUrl} 
                      alt={prompt.title}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
                
                {prompt.type === 'video' && prompt.youtubeUrl && (
                  <div className="mb-4">
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyPrompt(prompt.text)}
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-3 w-3" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/library/${prompt.id}`}>
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

