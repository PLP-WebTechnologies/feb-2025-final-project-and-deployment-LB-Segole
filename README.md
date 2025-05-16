# Final Project and Deployment

SGL Research Intelligence Platform
A MySQL-powered database system designed to store, manage, and query research papers, authors, topics, and collaborations — built as a foundation for an African-led knowledge network.
Project Description
The SGL Research Intelligence Platform is a comprehensive database management system specifically designed to increase the visibility and impact of African research while providing powerful tools for tracking global research trends, collaborations, and citations.
Key Features

Research Paper Management: Store and organize research papers with detailed metadata
Author Tracking: Monitor researchers, their affiliations, and research output
Citation Analysis: Track paper citations to identify influential research
Collaboration Networks: Identify and analyze research partnerships
African Research Focus: Special features to highlight and promote African research contributions
Institutional Relationships: Track collaborative efforts between research institutions
Funding Transparency: Monitor research grants and funding sources

Database Schema
The database consists of the following core tables:

institutions: Research organizations and their details
authors: Researcher profiles with institutional affiliations
topics: Research domains with hierarchical relationships
papers: Research publications with complete metadata
paper_authors: Many-to-many relationship tracking paper authorship
citations: Tracks which papers cite other papers
collaborations: Records collaborative relationships between authors
keywords: Standardized terms for categorizing research
paper_keywords: Associates papers with relevant keywords
grants: Research funding information
paper_grants: Associates papers with their funding sources

Entity Relationship Diagram (ERD)
The ERD is included in the repository as sgl_research_erd.svg. This SVG file provides a visual representation of the database structure, showing all tables and their relationships.
To view the ERD:

Download the SVG file from this repository
Open it in any web browser or SVG-compatible image viewer
Use it in your documentation or presentations

Setup Instructions
Prerequisites

MySQL 5.7 or higher
Access to a MySQL client or command line interface

Installation Steps

Clone this repository:
bashgit clone https://github.com/PLP-WebTechnologies/feb-2025-final-project-and-deployment-LB-Segole.git
cd sgl-research-platform

Import the SQL file into your MySQL server:
bashmysql -u your_username -p < sgl_research_db.sql
Alternatively, you can use a MySQL client like MySQL Workbench:

Open MySQL Workbench
Connect to your MySQL server
Go to File > Open SQL Script
Select the sgl_research_db.sql file
Execute the script (lightning bolt icon)


Verify installation:
bashmysql -u your_username -p -e "USE sgl_research; SHOW TABLES;"
You should see a list of all the tables that were created.

Usage Examples
Finding the Most Cited Papers
sqlSELECT * FROM most_cited_papers LIMIT 10;
Analyzing African Research Output by Country
sqlSELECT * FROM african_research_by_country;
Identifying Top Collaborating Institutions
sqlSELECT * FROM top_collaborating_institutions LIMIT 10;
Finding All Papers by an Author
sqlSELECT p.* 
FROM papers p
JOIN paper_authors pa ON p.paper_id = pa.paper_id
JOIN authors a ON pa.author_id = a.author_id
WHERE a.last_name = 'Smith' AND a.first_name = 'John';
Future Development
This database is designed as a foundation for a more comprehensive research intelligence platform that could include:

API for programmatic data access
Web interface for searching and analyzing research
Visualization tools for research networks and trends
Integration with global research databases

Designed to support African research visibility
Structure inspired by global research databases with adaptations for regional focus
