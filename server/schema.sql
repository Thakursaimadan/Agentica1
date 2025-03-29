-- Create ENUM types
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed');
CREATE TYPE request_status AS ENUM ('pending', 'success', 'failed');

-- Mess Table
CREATE TABLE Mess (
  mess_id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  capacity INT NOT NULL
);

-- Users Table
CREATE TABLE Users (
  user_id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  mess_id INT NOT NULL,
  password TEXT NOT NULL,
  FOREIGN KEY(mess_id) REFERENCES Mess(mess_id)
);

-- Announcements Table
CREATE TABLE Announcements (
  mess_id INT NOT NULL,
  content TEXT NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  FOREIGN KEY(mess_id) REFERENCES Mess(mess_id)
);

-- Special_Items Table
CREATE TABLE Special_Items (
  item_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL
);

-- Orders Table
CREATE TABLE Orders (
  order_id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  is_redeemed BOOLEAN DEFAULT false,
  qr TEXT,
  redeemed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY(user_id) REFERENCES Users(user_id)
);

-- Order_items Table (Mapping table)
CREATE TABLE Order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY(order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY(item_id) REFERENCES Special_Items(item_id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE Reviews (
  review_id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  user_id TEXT NOT NULL,
  item_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY(user_id) REFERENCES Users(user_id),
  FOREIGN KEY(item_id) REFERENCES Special_Items(item_id)
);

-- Today_Special_Items Table
CREATE TABLE Today_Special_Items (
  item_id INT NOT NULL,
  mess_id INT NOT NULL,
  price INT NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  FOREIGN KEY(item_id) REFERENCES Special_Items(item_id),
  FOREIGN KEY(mess_id) REFERENCES Mess(mess_id)
);

-- Mess_requests Table
CREATE TABLE Mess_requests (
  request_id SERIAL PRIMARY KEY,
  requested_mess_id INT NOT NULL,
  user_id TEXT NOT NULL,
  status request_status NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY(user_id) REFERENCES Users(user_id),
  FOREIGN KEY(requested_mess_id) REFERENCES Mess(mess_id)
);
