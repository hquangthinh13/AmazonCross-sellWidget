import { Button } from "@/components/ui/button";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleQuestionMark, Star } from "lucide-react";

const REASON_LABELS = {
  co_purchase: "Frequently bought together with this item",
  category: "From the same or a closely related category",
  title: "Has a very similar product type or name",
};

const GRAPH_REASONS = new Set([
  "same_louvain",
  "same_spectral",
  "node2vec",
  "gcn",
]);

function abstractReasons(reasons = []) {
  const readable = [];

  if (reasons.includes("co_purchase")) {
    readable.push("Customers who bought this item also often buy this one.");
  }

  if (reasons.includes("category")) {
    readable.push("It belongs to the same or a closely related category.");
  }

  if (reasons.includes("title")) {
    readable.push("It’s a very similar type of product.");
  }

  const hasGraphSignal = reasons.some((r) => GRAPH_REASONS.has(r));
  if (hasGraphSignal) {
    readable.push(
      "It appears in similar browsing and buying patterns to this item."
    );
  }

  return readable;
}
const RelatedProductDialog = ({ product }) => {
  const explanations = abstractReasons(product.reasons);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="cursor-pointer">
          <CircleQuestionMark />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="whitespace-normal break-words pr-10">
            {product.title}
          </DialogTitle>
          <DialogDescription>
            Recommended based on product similarity metrics.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <div className="flex text-xs">Spectral Community</div>
                <div className="flex text-md text-primary  font-semibold">
                  {product?.spectral_comm}
                </div>
                <div className="italic flex text-xs opacity-50">
                  {product?.scores.same_spectral == 1
                    ? "Grouped with the reference product."
                    : "Not grouped with the reference product."}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-xs">Louvain Community</div>
                <div className="flex text-md text-primary font-semibold">
                  {product?.louvain_comm}
                </div>
                <div className="italic flex text-xs opacity-50">
                  {product?.scores.same_louvain == 1
                    ? "Grouped with the reference product."
                    : "Not grouped with the reference product."}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-xs">Same Category</div>
                <div className="flex text-md text-primary font-semibold">
                  {product?.scores.category == 1 ? "True" : "False"}
                </div>
                <div className="italic flex text-xs opacity-50">
                  {product?.scores.category == 1
                    ? "Same category as the reference product."
                    : "This product is not in the same category as the reference product."}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-xs">Co-purchase</div>
                <div className="flex text-md text-primary font-semibold">
                  {product?.scores.co_purchase}
                </div>
                <div className="italic flex text-xs opacity-50">
                  {product?.scores.co_purchase == 1
                    ? "Co‑purchase with reference product."
                    : "Not bought with reference product."}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-xs">GCN</div>
                <div className="flex text-md text-primary font-semibold">
                  {product?.scores.gcn}
                </div>
                <div className="italic flex text-xs opacity-50">
                  Graph convolutions to learn global relational patterns.
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-xs ">Node2Vec</div>
                <div className="flex text-md text-primary font-semibold">
                  {product?.scores.node2vec}
                </div>
                <div className="italic flex text-xs opacity-50">
                  Node2Vec embeddings to capture local neighborhood structures.
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-xs">TF-IDF</div>
                <div className="flex text-md text-primary font-semibold">
                  {product?.scores.title}
                </div>
                <div className="italic flex text-xs opacity-50">
                  The textual similarity between the product titles.
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex text-xs ">Raw Weight</div>
                <div className="flex text-md text-primary font-semibold">
                  {product?.raw_w}
                </div>
                <div className="italic flex text-xs opacity-50">
                  Raw count of co‑purchases or co‑reviews.
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-xs items-center">
                  Final Score{" "}
                  <Star className="text-primary ml-1 fill-primary h-3 w-3" />{" "}
                </div>
                <div className="flex text-md text-primary  font-semibold">
                  {product?.final_score}
                </div>
                <div className="italic flex text-xs opacity-50">
                  The combination of behavioral, structural, and content
                  signals.
                </div>
              </div>
            </div>
            <div className="mt-2 flex flex-col text-justify text-xs text-primary-foreground gap-1">
              {explanations.slice(0, 3).map((reason, idx) => (
                <div key={idx} className="flex gap-1">
                  <span>•</span>
                  <span>{reason} </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default RelatedProductDialog;
