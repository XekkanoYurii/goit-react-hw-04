import { SearchForm } from "./SearchForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchArticlesWithTopic } from "../articles-api.js";

const ArticleList = ({ items }) => (
  <ul>
    {items.map(({ objectID, url, title }) => (
      <li key={objectID}>
        <a href={url} target="_blank" rel="noreferrer noopener">
          {title}
        </a>
      </li>
    ))}
  </ul>
);

const App = () => {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const data = await fetchArticlesWithTopic("react");
        setArticles(data);
        const response = await axios.get(
          "https://hn.algolia.com/api/v1/search1?query=react"
        );
        setArticles(response.data.hits);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);
  const handleSearch = async (topic) => {
    try {
      setArticles([]);
      setError(false);
      setLoading(true);
      const data = await fetchArticlesWithTopic(topic);
      setArticles(data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      {loading && <Loader />}
      {error && <Error />}
      {articles.length > 0 && <ArticleList items={articles} />}
    </div>
  );
};
export default App;
