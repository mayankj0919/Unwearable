"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAllTemplates, updateTemplate, deleteTemplate } from "@/lib/designApi";
import BrutalButton from "@/components/ui/BrutalButton";
import type { Template } from "@/types";

interface TemplateListProps {
  onEdit?: (template: Template) => void;
}

export default function TemplateList({ onEdit }: TemplateListProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await getAllTemplates();
    setTemplates(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (t: Template) => {
    await updateTemplate(t.id, { is_active: !t.is_active });
    setTemplates((prev) =>
      prev.map((tmpl) => tmpl.id === t.id ? { ...tmpl, is_active: !tmpl.is_active } : tmpl)
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template? This cannot be undone.")) return;
    const ok = await deleteTemplate(id);
    if (ok) setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) {
    return <p className="font-mono text-sm uppercase animate-pulse">Loading templates...</p>;
  }

  if (templates.length === 0) {
    return (
      <div className="border-brutal border-3 p-8 text-center">
        <p className="font-mono text-lg uppercase">No templates yet</p>
        <p className="font-sans text-brutal-black/60 mt-1">Create one using the form above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {templates.map((t, i) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="border-brutal border-3 bg-cream grid grid-cols-[auto_1fr_auto] gap-4 overflow-hidden"
        >
          {/* Thumbnail */}
          <div className="w-20 h-20 bg-brutal-black/5 border-r-brutal border-r-3 flex-shrink-0 overflow-hidden">
            <img
              src={t.base_image_url}
              alt={t.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>

          {/* Info */}
          <div className="py-3 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="font-mono text-sm font-bold uppercase">{t.name}</p>
              <span className={`font-mono text-xs px-2 py-0.5 border ${t.is_active ? "border-accent text-accent" : "border-brutal-black/30 text-brutal-black/40"}`}>
                {t.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="font-mono text-xs text-brutal-black/50 uppercase mt-1">
              Product: {t.product_id} · {t.placements.length} slots · {t.colors.length} colors
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {t.colors.map((c) => (
                <div key={c.id} className="flex items-center gap-1 border border-brutal-black/20 px-1.5 py-0.5">
                  <div className="w-3 h-3" style={{ backgroundColor: c.hex }} />
                  <span className="font-mono text-[10px] uppercase">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col border-l-brutal border-l-3 divide-y divide-brutal-black">
            <button
              onClick={() => toggleActive(t)}
              className="flex-1 px-4 font-mono text-xs uppercase hover:bg-accent/10 transition-colors"
            >
              {t.is_active ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => handleDelete(t.id)}
              className="flex-1 px-4 font-mono text-xs uppercase hover:bg-accent hover:text-cream transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
