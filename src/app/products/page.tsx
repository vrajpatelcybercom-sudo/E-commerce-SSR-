import ProductsPage, { generateMetadata } from "@/pages/ProductsPage";

export { generateMetadata };

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <ProductsPage searchParams={searchParams} />;
}
