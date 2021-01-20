import sqlite3

import click
from flask import current_app,g
from flask.cli import with_appcontext

def get_db():
    #gは特別なオブジェクトで、リクエスト毎に個別のものになる
    if 'db' not in g:
        #設定したDATABASEキーでデータベースのファイルへの接続をする
        #(現時点ではまだファイルは存在しない。後のデータベース初期化まで存在しないまま。)
        g.db = sqlite3.connect(
#current_appは特別なオブジェクト.リクエストを処理中の、Flaskアプリケーションを指し示す
            current_app.config['DATABASE'],
            detect_types = sqlite3.PARSE_DECLTYPES
        )
        #sqlite.rowはリストのようにふるまう行を返すようにconnectionへ伝える。
        #これにより、列名による列へのアクセスが可能になる
        g.db.row_factory = sqlite3.Row

    return g.db

#dbとの接続を閉じる
def close_db(e = None):
    db = g.pop('db',None)

    if db is not None:
        db.close()

def init_db():
    #get_dbは、ファイルから読み取ったコマンドを実行するために使用される、
    #データベースのconnectionを返す
    db = get_db()
    #schema.sqlを開いて、f変数名に代入。ファイルを読み込んでデコード
    #open_resource()は、パッケージflaskrから相対的な場所で指定されたファイルを開く
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

#click.command()は、init_db関数を呼び出して成功時のメッセージを表示する、
#init-dbと呼ばれる、コマンドラインから使用できるコマンドを定義
#データベースの初期化コマンド。このコマンドで新規DBが作成される
@click.command('init-db')
@with_appcontext
def init_db_command():
    """既存のデータを削除して、新しいテーブルを作成します。"""
    init_db()
    click.echo('データベースを初期化しました。')

def init_app(app):
    #レスポンスを返した後のクリーンアップを行っているときに、close_dbを呼び出すように、Flaskへ伝える
    app.teardown_appcontext(close_db)
    #flaskコマンドを使って呼び出すことができる新しいコマンドを追加
    app.cli.add_command(init_db_command)
