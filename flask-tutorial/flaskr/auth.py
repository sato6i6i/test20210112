import functools

from flask import(
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash
from flaskr.db import get_db
#Blueprint（auth）の作成
#url_prefixは、blueprintと関連付けられる全てのURLの（パス部分の）先頭に付けられる
bp = Blueprint('auth',__name__,url_prefix = '/auth')

@bp.route('/register', methods = ('GET','POST'))
def register():
    #ユーザがformを送信した場合、request.methodはPOSTになる
    if  request.method == 'POST':
        #requestモジュールのformからusernameとpasswordを取得して、格納
        username = request.form['username']
        password = request.form['password']
        db = get_db()#db接続
        error = None

        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'
        elif db.execute(
            'SELECT id FROM user WHERE username = ?',(username,)
        #fetchone()はqueryの結果から一行を返す。queryが何も返さなければNoneを返す
        ).fetchone() is not None:
            error = 'User {} is already registered.'.format(username)

        if error is None:
            db.execute(
                'INSERT INTO user (username,password) VALUES (?,?)',
                (username,generate_password_hash(password))
            )
            db.commit()
            #redirect()は、生成されたURLへリダイレクトさせるレスポンスを生成
            return redirect(url_for('auth.login'))
        #検証失敗の際にエラーをユーザに表示する。
        flash(error)
 #ユーザがauth/registerを踏んだ時、または検証エラーの時に登録formのあるHTMLページを表示する
    return render_template('auth/register.html')
    #この時点でidはsessionに格納され、以降のリクエストで利用可能になる
#ログイン
@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None
        user = db.execute(
            'SELECT * FROM user WHERE username = ?', (username,)
        ).fetchone()

        if user is None:
            error = 'Incorrect username.'
        elif not check_password_hash(user['password'], password):
            error = 'Incorrect password.'

        if error is None:
            session.clear()
            session['user_id'] = user['id']
            return redirect(url_for('index'))

        flash(error)

    return render_template('auth/login.html')


    #viewの関数の前に実行する関数を登録
@bp.before_app_request
    #ユーザのデータを DBから取得する
def load_logged_in_user():
    user_id = session.get('user_id')
        #idがsessionまたは DBにない場合、g.userはNoneになる
    if user_id is None:
        g.user = None
    else:
        g.user =get_db().execute(
            'SELECT * FROM user WHERE id = ?',(user_id,)
        ).fetchone()

@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view
