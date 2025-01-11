import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { MessageSquare, Image, List, Clock, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

const Directory = () => {
  const navigationItems = [
    {
      title: "Recipe Generator",
      description: "Create custom recipes with AI assistance",
      icon: <MessageSquare className="h-6 w-6" />,
      path: "/chat",
    },
    {
      title: "Picture Analysis",
      description: "Generate recipes from food images",
      icon: <Image className="h-6 w-6" />,
      path: "/chat#image",
    },
    {
      title: "Recipe Collection",
      description: "Browse and manage your saved recipes",
      icon: <List className="h-6 w-6" />,
      path: "/recipes",
    },
    {
      title: "Timeline",
      description: "See what your friends are cooking",
      icon: <Clock className="h-6 w-6" />,
      path: "/timeline",
    },
    {
      title: "Talk to the Chef",
      description: "Get personalized cooking advice",
      icon: <ChefHat className="h-6 w-6" />,
      path: "/chef",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24 flex-grow">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Your Cooking Dashboard</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {navigationItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-primary/20">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-primary mb-2">{item.title}</h2>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      <footer className="bg-[#F2FCE2] mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-green-800 mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/profile" className="text-green-700 hover:text-green-900">Profile</Link>
                </li>
                <li>
                  <Link to="/billing" className="text-green-700 hover:text-green-900">Billing</Link>
                </li>
                <li>
                  <Link to="/subscription" className="text-green-700 hover:text-green-900">Subscription</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-green-700 hover:text-green-900">Terms & Conditions</Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-green-700 hover:text-green-900">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-green-700 hover:text-green-900">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-green-700 hover:text-green-900">Contact Us</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-green-200 text-center text-green-700">
            <p>&copy; {new Date().getFullYear()} AnyRecipe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Directory;