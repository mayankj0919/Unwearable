"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getTemplateById, getTemplatesByProduct } from "@/lib/designApi";
import { getProductBySlug } from "@/lib/api";
import DesignBuilder from "@/components/builder/DesignBuilder";
import type { Template, Product } from "@/types";

export default function CustomizePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const templateId = params?.templateId as string;
  const productSlug = searchParams?.get("product") ?? "";
  const selectedSize = searchParams?.get("size") ?? "L";

  const [template, setTemplate] = useState<Template | null>(null);
  const [allTemplates, setAllTemplates] = useState<Template[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [tmpl, prod] = await Promise.all([
          getTemplateById(templateId),
          getProductBySlug(productSlug),
        ]);

        if (!tmpl) throw new Error("Template not found");
        if (!prod) throw new Error("Product not found");

        const siblings = await getTemplatesByProduct(prod.slug);

        setTemplate(tmpl);
        setAllTemplates(siblings.length > 0 ? siblings : [tmpl]);
        setProduct(prod);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    if (templateId && productSlug) {
      load();
    } else {
      setError("Missing template or product information.");
      setLoading(false);
    }
  }, [templateId, productSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-xl uppercase animate-pulse">Loading builder...</p>
      </div>
    );
  }

  if (error || !product || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="border-brutal border-3 p-8 text-center max-w-md">
          <p className="font-mono text-2xl uppercase mb-2">Error</p>
          <p className="font-sans text-brutal-black/60">{error ?? "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  return (
    <DesignBuilder
      templates={allTemplates}
      product={product}
      selectedSize={selectedSize}
    />
  );
}
