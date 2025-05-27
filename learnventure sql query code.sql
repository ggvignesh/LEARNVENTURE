-- First, make sure we're using the right database
USE learnventure;

-- Drop existing tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    content_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_messages table
CREATE TABLE chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert the courses data (only once)
INSERT INTO courses (name, category, content_url) VALUES
-- Intermediate Courses
('MATHEMATICS', 'INTERMEDIATE', 'https://drive.google.com/drive/folders/1xNHR79J292OA5xlTuxibOSkNYlhHWIe5?usp=sharing'),
('PHYSICS', 'INTERMEDIATE', 'https://drive.google.com/drive/folders/1-rNTYQ9NZMuOy15BgT7OifJOP92gURC9?usp=sharing'),
('CHEMISTRY', 'INTERMEDIATE', 'https://drive.google.com/drive/folders/1FY297b4v33Wmd8taRWap1YBrnW8n6Ddq?usp=sharing'),

-- BTech Courses
('VIDEO LECTURES OF ALL BTECH COURSES', 'BTECH', 'https://drive.google.com/drive/folders/1CcCbTHq2RFpKSQqK-80tUReUhWz9R7Xw?usp=sharing'),
('C PROGRAMMING', 'BTECH', 'https://drive.google.com/drive/folders/1iebLhNwqA7x3JIf63OAVltrmmk4XJ5Mc?usp=sharing'),
('C++ PROGRAMMING', 'BTECH', 'https://drive.google.com/drive/folders/1DD6scLQaJ7LKUKa3JaZyu0beZ__OlkYT?usp=sharing'),
('JAVA PROGRAMMING', 'BTECH', 'https://drive.google.com/drive/folders/1h0FLXWA1lHBSP1B2RZu-pS_s2PA8ZneI?usp=sharing'),
('PYTHON PROGRAMMING', 'BTECH', 'https://drive.google.com/drive/folders/1Kl3xWnp3G44WDuEHRk27w8tiuxIbSXG_?usp=sharing'),
('DSA (IN C, C++, JAVA, PYTHON)', 'BTECH', 'https://drive.google.com/drive/folders/1bZpnr1-xh2c7Fq2ptQPJj8L-Z6ctLL30?usp=sharing'),
('AI & ML', 'BTECH', 'https://drive.google.com/drive/folders/167Jq6O2aSl0uV_arziCuRfsqXoMbVqkt?usp=sharing'),
('DATA SCIENCE', 'BTECH', 'https://drive.google.com/drive/folders/1-tdxLcuWqSGngjH-TqvswfSBUCtkzwxs?usp=sharing'),
('SQL', 'BTECH', 'https://drive.google.com/drive/folders/1zkzHuYdI0tI-qIOHQkbpxhhjKSKvI2zL?usp=sharing'),
('POWER BI', 'BTECH', 'https://drive.google.com/drive/folders/1H_iNixcQDyWJphTQD85vwp1JJEAqCS9r?usp=sharing'),
('TABLEAU', 'BTECH', 'https://drive.google.com/drive/folders/1Ml0A5YdPFB0FwtpT55RtQvs3xghtvj1N?usp=sharing'),
('HTML', 'BTECH', 'https://drive.google.com/drive/folders/14RiCCAFYyk1MuB3Ar1wwD3gokSNoHh2E?usp=sharing'),
('CSS', 'BTECH', 'https://drive.google.com/drive/folders/1PDEmCOfh6meIsl6l2ZYEUekFSK8TBrQD?usp=sharing'),
('BOOTSTRAP', 'BTECH', 'https://drive.google.com/drive/folders/1OE7C2okxtOFOrsexgeskaQjHp_eHhNgW?usp=sharing'),
('JAVASCRIPT', 'BTECH', 'https://drive.google.com/drive/folders/1VWIb2advJ0kBTaKD_AtiZyOIwgHHhcOX?usp=sharing'),
('REACT.JS', 'BTECH', 'https://drive.google.com/drive/folders/1Uw2TDULcpg0dOjU68H-qqkIae_FsVRAP?usp=sharing'),
('ANGULAR.JS', 'BTECH', 'https://drive.google.com/drive/folders/1gijn_zIzywJ9vUScX_CdzVD8nRc-r2wI?usp=sharing'),
('NODE.JS', 'BTECH', 'https://drive.google.com/drive/folders/1_e4EWpztBPyiC73L0HSO0zHYMEvN_gp2?usp=sharing'),
('EXPRESS.JS', 'BTECH', 'https://drive.google.com/drive/folders/1EXMi62dLjfY6E3nFtz5ROpmTfIz89eJY?usp=sharing'),
('MONGO DB', 'BTECH', 'https://drive.google.com/drive/folders/1FbxX3BBklgmqcSIbyfmwtkE20GrffBxI?usp=sharing'),
('DEEP LEARNING', 'BTECH', 'https://drive.google.com/drive/folders/1A8F_c_CIJQ1qglOTIlJUF1dgnUjU43wO?usp=sharing'),
('NLP', 'BTECH', 'https://drive.google.com/drive/folders/1B1G9G-QCFK2eyX_-3Y5tWmoeXAD5SOWy?usp=sharing');

select * from courses;