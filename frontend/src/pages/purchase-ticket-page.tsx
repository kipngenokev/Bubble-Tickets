import { Button } from "@/components/ui/button";
import { purchaseTicket } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";

const PurchaseTicketPage: React.FC = () => {
  const { eventId, ticketTypeId } = useParams();
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchaseSuccess, setIsPurchaseSuccess] = useState(false);

  useEffect(() => {
    if (!isPurchaseSuccess) {
      return;
    }
    const timer = setTimeout(() => {
      navigate("/dashboard/tickets");
    }, 2500);

    return () => clearTimeout(timer);
  }, [isPurchaseSuccess, navigate]);

  const handlePurchase = async () => {
    if (
      isLoading ||
      isPurchasing ||
      !user?.access_token ||
      !eventId ||
      !ticketTypeId
    ) {
      return;
    }
    setError(undefined);
    setIsPurchasing(true);
    try {
      await purchaseTicket(user.access_token, eventId, ticketTypeId);
      setIsPurchaseSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isPurchaseSuccess) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-black space-y-2">
            <CheckCircle
              className="h-16 w-16 text-green-500 mx-auto"
              aria-hidden="true"
            />
            <h2 className="text-2xl font-bold text-green-600">Thank you!</h2>
            <p className="text-gray-600">
              Your ticket purchase was successful.
            </p>
            <p className="text-gray-600 text-sm">
              Redirecting to your tickets…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white px-4">
      <div className="max-w-md mx-auto py-12 md:py-20">
        <div className="bg-white border-gray-300 shadow-sm border rounded-lg p-6 space-y-4 text-black">
          <div>
            <h1 className="text-xl font-bold">Confirm your purchase</h1>
            <p className="text-sm text-gray-600">
              Click confirm to reserve your ticket.
            </p>
          </div>

          <div
            role="note"
            className="flex items-start gap-2 border border-amber-300 bg-amber-50 rounded-md p-3 text-amber-900 text-sm"
          >
            <AlertTriangle
              className="h-4 w-4 mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span>
              This is a mock checkout — no payment is processed and no card
              details are collected.
            </span>
          </div>

          {error && (
            <div
              role="alert"
              className="border border-red-200 rounded-lg p-4 bg-red-50 text-red-700 text-sm"
            >
              <strong>Error: </strong>
              {error}
            </div>
          )}

          <Button
            className="w-full bg-purple-600 hover:bg-purple-800 cursor-pointer"
            onClick={handlePurchase}
            disabled={isPurchasing}
            aria-busy={isPurchasing}
          >
            {isPurchasing ? (
              <>
                <Loader2
                  className="h-4 w-4 animate-spin mr-2"
                  aria-hidden="true"
                />
                Purchasing…
              </>
            ) : (
              "Confirm Purchase"
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full text-gray-600"
            onClick={() => navigate(-1)}
            disabled={isPurchasing}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicketPage;
