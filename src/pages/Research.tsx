import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ExternalLink, BookOpen } from "lucide-react";
import { format } from "date-fns";
import SectionHeader from "@/components/SectionHeader";
import CallToAction from "@/components/CallToAction";
import SEO from "@/components/SEO";

const Research = () => {
  const { data: webinars, isLoading: webinarsLoading } = useQuery({
    queryKey: ["webinars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webinars")
        .select("*")
        .eq("is_published", true)
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ["research_insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_insights")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upcomingWebinars = webinars?.filter(w => new Date(w.date) >= new Date()) || [];
  const pastWebinars = webinars?.filter(w => new Date(w.date) < new Date()) || [];

  return (
    <>
      <SEO title="Research & Development" description="Stay updated with Geotech4All's R&D webinars, research insights, and collaborative geoscience initiatives." path="/research" />
      <section
        className="relative pt-32 pb-20 bg-geotech-black"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-wide text-white">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Research and Development</h1>
            <p className="text-xl text-gray-300">
              Explore our research insights, attend webinars, and stay updated on the latest developments in geoscience.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <SectionHeader
            title="Upcoming Webinars & Events"
            subtitle="Join our live sessions to learn from leading geoscientists."
          />
          {webinarsLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading webinars...</div>
          ) : upcomingWebinars.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-xl">
              <CalendarDays className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-lg text-muted-foreground">No upcoming webinars at the moment.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for new events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingWebinars.map((webinar) => (
                <Card key={webinar.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {webinar.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img src={webinar.image_url} alt={webinar.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-geotech-red font-medium mb-1">
                      <CalendarDays size={14} />
                      {format(new Date(webinar.date), "MMMM d, yyyy • h:mm a")}
                    </div>
                    <CardTitle className="text-lg">{webinar.title}</CardTitle>
                    <CardDescription>{webinar.description}</CardDescription>
                  </CardHeader>
                  {webinar.registration_link && (
                    <CardContent>
                      <Button
                        className="w-full"
                        onClick={() => window.open(webinar.registration_link!, "_blank")}
                      >
                        Register Now <ExternalLink className="ml-2" size={14} />
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Webinars */}
      {pastWebinars.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-wide">
            <SectionHeader title="Past Events" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastWebinars.map((webinar) => (
                <Card key={webinar.id} className="opacity-80">
                  <CardHeader>
                    <div className="text-sm text-muted-foreground mb-1">
                      {format(new Date(webinar.date), "MMMM d, yyyy")}
                    </div>
                    <CardTitle className="text-base">{webinar.title}</CardTitle>
                    <CardDescription className="text-sm">{webinar.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Research Insights */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <SectionHeader
            title="Research Insights"
            subtitle="Read our latest research outputs and findings."
          />
          {insightsLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading insights...</div>
          ) : !insights || insights.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-xl">
              <BookOpen className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-lg text-muted-foreground">No research insights published yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Our research team is working on exciting projects!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {insights.map((insight) => (
                <Card key={insight.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {insight.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img src={insight.image_url} alt={insight.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    {insight.category && (
                      <span className="text-xs font-semibold text-geotech-red uppercase tracking-wider">
                        {insight.category}
                      </span>
                    )}
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <CardDescription>{insight.summary}</CardDescription>
                  </CardHeader>
                  {insight.content && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{insight.content}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <CallToAction
        title="Collaborate With Us"
        subtitle="Interested in R&D collaboration or want to present at our next webinar?"
        buttonText="Contact Us"
        buttonLink="/contact"
        backgroundClass="bg-geotech-gray"
      />
    </>
  );
};

export default Research;
