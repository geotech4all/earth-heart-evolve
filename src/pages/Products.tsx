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
import { Mail, ArrowRight, ExternalLink } from "lucide-react";

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

  // Featured products for the hero - GraviMag Cloud is featured
  const graviMagProduct = PRODUCTS.find(p => p.id === "gravimag-cloud");

  // Auto-swipe animation for hero section
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % PRODUCTS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleContactSales = () => {
    window.location.href = "mailto:support@geotech4all.com?subject=Inquiry about SoilCloud";
  };

  const handleExploreClick = (product: Product) => {
    if (product.id === "soilcloud") {
      window.open("https://soilcloud.tech/", "_blank");
    } else if (product.id === "gravimag-cloud" && product.waitlistLink) {
      window.open(product.waitlistLink, "_blank");
    } else {
      setSelectedProduct(product);
    }
  };

  return (
    <>
      {/* Hero Section - GraviMag Cloud Featured */}
      <section className="relative pt-32 pb-20 bg-white overflow-hidden">
        <div className="container-wide">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Our Products</h1>
            <p className="text-xl text-gray-600">
              Explore our suite of innovative geoscience applications designed to streamline your workflow.
            </p>
          </div>

          {/* GraviMag Cloud Featured Banner */}
          {graviMagProduct && (
            <div className="mt-12 relative h-[400px] overflow-hidden rounded-2xl shadow-xl">
              <div
                className="absolute inset-0 flex items-center"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(88, 28, 135, 0.9), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1574629173169-7019b64ac722')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="container-wide text-white p-8">
                  <div className="flex items-center gap-6 mb-4">
                    <LogoIcon productId="gravimag-cloud" darkBackground />
                    <div>
                      <span className="bg-geotech-red text-white text-xs font-bold px-3 py-1 rounded-full">
                        Coming Soon
                      </span>
                      <h2 className="text-3xl font-bold mt-2">{graviMagProduct.name}</h2>
                    </div>
                  </div>
                  <p className="text-xl max-w-2xl mb-6">{graviMagProduct.longDescription}</p>
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
                </div>
              </div>
            </div>
          )}
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
