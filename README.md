# 🐱 Cat Blog - Blog chia sẻ về mèo

Một trang web blog đẹp mắt và hiện đại để chia sẻ những khoảnh khắc đáng yêu của mèo, được xây dựng bằng Flask với giao diện thật đẹp và wow!

## ✨ Tính năng nổi bật

- 🎨 **Giao diện đẹp mắt**: Thiết kế hiện đại với gradient, animation và hiệu ứng đẹp mắt
- 📝 **Hệ thống blog hoàn chỉnh**: Đăng ký, đăng nhập, viết bài, bình luận
- 🖼️ **Upload ảnh**: Hỗ trợ upload ảnh cho bài viết
- ❤️ **Like và bình luận**: Tương tác với bài viết
- 🏷️ **Phân loại danh mục**: Dễ thương, hài hước, chăm sóc, mẹo hay, câu chuyện
- 📊 **Thống kê**: Theo dõi hoạt động người dùng
- 📱 **Responsive**: Tương thích với mọi thiết bị
- 🎭 **Animation**: Hiệu ứng mượt mà và thú vị

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Python 3.8+
- pip

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd cat-blog
```

### Bước 2: Tạo môi trường ảo
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### Bước 3: Cài đặt dependencies
```bash
pip install -r requirements.txt
```

### Bước 4: Chạy ứng dụng
```bash
python app.py
```

Ứng dụng sẽ chạy tại: `http://localhost:5000`

## 🌐 Deploy lên internet

### Sử dụng Render (Miễn phí)

1. Đăng ký tại [render.com](https://render.com)
2. Đảm bảo `requirements.txt` KHÔNG cần `greenlet` (Flask + SQLAlchemy vẫn hoạt động mà không cần greenlet). Nếu bạn gặp lỗi build `greenlet` trên Python 3.13, hãy xóa dòng `greenlet==...` khỏi `requirements.txt`.
3. Sử dụng file `render.yaml` đã kèm, Render sẽ tự set biến `PORT`. Gunicorn sẽ đọc biến này khi khởi chạy.
4. Khuyến nghị đặt `PYTHON_VERSION` là 3.11 trên Render để tương thích cao nhất.

### Sử dụng Railway/Heroku
- Tương tự, đảm bảo `gunicorn` có trong `requirements.txt` và app được start bằng `gunicorn app:app`.

### Sử dụng Railway (Miễn phí)

1. **Tạo tài khoản Railway**: Đăng ký tại [railway.app](https://railway.app)

2. **Kết nối GitHub**: Kết nối repository với Railway

3. **Deploy**: Railway sẽ tự động detect Flask app và deploy

### Sử dụng Heroku (Có phí)

1. **Tạo file `Procfile`**:
```
web: gunicorn app:app
```

2. **Deploy lên Heroku**:
```bash
heroku create your-cat-blog
git push heroku main
```

## 📁 Cấu trúc dự án

```
cat-blog/
├── app.py                 # File chính Flask
├── requirements.txt       # Dependencies
├── README.md             # Hướng dẫn
├── templates/            # HTML templates
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── new_post.html
│   ├── post_detail.html
│   ├── category.html
│   └── profile.html
├── static/               # Static files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   └── uploads/
└── cat_blog.db          # SQLite database (tự tạo)
```

## 🎨 Tùy chỉnh giao diện

### Thay đổi màu sắc
Chỉnh sửa file `static/css/style.css`:
```css
:root {
    --primary-color: #ff6b6b;      /* Màu chính */
    --secondary-color: #4ecdc4;    /* Màu phụ */
    --accent-color: #45b7d1;       /* Màu nhấn */
    --dark-color: #2c3e50;         /* Màu tối */
    --light-color: #ecf0f1;        /* Màu sáng */
}
```

### Thêm animation
Thêm CSS animation vào `static/css/style.css`:
```css
@keyframes yourAnimation {
    from { transform: scale(1); }
    to { transform: scale(1.1); }
}
```

## 🔧 Tính năng nâng cao

### Thêm tính năng tìm kiếm
```python
@app.route('/search')
def search():
    query = request.args.get('q', '')
    posts = Post.query.filter(Post.title.contains(query)).all()
    return render_template('search.html', posts=posts, query=query)
```

### Thêm tính năng follow
```python
class Follow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    followed_id = db.Column(db.Integer, db.ForeignKey('user.id'))
```

### Thêm tính năng notification
```python
class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    message = db.Column(db.String(200))
    read = db.Column(db.Boolean, default=False)
```

## 🐛 Xử lý lỗi thường gặp

### Lỗi database
```bash
# Xóa database cũ và tạo mới
rm cat_blog.db
python app.py
```

### Lỗi upload ảnh
- Kiểm tra thư mục `static/uploads/` có tồn tại
- Kiểm tra quyền ghi file
- Kiểm tra kích thước file (tối đa 16MB)

### Lỗi CSS/JS không load
- Kiểm tra đường dẫn file static
- Clear cache trình duyệt
- Kiểm tra console developer tools

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs trong terminal
2. Kiểm tra console browser
3. Tạo issue trên GitHub

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

**🐱 Made with ❤️ for cat lovers everywhere! 🐱** 