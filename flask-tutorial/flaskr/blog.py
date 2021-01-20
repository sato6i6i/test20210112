from flask import(
    Blueprint, flash, g, redirect, render_template, request,url_for
)
from werkzeug.exceptions import abort

from flaskr.auth import login_required
from flaskr.db import get_db

#__name__はBlueprintがどこで定義されているのかわかるようにするための引数
bp = Blueprint('blog',__name__)

@bp.route('/')
#最新の投稿記事を最初にして、投稿記事をすべて表示する
def index():
    db = get_db()#db接続
    #userテーブルとpostテーブルのidを関連づけて作者情報を取得
    posts = db.execute(
        'SELECT p.id, title, body, created,author_id,username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' ORDER BY created DESC'
    ).fetchall()
    return render_template('blog/index.html', posts = posts)

@bp.route('/create', methods = ('GET', 'POST'))
#auth.pyで書いたやつ。ログインしないとこのページに来られない、ログインページにリダイレクト
@login_required
def create():
    if request.method == 'POST':
        title = request.form['title']
        body = request.form['body']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'INSERT INTO post (title, body, author_id)'
                ' VALUES (?, ?, ?)',
                (title, body, g.user['id'])
            )
            db.commit()
            #BD格納し終わったら投稿記事表示画面にリダイレクト
            return redirect(url_for('blog.index'))

    return render_template('blog/create.html')
