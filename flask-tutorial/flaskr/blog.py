from flask import(
    Blueprint, flash, g, redirect, render_template, request,url_for
)
from werkzeug.exceptions import abort

from flaskr.auth import login_required
from flaskr.db import get_db

#__name__はBlueprintがどこで定義されているのかわかるようにするための引数
bp = Blueprint('blog',__name__)

@bp.route('/')
#最新の投稿記事を最初にして、投稿記事をすべて表示する（取得（GET））
def index():
    db = get_db()#db接続
    #userテーブルとpostテーブルのidを関連づけて作者情報を取得
    #postテーブルをp、userテーブルをuとして、postのauthor_idとuserのidを結合（JOIN）
    #ORDER BY created DESCは作成日（created）の降順に並び替え
    posts = db.execute(
        'SELECT p.id, title, body, created,author_id,username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' ORDER BY created DESC'
    ).fetchall()
    return render_template('blog/index.html', posts = posts)
#作成（create）
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
        #errorがNone出なかった時にerrorをユーザに表示する
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

def get_post(id, check_author=True):
    post = get_db().execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' WHERE p.id = ?',
        (id,)
    ).fetchone()
    if post is None:
        abort(404, "Post id {0} doesn't exist.".format(id))

    if check_author and post['author_id'] != g.user['id']:
        abort(403)

    return post
#更新（UPDATE）
#記事のidと更新ページのURL。上で作成した関数get_postでテーブルからそのidの一行をとってくる
#とってきた一行をpostに格納→これをHTMLの方で表示して書き換えてcreateと同じようにまたformを取得
@bp.route('/<int:id>/update', methods=('GET', 'POST'))
@login_required
def update(id):
    post = get_post(id)

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
                'UPDATE post SET title = ?, body = ?'
                ' WHERE id = ?',
                (title, body, id)
            )
            db.commit()
            #インデックス関数にリダイレクト
            return redirect(url_for('blog.index'))

    return render_template('blog/update.html', post=post)
#削除（DELETE）
#Deleteボタン押下で削除すべき行のidを送信し、このURLにきて、削除実行
#削除に関するテンプレートは特にないので、削除されたらindex関数に戻る
@bp.route('/<int:id>/delete', methods=('POST',))
@login_required
def delete(id):
    get_post(id)
    db = get_db()
    db.execute('DELETE FROM post WHERE id = ?', (id,))
    db.commit()
    return redirect(url_for('blog.index'))
