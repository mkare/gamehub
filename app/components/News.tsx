"use client";
import { useEffect, useState } from "react";
import Slider from "./Slider";
import { truncate } from "@/app/lib/helpers";

interface Article {
  source: {
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
}

interface NewsComponentProps {
  query: string;
}

// News API'den haberleri almak için fetchNewsArticles fonksiyonu
const fetchNewsArticles = async (query: string) => {
  try {
    const apiKey = "30a85c009a44465391d1e598a7d116a8"; // Kendi News API Key'inizi kullanın

    // News API'den makaleleri almak için everything endpoint'ini kullanıyoruz
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        query
      )}&language=en&pageSize=12&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news articles");
    }

    const data = await response.json();
    return data.articles;
  } catch (err: any) {
    console.error("News API error:", err.message);
    return null;
  }
};

const NewsComponent = ({ query }: NewsComponentProps) => {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await fetchNewsArticles(query);
        if (!fetchedArticles) {
          throw new Error("No articles found");
        }

        setArticles(fetchedArticles);
      } catch (err: any) {
        setError("News API error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [query]);

  if (loading) {
    return (
      <div className="p-4 d-flex flex-column align-items-center w-100">
        <p className="text-muted">News articles are Loading...</p>
        <p className="text-muted">Please wait.</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!articles?.length) {
    return <p className="text-muted">No news articles found for {query}.</p>;
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <h2 className="mb-5 h5">
        Top News for <i>{query}</i>
      </h2>
      {articles && (
        <Slider slidePerView={3}>
          {articles.map((article, index) => (
            <div className="mt-4 ml-4 keen-slider__slide" key={index}>
              <a href={article.url} target="_blank" className="d-block">
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="image"
                  />
                )}
                <div className="title">{truncate(article.description, 60)}</div>
              </a>
              {/* <p className="text-sm text-muted">
                Source: {article.source.name}
              </p>
              <p className="text-sm text-muted">
                Published: {new Date(article.publishedAt).toLocaleDateString()}
              </p> */}
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default NewsComponent;
