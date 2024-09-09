-- Admins' Table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phonenumber VARCHAR(20) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    gender VARCHAR(6) NOT NULL,
	position VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users' Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phonenumber VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    delivered BOOLEAN DEFAULT FALSE,
    declined BOOLEAN DEFAULT FALSE,
    cart JSONB DEFAULT '{"totalPrice": 0, "items": []}',  -- Default value as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Table
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    message TEXT NOT NULL
);

-- Product Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    photo TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurant Data Table
CREATE TABLE restaurant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_name VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurant_website_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_url TEXT NOT NULL, 
    logo_url TEXT NOT NULL,
    website_data_id UUID,
    FOREIGN KEY (website_data_id) REFERENCES restaurant(id)
);

CREATE TABLE restaurant_specific_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_url TEXT NOT NULL, 
    product_url TEXT NOT NULL, 
    revenue_url TEXT NOT NULL, 
    feedback_url TEXT,
    specific_data_id UUID,
    FOREIGN KEY (specific_data_id) REFERENCES restaurant_website_data(id)
);

-- Session Table
CREATE TABLE session (
  sid varchar PRIMARY KEY,
  sess json NOT NULL,
  expire timestamp NOT NULL
);