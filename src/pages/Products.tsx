import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRODUCTS } from "@/lib/constants";
import NotifyForm from "@/components/NotifyForm";
import { LogoIcon } from "@/components/LogoIcon";
import { ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  longDescription: string;
  comingSoon?: boolean;
  waitlistLink?: string;
}

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Auto-swipe animation for hero section
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % PRODUCTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleExploreClick = (product: Product) => {
    if (product.id === "soilcloud") {
      window.open("https://soilcloud.tech/", "_blank");
    } else if (product.id === "gravimag-cloud" && product.waitlistLink) {
      window.open(product.waitlistLink, "_blank");
    } else {
      setSelectedProduct(product);
    }
  };

  const goToSlide = (index: number) => setFeaturedIndex(index);
  const goPrev = () => setFeaturedIndex(prev => (prev - 1 + PRODUCTS.length) % PRODUCTS.length);
  const goNext = () => setFeaturedIndex(prev => (prev + 1) % PRODUCTS.length);

  const currentProduct = PRODUCTS[featuredIndex];

  return (
    <>
      {/* Hero Section with swipe carousel */}
      <section className="relative pt-32 pb-20 bg-white overflow-hidden">
        <div className="container-wide">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Our Products</h1>
            <p className="text-xl text-gray-600">
              Explore our suite of innovative geoscience applications designed to streamline your workflow. Sign up to be notified when they launch!
            </p>
          </div>

          {/* Carousel Banner */}
          <div className="mt-12 relative h-[400px] overflow-hidden rounded-2xl shadow-xl group">
            {/* Slides */}
            {PRODUCTS.map((product, index) => (
              <div
                key={product.id}
                className={`absolute inset-0 flex items-center transition-opacity duration-700 ease-in-out ${
                  index === featuredIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(50, 50, 50, 0.85), rgba(0, 0, 0, 0.8)), url('${product.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="container-wide text-white p-8">
                  <div className="flex items-center gap-6 mb-4">
                    <LogoIcon productId={product.id} darkBackground />
                    <div>
                      {product.comingSoon && (
                        <span className="bg-geotech-red text-white text-xs font-bold px-3 py-1 rounded-full">
                          Coming Soon
                        </span>
                      )}
                      <h2 className="text-3xl font-bold mt-2">{product.name}</h2>
                    </div>
                  </div>
                  <p className="text-lg max-w-2xl mb-6">{product.longDescription}</p>

                  {/* GraviMag Cloud specific CTA */}
                  {product.id === "gravimag-cloud" ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-300 font-medium">
                        Join the launch notification wait-list:
                      </p>
                      <Button
                        size="lg"
                        className="bg-white text-gray-900 hover:bg-gray-200"
                        onClick={() => window.open("https://bit.ly/GraviMagCloud", "_blank")}
                      >
                        Join Waitlist <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </div>
                  ) : product.id === "soilcloud" ? (
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-200"
                      onClick={() => window.open("https://soilcloud.tech/", "_blank")}
                    >
                      Explore Now <ArrowRight className="ml-2" size={16} />
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-200"
                      onClick={() => handleExploreClick(product)}
                    >
                      Explore <ArrowRight className="ml-2" size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {PRODUCTS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === featuredIndex ? "bg-white scale-110" : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Complete Product Suite</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col">
                <div className="relative p-8 flex items-center justify-center bg-white border-b">
                  <LogoIcon
                    productId={product.id}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle>{product.name}</CardTitle>
                    {product.comingSoon && (
                      <span className="bg-geotech-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        Soon
                      </span>
                    )}
                  </div>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleExploreClick(product)}
                  >
                    {product.id === "soilcloud" ? "Visit SoilCloud" :
                     product.comingSoon ? "Join Waitlist" : "Explore"}
                    {product.id === "soilcloud" && <ExternalLink className="ml-2" size={14} />}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Details Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>
                {selectedProduct.longDescription}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <NotifyForm
                productId={selectedProduct.id}
                productName={selectedProduct.name}
                onSuccess={() => setSelectedProduct(null)}
              />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default Products;
