import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { diplomaWorksAPI } from '../services/api';
import './DiplomaDetail.css';

function DiplomaDetail() {
  const { id } = useParams();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWork();
  }, [id]);

  async function loadWork() {
    try {
      setLoading(true);
      const data = await diplomaWorksAPI.getById(id);
      setWork(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!work) return <div className="not-found">Work not found</div>;

  return (
    <div className="diploma-detail">
      <Link to="/archive" className="back-link">← Back to Archive</Link>

      <header className="detail-header">
        <h1>{work.title}</h1>
        <div className="meta">
          <span className="category">{work.category}</span>
          <span className="year">{work.year}</span>
          <span className="views">👁 {work.views} views</span>
          {work.rating > 0 && <span className="rating">⭐ {work.rating}</span>}
        </div>
      </header>

      {/* Screenshots */}
      {work.screenshots?.length > 0 && (
        <div className="screenshots">
          {work.screenshots.map((src, idx) => (
            <img key={idx} src={src} alt={`Screenshot ${idx + 1}`} />
          ))}
        </div>
      )}

      {/* Description */}
      <section className="description">
        <h2>About This Project</h2>
        <p>{work.description}</p>
        {work.full_description && (
          <div className="full-description">
            {work.full_description.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}
      </section>

      {/* Technologies */}
      {work.technologies?.length > 0 && (
        <section className="technologies">
          <h2>Technologies Used</h2>
          <div className="tech-list">
            {work.technologies.map((tech, i) => (
              <span key={i} className="tech-tag">{tech}</span>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      <section className="links">
        <h2>Project Links</h2>
        <div className="link-buttons">
          {work.demo_url && (
            <a href={work.demo_url} target="_blank" rel="noopener noreferrer" className="link-btn demo">
              🌐 Live Demo
            </a>
          )}
          {work.github_url && (
            <a href={work.github_url} target="_blank" rel="noopener noreferrer" className="link-btn github">
              📁 Source Code
            </a>
          )}
          {work.documentation_url && (
            <a href={work.documentation_url} target="_blank" rel="noopener noreferrer" className="link-btn docs">
              📄 Documentation
            </a>
          )}
        </div>
      </section>

      {/* Author */}
      <section className="author">
        <h2>Author</h2>
        <div className="author-card">
          {work.student_avatar && (
            <img src={work.student_avatar} alt="" className="author-avatar" />
          )}
          <div className="author-info">
            <h3>{work.student_name}</h3>
            <p>{work.student_department}</p>
            {work.student_email && <p>{work.student_email}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DiplomaDetail;
