import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const Billing = () => {
  return (
    <div className="container max-w-2xl mx-auto pt-20 px-4">
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold text-green-800">Billing Settings</h1>
        
        <div className="text-center py-8">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            Billing functionality will be available soon.
          </p>
          <Button disabled>
            Manage Subscription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Billing;