from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from markupsafe import Markup, escape
from PIL import Image
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cat_blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folders exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(os.path.join('static', 'uploads', 'avatars'), exist_ok=True)

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    avatar = db.Column(db.String(200), default='default-avatar.jpg')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    posts = db.relationship('Post', backref='author', lazy=True)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(200))
    category = db.Column(db.String(50), default='general')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    likes = db.relationship('Like', backref='post', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='post', lazy=True, cascade='all, delete-orphan')

class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    author = db.relationship('User', backref='comments')

# Jinja filter
@app.template_filter('nl2br')
def nl2br(value: str) -> Markup:
    if not value:
        return Markup("")
    safe_text = escape(value)
    return Markup(safe_text.replace('\n', Markup('<br>')))

# Routes
@app.route('/')
def index():
    page = request.args.get('page', 1, type=int)
    posts = Post.query.order_by(Post.created_at.desc()).paginate(
        page=page, per_page=6, error_out=False)
    liked_post_ids = set()
    if 'user_id' in session:
        liked_post_ids = {like.post_id for like in Like.query.filter_by(user_id=session['user_id']).all()}
    return render_template('index.html', posts=posts, liked_post_ids=liked_post_ids)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        if User.query.filter_by(username=username).first():
            flash('Username already exists!', 'error')
            return redirect(url_for('register'))
        
        if User.query.filter_by(email=email).first():
            flash('Email already registered!', 'error')
            return redirect(url_for('register'))
        
        user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password)
        )
        db.session.add(user)
        db.session.commit()
        
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            session['username'] = user.username
            flash('Login successful!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password!', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))

@app.route('/post/new', methods=['GET', 'POST'])
def new_post():
    if 'user_id' not in session:
        flash('Please login to create a post!', 'error')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        category = request.form['category']
        
        image = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename:
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                image = filename
        
        post = Post(
            title=title,
            content=content,
            category=category,
            image=image,
            user_id=session['user_id']
        )
        db.session.add(post)
        db.session.commit()
        
        flash('Post created successfully!', 'success')
        return redirect(url_for('index'))
    
    return render_template('new_post.html')

@app.route('/post/<int:post_id>')
def post_detail(post_id):
    post = Post.query.get_or_404(post_id)
    liked_by_me = False
    if 'user_id' in session:
        liked_by_me = Like.query.filter_by(user_id=session['user_id'], post_id=post_id).first() is not None
    return render_template('post_detail.html', post=post, liked_by_me=liked_by_me)

@app.route('/post/<int:post_id>/like', methods=['POST'])
def like_post(post_id):
    if 'user_id' not in session:
        return {'error': 'Please login to like posts'}, 401
    
    existing_like = Like.query.filter_by(
        user_id=session['user_id'], 
        post_id=post_id
    ).first()
    
    if existing_like:
        db.session.delete(existing_like)
        db.session.commit()
        return {'liked': False, 'count': len(Post.query.get(post_id).likes)}
    else:
        like = Like(user_id=session['user_id'], post_id=post_id)
        db.session.add(like)
        db.session.commit()
        return {'liked': True, 'count': len(Post.query.get(post_id).likes)}

@app.route('/post/<int:post_id>/comment', methods=['POST'])
def add_comment(post_id):
    if 'user_id' not in session:
        flash('Please login to comment!', 'error')
        return redirect(url_for('post_detail', post_id=post_id))
    
    content = request.form['content']
    if content.strip():
        comment = Comment(
            content=content,
            user_id=session['user_id'],
            post_id=post_id
        )
        db.session.add(comment)
        db.session.commit()
        flash('Comment added successfully!', 'success')
    
    return redirect(url_for('post_detail', post_id=post_id))

@app.route('/profile')
def profile():
    if 'user_id' not in session:
        flash('Please login to view your profile!', 'error')
        return redirect(url_for('login'))
    
    user = User.query.get(session['user_id'])
    posts = Post.query.filter_by(user_id=session['user_id']).order_by(Post.created_at.desc()).all()
    total_likes = sum(len(p.likes) for p in posts)
    total_comments = sum(len(p.comments) for p in posts)
    category_counts = {}
    for p in posts:
        category_counts[p.category] = category_counts.get(p.category, 0) + 1
    liked_post_ids = set()
    if 'user_id' in session:
        liked_post_ids = {like.post_id for like in Like.query.filter_by(user_id=session['user_id']).all()}
    return render_template('profile.html', user=user, posts=posts,
                           total_likes=total_likes, total_comments=total_comments,
                           category_counts=category_counts, liked_post_ids=liked_post_ids)

@app.route('/category/<category>')
def category(category):
    page = request.args.get('page', 1, type=int)
    posts = Post.query.filter_by(category=category).order_by(Post.created_at.desc()).paginate(
        page=page, per_page=6, error_out=False)
    # Stats for current page
    page_likes = sum(len(p.likes) for p in posts.items)
    page_comments = sum(len(p.comments) for p in posts.items)
    liked_post_ids = set()
    if 'user_id' in session:
        liked_post_ids = {like.post_id for like in Like.query.filter_by(user_id=session['user_id']).all()}
    return render_template('category.html', posts=posts, category=category,
                           page_likes=page_likes, page_comments=page_comments, liked_post_ids=liked_post_ids)

@app.route('/profile/avatar', methods=['POST'])
def upload_avatar():
    if 'user_id' not in session:
        return jsonify({'error': 'Please login to upload avatar'}), 401
    
    if 'avatar' not in request.files:
        return jsonify({'error': 'No file selected'}), 400
    
    file = request.files['avatar']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        try:
            # Generate unique filename
            filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
            
            # Save and resize image
            filepath = os.path.join('static', 'uploads', 'avatars', filename)
            
            # Open and resize image
            image = Image.open(file.stream)
            
            # Convert to RGB if necessary
            if image.mode in ('RGBA', 'LA', 'P'):
                image = image.convert('RGB')
            
            # Resize to 200x200
            image = image.resize((200, 200), Image.Resampling.LANCZOS)
            image.save(filepath, 'JPEG', quality=85)
            
            # Update user avatar
            user = User.query.get(session['user_id'])
            
            # Delete old avatar if exists
            if user.avatar and user.avatar != 'default-avatar.jpg':
                old_path = os.path.join('static', 'uploads', 'avatars', user.avatar)
                if os.path.exists(old_path):
                    os.remove(old_path)
            
            user.avatar = filename
            db.session.commit()
            
            return jsonify({'success': True, 'avatar': filename})
            
        except Exception as e:
            return jsonify({'error': f'Error processing image: {str(e)}'}), 500
    
    return jsonify({'error': 'Invalid file type. Please upload JPG, PNG, or GIF'}), 400

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Initialize database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True) 