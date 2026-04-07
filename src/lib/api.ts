import { supabase } from "./supabase";
import type { Product } from "@/types";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return null;
  }

  return data as Product;
}
export async function addProduct(
  productData: Omit<Product, "id" | "image">,
  imageFile: File
): Promise<Product> {
  const fileName = `${Date.now()}-${imageFile.name}`;
  
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, imageFile);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  const imageUrl = urlData.publicUrl;

  const { data, error } = await supabase
    .from("products")
    .insert([{ ...productData, image: imageUrl }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Product;
}