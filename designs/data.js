
// Content data for Utkarsh Panchal personal site prototype

window.SITE_CONFIG = {
  currently: {
    location: "Phoenix, AZ",
    reading: "The Alignment Problem",
    building: "Context Window",
    writing: "The Case Against Explainers",
  },
  about: "Phoenix, AZ · CS @ ASU · Open to 2026 roles",
};

window.SITE_DATA = {
  posts: [
    {
      slug: "india-china-us-triangle-2026",
      title: "The India–China–US Triangle in 2026",
      date: "Apr 28, 2026",
      readTime: "9 min",
      category: "geopolitics",
      excerpt: "Three powers, three competing visions for the next century of global order. Here's why the geometry of this relationship matters more than the bilateral noise.",
      body: `
        <p>The framing everyone uses is wrong. India–China tensions, US–China rivalry, the Quad as containment theater — these are all descriptions of bilateral dynamics inside what is fundamentally a three-body problem. And three-body problems don't have stable equilibria.</p>
        <p>Start with the basic geometry. The US wants to maintain primacy. China wants to revise the current order. India wants strategic autonomy — which in practice means refusing to be a pawn in either direction while quietly accumulating leverage from both.</p>
        <h2>Why 2026 is different</h2>
        <p>Three things converged this year that make the triangle more acute than it's been in two decades. First, India's semiconductor ambitions stopped being aspirational and started being structural — the CHIPS-equivalent legislation that passed in March wasn't just industrial policy, it was a geopolitical alignment signal. Second, China's economic deceleration is forcing Beijing into a defensive posture that's paradoxically more aggressive tactically. Third, the US election cycle removed the last margin for ambiguity in Washington's India policy.</p>
        <blockquote>The question isn't whether India will choose sides. The question is how long India can profit from not choosing.</blockquote>
        <p>The honest answer is: longer than most analysts expect. India has something neither the US nor China can easily replicate — a genuinely non-aligned tradition that is culturally legible to the Global South. That's a form of soft power that's underpriced in most strategic assessments.</p>
        <h2>What the next two years look like</h2>
        <p>Expect the economic entanglement with the US to deepen faster than the security entanglement. Supply chain diversification from China accelerates, but defense cooperation stays carefully hedged. India will sign agreements, participate in exercises, and then vote the other way in the UN — and both sides will tolerate this because the alternative is worse.</p>
        <p>The real inflection point comes if the Taiwan Strait situation deteriorates. That's the scenario where India's strategic ambiguity becomes genuinely untenable and the triangle collapses into a line.</p>
      `
    },
    {
      slug: "karpathy-nanogpt-transformer-attention",
      title: "What Karpathy's nanoGPT Taught Me About Transformer Attention",
      date: "Apr 14, 2026",
      readTime: "12 min",
      category: "ai",
      excerpt: "Reading nanoGPT line by line was the best thing I did for my ML intuition. Here's the attention mechanism, demystified from first principles.",
      body: `
        <p>There's a version of understanding transformers where you read the Attention Is All You Need paper, nod along to the diagrams, and feel like you understand it. I did this. I did not understand it.</p>
        <p>The version that actually worked: cloning <code>karpathy/nanoGPT</code> and refusing to move past any line until I could explain it to myself out loud.</p>
        <h2>The thing attention is actually doing</h2>
        <p>Every explanation of attention starts with the query-key-value framing. Very few explain why that decomposition makes sense as a primitive. Here's my attempt.</p>
        <p>Imagine you're a token — say, the word "bank" in the sentence "I went to the bank to deposit money." You need to figure out what you mean. To do that, you need to look at the other tokens and figure out which ones are relevant to your current meaning.</p>
        <p>Attention is a learned soft lookup. You emit a query (what am I looking for?), every other token emits a key (what am I about?), and you compute compatibility scores between your query and all their keys. The output is a weighted sum of their values, weighted by those compatibility scores.</p>
        <blockquote>The magic is that queries, keys, and values are all learned projections of the same input. The model learns to carve up the token representation into these three roles.</blockquote>
        <h2>The masking trick</h2>
        <p>In GPT-style models, you mask future tokens during training. This is why you can train on the whole sequence in parallel — you're not doing sequential rollouts, you're doing masked attention that enforces the autoregressive constraint structurally.</p>
        <pre><code># from nanoGPT model.py
att = att.masked_fill(self.bias[:,:,:T,:T] == 0, float('-inf'))
att = F.softmax(att, dim=-1)</code></pre>
        <p>That <code>float('-inf')</code> becomes 0 after softmax. Future tokens are zeroed out. The gradient flows through the present and past. Elegant.</p>
      `
    },
    {
      slug: "interest-rates-regime-change",
      title: "We're in a Rates Regime Change and Most Models Are Stale",
      date: "Mar 30, 2026",
      readTime: "7 min",
      category: "finance",
      excerpt: "Forty years of falling rates meant you could get away with a lot of sloppy capital allocation. The free lunch is over. Here's what actually changes.",
      body: `<p>Lorem ipsum body content...</p>`
    },
    {
      slug: "llm-epistemics-what-we-lost",
      title: "LLM Epistemics: What We Lost When We Stopped Googling",
      date: "Mar 12, 2026",
      readTime: "8 min",
      category: "ai",
      excerpt: "There's a subtle epistemological shift happening in how technically-minded people form beliefs. It's worth being explicit about.",
      body: `<p>Lorem ipsum body content...</p>`
    },
    {
      slug: "building-in-public-actually-means",
      title: "What 'Building in Public' Actually Means (And What It Doesn't)",
      date: "Feb 28, 2026",
      readTime: "5 min",
      category: "tech",
      excerpt: "The phrase has been colonized by people who use it to mean posting screenshots of revenue dashboards. That's not it.",
      body: `<p>Lorem ipsum body content...</p>`
    },
    {
      slug: "philosophy-of-technical-debt",
      title: "The Philosophy of Technical Debt",
      date: "Feb 10, 2026",
      readTime: "6 min",
      category: "tech",
      excerpt: "Debt is a financial metaphor. Like all financial metaphors applied to software, it misleads as much as it illuminates.",
      body: `<p>Lorem ipsum body content...</p>`
    },
    {
      slug: "india-startup-ecosystem-2026",
      title: "India's Startup Ecosystem in 2026: The Quiet Maturation",
      date: "Jan 22, 2026",
      readTime: "10 min",
      category: "geopolitics",
      excerpt: "Less noise, more infrastructure. The frothy 2021 era is a distant memory. What's left is actually more interesting.",
      body: `<p>Lorem ipsum body content...</p>`
    },
    {
      slug: "camus-absurd-software-engineer",
      title: "Camus for the Software Engineer",
      date: "Jan 8, 2026",
      readTime: "7 min",
      category: "philosophy",
      excerpt: "The absurd isn't an abstract philosophical concept. It's what you feel at 2am debugging a race condition that only appears in production.",
      body: `<p>Lorem ipsum body content...</p>`
    },
  ],

  projects: [
    {
      slug: "context-window",
      name: "Context Window",
      status: "shipped",
      description: "A Substack-integrated newsletter tool that auto-summarizes long-form AI papers into a weekly digest. Built for readers who want the signal without the noise.",
      stack: ["Next.js", "OpenAI API", "Resend", "PlanetScale"],
      problem: "AI paper output has become impossible to track. Researchers publish dozens of significant papers a week. Practitioners don't have time to read them all, but summaries are lossy. Context Window finds the middle ground.",
      approach: "Each paper goes through a two-stage pipeline: a structured extraction prompt that pulls out the key claims, methodology, and limitations; then a synthesis step that connects it to papers from the previous 90 days.",
      learned: "Rate limiting LLM calls at scale is genuinely hard. Also: most users want less than you think. The version with 10 features had worse engagement than the version with 2.",
      links: { github: "#", live: "#" }
    },
    {
      slug: "latent-space-explorer",
      name: "Latent Space Explorer",
      status: "wip",
      description: "Interactive visualization of word embedding spaces. Drag tokens around, see semantic neighborhoods, watch analogies resolve in real time.",
      stack: ["React", "Three.js", "FastAPI", "UMAP"],
      problem: "Embedding spaces are conceptually central to modern ML but almost nobody has an intuitive feel for them. Most visualizations are static screenshots.",
      approach: "Project high-dimensional embeddings to 3D with UMAP, render with Three.js, allow real-time token injection and nearest-neighbor highlighting.",
      learned: "Three.js performance with 50k points is manageable. 500k is not. UMAP is slow; pre-compute everything.",
      links: { github: "#" }
    },
    {
      slug: "polemic",
      name: "Polemic",
      status: "shipped",
      description: "A minimal Markdown-based blogging engine with first-class support for academic citations, footnotes, and sidenotes. What Ghost should be for writers who care about typography.",
      stack: ["Rust", "SQLite", "HTMX", "Pandoc"],
      problem: "Every blogging platform makes the same tradeoffs: rich editor or Markdown, but not both done well. Academic-style citations are an afterthought.",
      approach: "Pandoc as the rendering engine gives you 20 years of typographic work for free. Wrap it in a thin Rust server with SQLite.",
      learned: "Rust is genuinely fast. The ecosystem is maturing fast. HTMX is underrated for content sites where full SPAs are overkill.",
      links: { github: "#", live: "#" }
    },
    {
      slug: "market-microstructure-viz",
      name: "Market Microstructure Viz",
      status: "archived",
      description: "Real-time order book visualization for crypto markets. Built to understand how liquidity actually works at the millisecond level.",
      stack: ["Python", "WebSockets", "D3.js", "Redis"],
      problem: "Understanding order books from static textbook diagrams is like learning to swim from a book. You need to watch one breathe.",
      approach: "Stream WebSocket data from exchange APIs, buffer in Redis, push to frontend via SSE, visualize with D3.",
      learned: "WebSocket data is extremely noisy. The interesting signal is in the aggregation, not the raw feed. Also: crypto market microstructure is genuinely fascinating.",
      links: { github: "#" }
    }
  ],

  reading: {
    currentlyReading: [
      { title: "The Alignment Problem", author: "Brian Christian", year: 2020, format: "book", note: "Better than most technical AI safety writing because it takes the human side seriously." },
      { title: "Antifragile", author: "Nassim Nicholas Taleb", year: 2012, format: "book", note: null },
      { title: "The Technological Society", author: "Jacques Ellul", year: 1964, format: "book", note: "Dense. Prophetic. Worth the effort." }
    ],
    recentFinishes: [
      { title: "The Innovator's Dilemma", author: "Clayton Christensen", year: 1997, format: "book", note: "Still the best framework for thinking about why incumbents fail." },
      { title: "Thinking in Systems", author: "Donella Meadows", year: 2008, format: "book", note: null },
      { title: "Scale", author: "Geoffrey West", year: 2017, format: "book", note: "The power law stuff is worth it. The second half loses the thread." },
      { title: "Poor Charlie's Almanack", author: "Charlie Munger", year: 2005, format: "book", note: "The mental models framework is real. The hagiography is tiresome." },
      { title: "The Dream Machine", author: "M. Mitchell Waldrop", year: 2001, format: "book", note: "Licklider invented the internet in his head before anyone had the hardware for it." }
    ],
    papers: [
      { title: "Attention Is All You Need", author: "Vaswani et al.", year: 2017, format: "paper", note: "Read it at least three times. It gets richer." },
      { title: "Scaling Laws for Neural Language Models", author: "Kaplan et al., OpenAI", year: 2020, format: "paper", note: null },
      { title: "The Bitter Lesson", author: "Richard Sutton", year: 2019, format: "essay", note: "Short. Important. Most ML practitioners haven't internalized it yet." },
      { title: "Kolmogorov Complexity and Algorithmic Randomness", author: "Shen, Uspensky, Vereshchagin", year: 2017, format: "paper", note: "Background reading for thinking seriously about information." },
      { title: "An Empirical Model of Large-Batch Training", author: "McCandlish et al., OpenAI", year: 2018, format: "paper", note: null }
    ],
    avoiding: [
      { title: "Zero to One", author: "Peter Thiel", reason: "The insights are real but they've been quoted into meaninglessness. Read the original CS183 notes instead." },
      { title: "Atomic Habits", author: "James Clear", reason: "One good idea stretched to 300 pages. The idea: systems beat goals. You now know the book." },
      { title: "The Lean Startup", author: "Eric Ries", reason: "The vocabulary (MVP, pivot, build-measure-learn) ate the thinking. The book is less interesting than its shadow." },
    ]
  }
};
