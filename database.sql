/* Users */
CREATE TABLE users(
  user_id serial PRIMARY KEY,
  username TEXT NOT NULL,
  phone TEXT,
  delivery_address TEXT,
  created_on TIMESTAMP without time zone default (now() at time zone 'utc')
);

CREATE TABLE users_credentials(
  user_id INT PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE
);

CREATE TABLE users_cookie(
  id serial PRIMARY KEY,
  user_id INT NOT NULL,
  cookie TEXT NOT NULL,
  FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE
);



/* Admins */
CREATE TABLE admins(
  user_id INT PRIMARY KEY,
  full_access boolean NOT NULL,
  FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE
);

/* Product */
CREATE TABLE products(
  product_id serial PRIMARY KEY,
  title TEXT NOT NULL,
  techspecs TEXT,
  description TEXT,
  price INT NOT NULL,
  quantity INT NOT NULL,
  subcategory_id INT NOT NULL,
  created_on TIMESTAMP without time zone default (now() at time zone 'utc'),
  created_by INT NOT NULL
);
CREATE TABLE products_sales(
  product_id INT PRIMARY KEY,
  sales INT DEFAULT 0,
  FOREIGN KEY (product_id)
    REFERENCES products (product_id)
);
CREATE TABLE tags(
  tag_id serial PRIMARY KEY,
  title TEXT NOT NULL
);
CREATE TABLE products_tags(
  tag_id INT NOT NULL,
  product_id INT NOT NULL,
  FOREIGN KEY (tag_id)
    REFERENCES tags (tag_id),
  FOREIGN KEY (product_id)
    REFERENCES products (product_id)
);

CREATE TABLE users_cart(
  id serial PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE,
  FOREIGN KEY (product_id)
    REFERENCES products (product_id)
    ON DELETE CASCADE
);
/* Categories */
CREATE TABLE categories(
  category_id serial PRIMARY KEY,
  created_on TIMESTAMP without time zone default (now() at time zone 'utc'),
  created_by INT NOT NULL,
  title TEXT NOT NULL
);
CREATE TABLE subcategories(
  subcategory_id serial PRIMARY KEY,
  category_id INT NOT NULL,
  created_on TIMESTAMP without time zone default (now() at time zone 'utc'),
  created_by INT NOT NULL,
  title TEXT NOT NULL,
  FOREIGN KEY (category_id)
    REFERENCES categories (category_id)
    ON DELETE CASCADE
);
/* Orders */
CREATE TABLE orders(
  order_id serial PRIMARY KEY,
  created_on TIMESTAMP without time zone default (now() at time zone 'utc'),
  delivery_address TEXT NOT NULL,
  status INT NOT NULL,
  ordered_by INT NOT NULL,
  FOREIGN KEY (ordered_by)
    REFERENCES users (user_id)
    ON DELETE CASCADE
);
CREATE TABLE order_detail(
  order_detail_id serial PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price_one INT NOT NULL,
  FOREIGN KEY (order_id)
    REFERENCES orders (order_id)
    ON DELETE CASCADE,
  FOREIGN KEY (product_id)
    REFERENCES products (product_id)
    ON DELETE CASCADE
);
/* Discounts */
CREATE TABLE discounts(
  discount_id serial PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_to TIMESTAMP NOT NULL,
  created_on TIMESTAMP without time zone default (now() at time zone 'utc'),
  created_by INT NOT NULL,
  percent_discount INT NOT NULL,
  promocode TEXT NOT NULL
);
CREATE TABLE discounts_details(
  discount_id INT NOT NULL,
  product_id INT NOT NULL,
  FOREIGN KEY (discount_id)
    REFERENCES discounts (discount_id)
    ON DELETE CASCADE,
  FOREIGN KEY (product_id)
    REFERENCES products (product_id)
);

/* Reviews */
CREATE TABLE reviews(
  review_id serial PRIMARY KEY,
  sender_id INT NOT NULL,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  text TEXT NOT NULL,
  created_on TIMESTAMP without time zone default (now() at time zone 'utc'),
  FOREIGN KEY (sender_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE,
  FOREIGN KEY (product_id)
    REFERENCES products (product_id)
    ON DELETE CASCADE
);