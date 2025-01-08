import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const testimonials = [
  {
    quote: "These recipes have changed my life! I'm cooking more and eating better than ever.",
    author: "Sarah M."
  },
  {
    quote: "I've saved a boatload since downloading AnyRecipe. Restaurant bills are a thing of the past!",
    author: "Michael R."
  },
  {
    quote: "The AI-powered recipe suggestions are incredible. It's like having a personal chef!",
    author: "Emily W."
  },
  {
    quote: "From novice to confident home cook - AnyRecipe made it possible.",
    author: "David L."
  },
  {
    quote: "My family loves trying new recipes every week. Thank you AnyRecipe!",
    author: "Jessica K."
  }
];

export const TestimonialSlider = () => {
  const isMobile = useIsMobile();
  const [api, setApi] = useState<any>();

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-green-800 text-center mb-12">
          What Our Users Say
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: false,
            containScroll: "trimSnaps",
          }}
          className="w-full max-w-4xl mx-auto"
          setApi={setApi}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem 
                key={index} 
                className={`pl-2 md:pl-4 ${isMobile ? 'basis-full' : 'basis-1/2'}`}
              >
                <div className="p-1">
                  <Card className="bg-white/80 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
                    <CardContent className="flex flex-col items-center justify-center p-6 min-h-[200px] text-center">
                      <blockquote className="text-lg font-medium text-gray-700 mb-4">
                        "{testimonial.quote}"
                      </blockquote>
                      <cite className="text-sm text-gray-500 not-italic">
                        - {testimonial.author}
                      </cite>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious 
            className="hidden md:flex -left-12 lg:-left-16" 
          />
          <CarouselNext 
            className="hidden md:flex -right-12 lg:-right-16" 
          />
        </Carousel>
      </div>
    </div>
  );
};