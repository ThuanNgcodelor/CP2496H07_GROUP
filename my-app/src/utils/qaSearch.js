
function normalize(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s) {
  return normalize(s)
    .split(" ")
    .filter(Boolean);
}

function vectorize(terms) {
  const vec = new Map();
  for (const t of terms) vec.set(t, (vec.get(t) || 0) + 1);
  return vec;
}

function cosineSim(vecA, vecB) {
  let dot = 0, a2 = 0, b2 = 0;
  for (const [k, v] of vecA) {
    if (vecB.has(k)) dot += v * vecB.get(k);
    a2 += v * v;
  }
  for (const v of vecB.values()) b2 += v * v;
  if (!a2 || !b2) return 0;
  return dot / (Math.sqrt(a2) * Math.sqrt(b2));
}

export function buildIndex(kb) {
  const docs = [];
  for (const cat of kb?.petCareKnowledge || []) {
    for (const f of cat.faqs || []) {
      const joined = `${cat.category} ${f.question} ${f.answer}`;
      const tokens = tokenize(joined);
      docs.push({
        id: docs.length,
        category: cat.category,
        question: f.question,
        answer: f.answer,
        tokens,
        vec: vectorize(tokens)
      });
    }
  }

  const df = new Map();
  for (const d of docs) {
    const uniq = new Set(d.tokens);
    for (const t of uniq) df.set(t, (df.get(t) || 0) + 1);
  }
  const N = Math.max(docs.length, 1);
  const idf = new Map();
  for (const [t, n] of df) {
    idf.set(t, Math.log(1 + (N - n + 0.5) / (n + 0.5)));
  }

  for (const d of docs) {
    for (const [t, tf] of d.vec) {
      d.vec.set(t, tf * (idf.get(t) || 0));
    }
  }
  return { docs, idf, N };
}

export function searchBest(index, query) {
  const qTokens = tokenize(query);
  if (!qTokens.length) return null;
  const qVec = vectorize(qTokens);
  for (const [t, tf] of qVec) {
    qVec.set(t, tf * (index.idf.get(t) || 0));
  }
  // rank
  let best = null;
  for (const d of index.docs) {
    const score = cosineSim(d.vec, qVec);
    if (!best || score > best.score) best = { ...d, score };
  }
  // basic threshold + fallback: substring
  if (best && best.score >= 0.06) return best;
  // fallback: naive keyword containment
  const q = normalize(query);
  const hit = index.docs.find(d =>
    normalize(d.question).includes(q) || normalize(d.answer).includes(q)
  );
  return hit ? { ...hit, score: 0.03 } : null;
}

export function topK(index, query, k = 3) {
  const qTokens = tokenize(query);
  if (!qTokens.length) return [];
  const qVec = vectorize(qTokens);
  for (const [t, tf] of qVec) qVec.set(t, tf * (index.idf.get(t) || 0));
  const ranked = index.docs
    .map(d => ({ d, s: cosineSim(d.vec, qVec) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .filter(x => x.s > 0.03)
    .map(x => ({ ...x.d, score: x.s }));
  return ranked;
}
