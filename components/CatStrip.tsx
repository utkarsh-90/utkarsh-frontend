import Link from "next/link";
import type { PostCategory } from "@/lib/types";

interface CatStripProps {
  categories: PostCategory[];
}

export default function CatStrip({ categories }: CatStripProps) {
  return (
    <div className="cat-strip mb-24">
      {categories.map((cat, i) => (
        <span key={cat}>
          <Link href={`/writing?category=${cat}`} className="cat-link">
            {cat.toUpperCase()}
          </Link>
          {i < categories.length - 1 && (
            <span className="cat-slash">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
