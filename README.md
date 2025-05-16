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


