# Simple Dynamic Blog

This is a simple, dynamic blog application built with Node.js, Express, MongoDB, and EJS for templating.

## Features
- Create, view, and list blog posts.
- Dynamic content with MongoDB.
- Minimal design for quick deployment.

## Prerequisites
- Node.js installed.
- MongoDB installed locally or a MongoDB Atlas URI.

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone git@github.com:dhamsey3/myclimatechela.git
    cd blog-app
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure MongoDB:**
    - Update the connection string in `server.js`:
    ```js
    mongoose.connect('mongodb://127.0.0.1:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });
    ```

4. **Run the application:**
    ```bash
    node server.js
    ```

5. **Open in your browser:**
    - Visit `http://localhost:3000`

## Project Structure
```plaintext
📂 blog-app
   ├── 📂 models
   │    └── blogModel.js
   ├── 📂 views
   │    ├── index.ejs
   │    ├── new.ejs
   │    └── post.ejs
   ├── 📂 controllers
   │    └── blogController.js
   ├── 📂 routes
   │    └── blogRoutes.js
   ├── 📂 public
   │    └── 📂 css
   │         └── style.css
   ├── server.js
   ├── package.json
   └── README.md
```

## Deployment
- Use platforms like [Render](https://render.com/), [Railway](https://railway.app/), or AWS for deployment.

### Example Render Deployment
1. Push code to GitHub.
2. Link GitHub repo to Render.
3. Set build command: `npm install && node server.js`.
4. Add environment variables if needed.

## License
MIT License.

