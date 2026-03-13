// Database schema definitions
export const SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  role TEXT CHECK(role IN ('admin', 'customer', 'partner')) DEFAULT 'customer',
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until DATETIME
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  images TEXT,
  author_id INTEGER REFERENCES users(id),
  status TEXT CHECK(status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  views INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK(type IN ('general', 'sales', 'support', 'partnership', 'quote')) DEFAULT 'general',
  status TEXT CHECK(status IN ('new', 'in_progress', 'resolved', 'spam')) DEFAULT 'new',
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  responded_at DATETIME,
  response_notes TEXT
);

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER REFERENCES job_listings(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  resume_path TEXT,
  cover_letter TEXT,
  status TEXT CHECK(status IN ('new', 'reviewing', 'interviewed', 'accepted', 'rejected')) DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

-- Job listings table
CREATE TABLE IF NOT EXISTS job_listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT CHECK(type IN ('full_time', 'part_time', 'contract')) DEFAULT 'full_time',
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  benefits TEXT,
  salary_range TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME
);

-- Quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  service_type TEXT NOT NULL,
  origin_city TEXT,
  destination_city TEXT,
  estimated_volume TEXT,
  additional_details TEXT,
  status TEXT CHECK(status IN ('new', 'contacted', 'quoted', 'converted', 'lost')) DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  assigned_to INTEGER REFERENCES users(id)
);

-- Audit log table for security
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id INTEGER,
  old_values TEXT,
  new_values TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  is_valid INTEGER DEFAULT 1
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT CHECK(source IN ('contact', 'quote', 'manual', 'blog')) DEFAULT 'manual',
  is_active INTEGER DEFAULT 1,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at DATETIME
);

-- Customer reviews table
CREATE TABLE IF NOT EXISTS customer_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  company_name TEXT,
  position TEXT,
  review_text TEXT NOT NULL,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5) DEFAULT 5,
  avatar_url TEXT,
  status TEXT CHECK(status IN ('pending', 'published', 'rejected')) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_status ON customer_reviews(status);
`;

export default SCHEMA;
