-- SGL Research Intelligence Platform
-- A MySQL database system for managing research papers, authors, topics, and collaborations
-- Created: May 16, 2025

-- Drop database if it exists and create a new one
DROP DATABASE IF EXISTS sgl_research;
CREATE DATABASE sgl_research;
USE sgl_research;

-- Create institutions table
-- Stores information about research institutions
CREATE TABLE institutions (
    institution_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    website VARCHAR(255),
    established_year INT,
    is_african BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (name, country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Research institutions and their details';

-- Create authors table 
-- Stores information about researchers and authors
CREATE TABLE authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    institution_id INT,
    orcid_id VARCHAR(19),
    h_index INT DEFAULT 0,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE SET NULL,
    UNIQUE KEY (email),
    UNIQUE KEY (orcid_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Research authors and their profiles';

-- Create topics table
-- Categorizes research domains and fields
CREATE TABLE topics (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    field VARCHAR(100) NOT NULL,
    description TEXT,
    parent_topic_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_topic_id) REFERENCES topics(topic_id) ON DELETE SET NULL,
    UNIQUE KEY (name, field)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Research topics and their hierarchical structure';

-- Create papers table
-- Stores research paper metadata
CREATE TABLE papers (
    paper_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    abstract TEXT,
    publication_year YEAR NOT NULL,
    doi VARCHAR(255),
    journal VARCHAR(255),
    volume VARCHAR(50),
    issue VARCHAR(50),
    pages VARCHAR(50),
    publication_status ENUM('published', 'in press', 'under review', 'preprint') DEFAULT 'published',
    topic_id INT,
    open_access BOOLEAN DEFAULT FALSE,
    citation_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id) ON DELETE SET NULL,
    UNIQUE KEY (doi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Research papers and their metadata';

-- Create paper_authors table (many-to-many relationship between papers and authors)
-- Tracks which authors contributed to which papers
CREATE TABLE paper_authors (
    paper_id INT NOT NULL,
    author_id INT NOT NULL,
    author_position INT NOT NULL COMMENT 'Position in author list (1 for first author, etc.)',
    is_corresponding BOOLEAN DEFAULT FALSE,
    contribution_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (paper_id, author_id),
    FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Many-to-many relationship between papers and their authors';

-- Create citations table
-- Tracks which papers cite other papers
CREATE TABLE citations (
    citation_id INT AUTO_INCREMENT PRIMARY KEY,
    citing_paper_id INT NOT NULL,
    cited_paper_id INT NOT NULL,
    citation_context TEXT COMMENT 'Optional text showing how the citation was used',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citing_paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    FOREIGN KEY (cited_paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    UNIQUE KEY (citing_paper_id, cited_paper_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tracks paper citation relationships';

-- Create collaborations table
-- Tracks collaborative relationships between authors
CREATE TABLE collaborations (
    author1_id INT NOT NULL,
    author2_id INT NOT NULL,
    first_collaboration_year YEAR,
    collaboration_count INT DEFAULT 1 COMMENT 'Number of papers co-authored',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (author1_id, author2_id),
    FOREIGN KEY (author1_id) REFERENCES authors(author_id) ON DELETE CASCADE,
    FOREIGN KEY (author2_id) REFERENCES authors(author_id) ON DELETE CASCADE,
    CHECK (author1_id < author2_id) COMMENT 'Ensures no duplicate collaborations in reverse order'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tracks collaborative relationships between authors';

-- Create keywords table
-- Stores standardized keywords for research topics
CREATE TABLE keywords (
    keyword_id INT AUTO_INCREMENT PRIMARY KEY,
    term VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (term)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Standardized keywords for research topics';

-- Create paper_keywords table (many-to-many relationship between papers and keywords)
-- Associates papers with relevant keywords
CREATE TABLE paper_keywords (
    paper_id INT NOT NULL,
    keyword_id INT NOT NULL,
    relevance_score DECIMAL(3,2) DEFAULT 1.00 COMMENT 'How relevant the keyword is to the paper (0-1)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (paper_id, keyword_id),
    FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    FOREIGN KEY (keyword_id) REFERENCES keywords(keyword_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Associates papers with relevant keywords';

-- Create grants table
-- Tracks research funding information
CREATE TABLE grants (
    grant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    funding_agency VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Research funding information';

-- Create paper_grants table (many-to-many relationship between papers and grants)
-- Associates papers with their funding sources
CREATE TABLE paper_grants (
    paper_id INT NOT NULL,
    grant_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (paper_id, grant_id),
    FOREIGN KEY (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE,
    FOREIGN KEY (grant_id) REFERENCES grants(grant_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Associates papers with their funding sources';

-- Create indexes for common queries
CREATE INDEX idx_papers_year ON papers(publication_year);
CREATE INDEX idx_papers_topic ON papers(topic_id);
CREATE INDEX idx_authors_institution ON authors(institution_id);
CREATE INDEX idx_institutions_country ON institutions(country);
CREATE INDEX idx_institutions_african ON institutions(is_african);
CREATE INDEX idx_papers_citation_count ON papers(citation_count DESC);

-- Create a view for most cited papers
CREATE VIEW most_cited_papers AS
SELECT p.paper_id, p.title, p.publication_year, p.citation_count, t.name AS topic_name
FROM papers p
LEFT JOIN topics t ON p.topic_id = t.topic_id
ORDER BY p.citation_count DESC;

-- Create a view for African research output by country
CREATE VIEW african_research_by_country AS
SELECT i.country, COUNT(DISTINCT p.paper_id) AS paper_count
FROM papers p
JOIN paper_authors pa ON p.paper_id = pa.paper_id
JOIN authors a ON pa.author_id = a.author_id
JOIN institutions i ON a.institution_id = i.institution_id
WHERE i.is_african = TRUE
GROUP BY i.country
ORDER BY paper_count DESC;

-- Create a view for top collaborating institutions
CREATE VIEW top_collaborating_institutions AS
SELECT 
    i1.name AS institution1,
    i2.name AS institution2,
    COUNT(DISTINCT p.paper_id) AS collaboration_count
FROM paper_authors pa1
JOIN paper_authors pa2 ON pa1.paper_id = pa2.paper_id AND pa1.author_id < pa2.author_id
JOIN authors a1 ON pa1.author_id = a1.author_id
JOIN authors a2 ON pa2.author_id = a2.author_id
JOIN institutions i1 ON a1.institution_id = i1.institution_id
JOIN institutions i2 ON a2.institution_id = i2.institution_id
JOIN papers p ON pa1.paper_id = p.paper_id
WHERE i1.institution_id < i2.institution_id
GROUP BY i1.institution_id, i2.institution_id
ORDER BY collaboration_count DESC;

-- Sample trigger to update citation count when a new citation is added
DELIMITER //
CREATE TRIGGER after_citation_insert
AFTER INSERT ON citations
FOR EACH ROW
BEGIN
    UPDATE papers 
    SET citation_count = citation_count + 1
    WHERE paper_id = NEW.cited_paper_id;
END //
DELIMITER ;

-- Sample trigger to update collaboration count when a new paper with multiple authors is added
DELIMITER //
CREATE TRIGGER after_paper_author_insert
AFTER INSERT ON paper_authors
FOR EACH ROW
BEGIN
    DECLARE author_count INT;
    SELECT COUNT(*) INTO author_count FROM paper_authors WHERE paper_id = NEW.paper_id;
    
    IF author_count > 1 THEN
        -- For each other author of this paper
        INSERT INTO collaborations (author1_id, author2_id, collaboration_count, first_collaboration_year)
        SELECT 
            LEAST(NEW.author_id, a.author_id) AS author1_id,
            GREATEST(NEW.author_id, a.author_id) AS author2_id,
            1,
            (SELECT publication_year FROM papers WHERE paper_id = NEW.paper_id)
        FROM paper_authors a
        WHERE 
            a.paper_id = NEW.paper_id AND 
            a.author_id != NEW.author_id
        ON DUPLICATE KEY UPDATE 
            collaboration_count = collaboration_count + 1;
    END IF;
END //
DELIMITER ;
