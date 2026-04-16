import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Youtube, GraduationCap, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import SectionHeader from "@/components/SectionHeader";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  published: string;
  author: string;
}

const ResearchAcademy = () => {
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["youtube-videos"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("youtube-videos");
      if (error) throw error;
      return data as { success: boolean; videos: Video[]; count: number };
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const videos = data?.videos ?? [];
  const featured = videos[0];
  const rest = videos.slice(1);

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="flex items-center justify-center gap-3 mb-4">
          <GraduationCap className="text-geotech-red" size={32} />
          <span className="text-sm font-semibold uppercase tracking-wider text-geotech-red">
            Research Academy
          </span>
        </div>
        <SectionHeader
          title="Learn from Our Tutorials"
          subtitle="Free video tutorials, lectures, and field demonstrations from the Geotech4All YouTube channel."
        />

        {isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            Loading tutorials...
          </div>
        )}

        {error && (
          <div className="text-center py-12 bg-muted/50 rounded-xl">
            <Youtube className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-lg text-muted-foreground">
              Unable to load videos at the moment.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/@Geotech4All",
                  "_blank",
                )
              }
            >
              Visit Our YouTube Channel <ExternalLink className="ml-2" size={14} />
            </Button>
          </div>
        )}

        {!isLoading && !error && videos.length === 0 && (
          <div className="text-center py-12 bg-muted/50 rounded-xl">
            <Youtube className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-lg text-muted-foreground">
              No tutorials available yet.
            </p>
          </div>
        )}

        {featured && (
          <div className="mb-12">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-video bg-black">
                  {activeVideo === featured.id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${featured.id}?autoplay=1`}
                      title={featured.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      onClick={() => setActiveVideo(featured.id)}
                      className="absolute inset-0 group"
                      aria-label={`Play ${featured.title}`}
                    >
                      <img
                        src={featured.thumbnail}
                        alt={featured.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-geotech-red flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="text-white ml-1" size={32} fill="white" />
                        </div>
                      </div>
                    </button>
                  )}
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <span className="text-xs font-semibold text-geotech-red uppercase tracking-wider mb-2">
                    Featured Tutorial
                  </span>
                  <h3 className="text-2xl font-bold mb-3">{featured.title}</h3>
                  {featured.description && (
                    <p className="text-muted-foreground line-clamp-4 mb-4">
                      {featured.description}
                    </p>
                  )}
                  {featured.published && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Published {format(new Date(featured.published), "MMMM d, yyyy")}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => setActiveVideo(featured.id)}>
                      <Play className="mr-2" size={16} /> Watch Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(featured.url, "_blank")}
                    >
                      Open in YouTube <ExternalLink className="ml-2" size={14} />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((video) => (
              <Card
                key={video.id}
                className="overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative aspect-video bg-black">
                  {activeVideo === video.id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                      title={video.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      onClick={() => setActiveVideo(video.id)}
                      className="absolute inset-0"
                      aria-label={`Play ${video.title}`}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-geotech-red/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="text-white ml-0.5" size={22} fill="white" />
                        </div>
                      </div>
                    </button>
                  )}
                </div>
                <CardContent className="p-5">
                  <h4 className="font-semibold line-clamp-2 mb-2 min-h-[3rem]">
                    {video.title}
                  </h4>
                  {video.published && (
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(video.published), "MMM d, yyyy")}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {videos.length > 0 && (
          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                window.open("https://www.youtube.com/@Geotech4All", "_blank")
              }
            >
              <Youtube className="mr-2" size={18} /> Visit Full YouTube Channel
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResearchAcademy;
