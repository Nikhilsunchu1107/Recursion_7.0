import re
from collections import Counter

import numpy as np
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS, TfidfVectorizer


CUSTOM_STOP_WORDS = set(ENGLISH_STOP_WORDS) | {
    "episode",
    "full",
    "part",
    "short",
    "shorts",
    "video",
    "videos",
    "best",
    "new",
    "today",
    "official",
    "channel",
    "review",
    "tutorial",
    "guide",
    "2023",
    "2024",
    "2025",
    "2026",
}


def _fallback_frequency(text: str, top_n: int) -> list[str]:
    cleaned = re.sub(r"[^a-zA-Z0-9\s]", " ", (text or "").lower())
    words = [
        token
        for token in cleaned.split()
        if token not in CUSTOM_STOP_WORDS and len(token) >= 3 and not token.isdigit()
    ]
    counter = Counter(words)
    return [word for word, _ in counter.most_common(top_n)]


def extract_tfidf_keywords(documents: list[str], top_n: int = 15) -> list[str]:
    """Extract top TF-IDF keywords across a corpus of text documents."""
    non_empty_docs = [doc for doc in documents if isinstance(doc, str) and doc.strip()]
    if not non_empty_docs:
        return []

    if len(non_empty_docs) < 2:
        return _fallback_frequency(non_empty_docs[0], top_n)

    try:
        vectorizer = TfidfVectorizer(
            stop_words=list(CUSTOM_STOP_WORDS),
            min_df=1,
            max_df=0.85,
            ngram_range=(1, 2),
            token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z0-9]{2,}\b",
        )

        tfidf_matrix = vectorizer.fit_transform(non_empty_docs)
        summed_scores = np.asarray(tfidf_matrix.sum(axis=0)).flatten()
        if not summed_scores.size:
            return _fallback_frequency(" ".join(non_empty_docs), top_n)

        feature_names = vectorizer.get_feature_names_out()
        top_indices = summed_scores.argsort()[::-1][:top_n]
        return [feature_names[i] for i in top_indices if summed_scores[i] > 0]
    except ValueError:
        return _fallback_frequency(" ".join(non_empty_docs), top_n)
