import Link from "next/link";
import { notFound } from "next/navigation";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Newsletter from "@/components/Newsletter";
import SectionHd from "@/components/SectionHd";
import { getConfig, getPost, getPosts } from "@/lib/api";
import { formatPostDate, linkStyle, zeroPad } from "@/lib/utils";

export const revalidate = 60;

interface PostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PostPageProps) {
  const [post, allPosts, config] = await Promise.all([
    getPost(params.slug).catch(() => null),
    getPosts(),
    getConfig(),
  ]);

  if (!post) notFound();

  const postIdx = allPosts.findIndex((p) => p.slug === params.slug);
  const related = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  const metaStatus = config.writing_now
    ? `DRAFTING · ${config.writing_now.toUpperCase()}`
    : "";

  return (
    <>
      <Nav page={`writing/${params.slug}`} metaStatus={metaStatus} />
      <div className="page-wrap">
        <div className="outer-narrow" style={{ paddingTop: 0 }}>
          <Link href="/writing" className="post-back">
            ← WRITING
          </Link>

          <div className="post-meta-row">
            <span>{formatPostDate(post.date).toUpperCase()}</span>
            <span className="post-meta-sep">·</span>
            <span>{post.read_time.toUpperCase()}</span>
            <span className="post-meta-sep">·</span>
            <span>{post.category.toUpperCase()}</span>
            <span className="post-meta-sep">·</span>
            <span>ESSAY {zeroPad(postIdx + 1)}</span>
          </div>

          <h1 className="h1" style={{ marginBottom: 0 }}>
            {post.title}
          </h1>
          <div className="post-accent-rule"></div>

          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          <div className="post-end-rule"></div>

          <div style={{ marginBottom: 32 }}>
            <BackToTop />
          </div>

          <Newsletter />

          {related.length > 0 && (
            <div className="mt-48">
              <SectionHd label="RELATED" />
              {related.map((r, i) => (
                <Link
                  key={r.slug}
                  href={`/writing/${r.slug}`}
                  className="related-mini"
                  style={linkStyle}
                >
                  <span className="related-mini-num">{zeroPad(i + 1)}</span>
                  <div>
                    <div className="related-mini-title">{r.title}</div>
                    <div className="related-mini-date">
                      {formatPostDate(r.date)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
